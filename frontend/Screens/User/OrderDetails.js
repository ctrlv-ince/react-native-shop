import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import baseURL from '../../assets/common/baseurl';

const OrderDetails = (props) => {
    const [order, setOrder] = useState();
    
    useEffect(() => {
        // ID could be passed in params either from Notification or from List
        const orderId = props.route.params ? props.route.params.orderId : null;
        if (orderId) {
            axios.get(`${baseURL}orders/${orderId}`)
                .then((res) => {
                    setOrder(res.data);
                })
                .catch((error) => console.log(error));
        }

        return () => { setOrder(); }
    }, []);

    if (!order) return <View style={styles.center}><Text>Loading...</Text></View>;

    return (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
            <View style={{ marginBottom: 20 }}>
                 <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Order #{order.id}</Text>
                 <Text>Status: {order.status}</Text>
                 <Text>Date: {order.dateOrdered.split('T')[0]}</Text>
            </View>

            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Shipping Address:</Text>
            <View style={{ marginBottom: 20 }}>
                 <Text>{order.shippingAddress1}</Text>
                 <Text>{order.shippingAddress2}</Text>
                 <Text>{order.city}, {order.zip}</Text>
                 <Text>{order.country}</Text>
            </View>

            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Items:</Text>
            {order.orderItems.map(item => (
                <View key={item._id} style={styles.itemRow}>
                     <Text>{item.product?.name || item.product}</Text>
                     <Text>Qty: {item.quantity}</Text>
                </View>
            ))}

            <View style={{ marginTop: 20, alignItems: 'flex-end' }}>
                 <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'red' }}>Total: $ {order.totalPrice}</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderBottomWidth: 1,
        borderColor: '#eee'
    }
});

export default OrderDetails;
