const { Order } = require('../models/order');
const { Product } = require('../models/product');
const { Expo } = require('expo-server-sdk');

// Create a new Expo SDK client
let expo = new Expo();

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
    // First find previous order to check status change
    const previousOrder = await Order.findById(req.params.id);
    if (!previousOrder) return res.status(400).send('Invalid Order ID');

    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status
        },
        { new: true }
    ).populate('user')
    .populate({
        path: 'orderItems.product',
        populate: 'category'
    });

    if (!order) return res.status(400).send('the order cannot be update!');

    // Decrement stock if transitioning to Delivered
    if (req.body.status === 'Delivered' && previousOrder.status !== 'Delivered') {
        const bulkUpdateOps = order.orderItems.map(item => {
            return {
                updateOne: {
                    filter: { _id: item.product },
                    update: { $inc: { stock: -item.quantity } }
                }
            };
        });
        if (bulkUpdateOps.length > 0) {
            await Product.bulkWrite(bulkUpdateOps);
            console.log('Stock decremented for delivered order');
        }
    }

    // 101: Notify user of status update
    if (order.user && order.user.pushToken) {
        if (!Expo.isExpoPushToken(order.user.pushToken)) {
            console.error(`Push token ${order.user.pushToken} is not a valid Expo push token`);
        } else {
            console.log(`Sending notification to user: ${order.user._id} via token: ${order.user.pushToken}`);
            const orderRef = order._id.toString().slice(-6).toUpperCase();
            const messages = [{
                to: order.user.pushToken,
                sound: 'default',
                title: 'Order Status Updated',
                body: `Your order #${orderRef} status has been updated to ${order.status}`,
                data: { orderId: order._id, orderHistory: true }
            }];

            try {
                const chunks = expo.chunkPushNotifications(messages);
                for (const chunk of chunks) {
                    const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                    console.log("Push notification response:", JSON.stringify(ticketChunk));
                }
            } catch (error) {
                console.error("Error sending push notification", error);
            }
        }
    } else {
        console.log("Skipping notification: User or pushToken missing", {
            userId: order.user ? order.user._id : 'missing',
            hasPushToken: !!(order.user && order.user.pushToken)
        });
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
