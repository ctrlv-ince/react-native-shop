const { Order } = require('../models/order');
const { Product } = require('../models/product');

exports.getOrders = async (req, res) => {
    const orderList = await Order.find()
        .populate('user', 'name photo')
        .populate('orderItems.product')
        .sort({ dateOrdered: -1 });

    if (!orderList) {
        return res.status(500).json({ success: false });
    }
    res.send(orderList);
};

exports.getOrdersByUser = async (req, res) => {
    const userOrderList = await Order.find({ user: req.params.userId })
        .populate({
            path: 'orderItems.product',
            select: 'name images price',
        })
        .sort({ dateOrdered: -1 });

    if (!userOrderList) {
        return res.status(500).json({ success: false });
    }
    res.send(userOrderList);
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
    // Build order items with price looked up from the Product model
    const orderItems = await Promise.all(
        req.body.orderItems.map(async (item) => {
            const product = await Product.findById(item.product).select('price');
            if (!product) throw new Error(`Product not found: ${item.product}`);
            return {
                quantity: item.quantity,
                product: item.product,
                price: product.price,
            };
        })
    );

    let order = new Order({
        orderItems: orderItems,
        status: req.body.status || 'Pending',
        user: req.body.user,
    });
    order = await order.save();

    if (!order) return res.status(400).send('the order cannot be created!');

    res.send(order);
};

exports.updateOrder = async (req, res) => {
    const { Expo } = await import('expo-server-sdk');
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
