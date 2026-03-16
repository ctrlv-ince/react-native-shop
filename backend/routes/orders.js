const { Order } = require('../models/order');
const { OrderItem } = require('../models/order-item');
const express = require('express');
const { Expo } = require('expo-server-sdk');
const router = express.Router();

router.get(`/`, async (req, res) => {
    const orderList = await Order.find().populate('user', 'name').sort({ dateOrdered: -1 });

    if (!orderList) {
        res.status(500).json({ success: false });
    }
    res.send(orderList);
});

router.get(`/:id`, async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name email pushToken')
        .populate({
            path: 'orderItems',
            populate: {
                path: 'product',
                populate: 'category'
            }
        });

    if (!order) {
        res.status(500).json({ success: false });
    }
    res.send(order);
});

router.post('/', async (req, res) => {
    const orderItemsIds = Promise.all(
        req.body.orderItems.map(async (orderItem) => {
            let newOrderItem = new OrderItem({
                quantity: orderItem.quantity,
                product: orderItem.product
            });

            newOrderItem = await newOrderItem.save();
            return newOrderItem._id;
        })
    );
    const orderItemsIdsResolved = await orderItemsIds;

    const totalPrices = await Promise.all(
        orderItemsIdsResolved.map(async (orderItemId) => {
            const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
            const totalPrice = orderItem.product.price * orderItem.quantity;
            return totalPrice;
        })
    );

    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

    let order = new Order({
        orderItems: orderItemsIdsResolved,
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
});

router.put('/:id', async (req, res) => {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status
        },
        { new: true }
    ).populate('user');

    if (!order) return res.status(400).send('the order cannot be update!');

    // PUSH NOTIFICATION FOR TERM TEST TRANSACTION REQUIREMENT IS HANDLED SEPARATELY IN A DIFFERENT FILE OR BELOW
    // Wait, the professor asked to send a push notification after the update! I can do it here or via another frontend endpoint call. Doing it here.
    // Fetch user push token from user reference in order.
    
    // We will do push logic when we configure expo-server-sdk.
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
});

router.delete('/:id', (req, res) => {
    Order.findByIdAndDelete(req.params.id)
        .then(async (order) => {
            if (order) {
                await order.orderItems.map(async (orderItem) => {
                    await OrderItem.findByIdAndDelete(orderItem);
                });
                return res.status(200).json({ success: true, message: 'the order is deleted!' });
            } else {
                return res.status(404).json({ success: false, message: 'order not found!' });
            }
        })
        .catch((err) => {
            return res.status(500).json({ success: false, error: err });
        });
});

module.exports = router;
