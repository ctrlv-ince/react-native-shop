const { Order } = require('../models/order');
const { Product } = require('../models/product');
const { Expo } = require('expo-server-sdk');

exports.getOrders = async (req, res) => {
    const orderList = await Order.find()
        .populate('user', 'name')
        .populate('orderItems.product')
        .sort({ dateOrdered: -1 });

    if (!orderList) {
        return res.status(500).json({ success: false });
    }
    res.send(orderList);
};

exports.getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name email pushToken')
        .populate({
            path: 'orderItems.product',
            populate: 'category'
        });

    if (!order) {
        return res.status(500).json({ success: false });
    }
    res.send(order);
};

exports.createOrder = async (req, res) => {
    // Build order items array directly (no separate OrderItem collection)
    const orderItems = req.body.orderItems.map(item => ({
        quantity: item.quantity,
        product: item.product
    }));

    // Calculate total price
    const totalPrices = await Promise.all(
        orderItems.map(async (item) => {
            const product = await Product.findById(item.product).select('price');
            if (!product) return 0;
            return product.price * item.quantity;
        })
    );

    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

    let order = new Order({
        orderItems: orderItems,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    });
    order = await order.save();

    if (!order) return res.status(400).send('the order cannot be created!');

    res.send(order);
};

exports.updateOrder = async (req, res) => {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status
        },
        { new: true }
    ).populate('user');

    if (!order) return res.status(400).send('the order cannot be update!');

    if (order.user && order.user.pushToken && Expo.isExpoPushToken(order.user.pushToken)) {
        let expo = new Expo();
        let messages = [];
        messages.push({
            to: order.user.pushToken,
            sound: 'default',
            title: 'Order Status Updated',
            body: `Your order status has been updated to ${order.status}`,
            data: { orderId: order._id }
        });

        try {
            await expo.sendPushNotificationsAsync(messages);
            console.log("Push notification sent");
        } catch (error) {
            console.error("Error sending push notification", error);
        }
    }

    res.send(order);
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (order) {
            return res.status(200).json({ success: true, message: 'the order is deleted!' });
        } else {
            return res.status(404).json({ success: false, message: 'order not found!' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, error: err });
    }
};
