import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import baseURL from '../assets/common/baseurl';

const OrderCard = (props) => {
    const [orderStatus, setOrderStatus] = useState('');
    const [statusText, setStatusText] = useState('');
    const [statusChange, setStatusChange] = useState('');
    const [cardColor, setCardColor] = useState('#E74C3C');

    useEffect(() => {
        if (props.status == '3') {
            setOrderStatus(<Text>Shipped</Text>);
            setStatusText('Shipped');
            setCardColor('#2ECC71');
        } else if (props.status == '2') {
            setOrderStatus(<Text>Shipped</Text>);
            setStatusText('Shipped');
            setCardColor('#F1C40F');
        } else {
            setOrderStatus(<Text>Pending</Text>);
            setStatusText('Pending');
            setCardColor('#E74C3C');
        }

        return () => {
            setOrderStatus();
            setStatusText();
            setCardColor();
        };
    }, []);

    const updateOrder = () => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const order = {
            city: props.city,
            country: props.country,
            dateOrdered: props.dateOrdered,
            id: props.id,
            orderItems: props.orderItems,
            phone: props.phone,
            shippingAddress1: props.shippingAddress1,
            shippingAddress2: props.shippingAddress2,
            status: statusChange,
            totalPrice: props.totalPrice,
            user: props.user,
            zip: props.zip
        };

        axios
            .put(`${baseURL}orders/${props.id}`, order, config)
            .then((res) => {
                if (res.status == 200 || res.status == 201) {
                    Toast.show({
                        topOffset: 60,
                        type: 'success',
                        text1: 'Order Edited',
                        text2: ''
                    });
                    setTimeout(() => {
                        props.navigation.navigate('Products');
                    }, 500);
                }
            })
            .catch((error) => {
                Toast.show({
                    topOffset: 60,
                    type: 'error',
                    text1: 'Something went wrong',
                    text2: 'Please try again'
                });
            });
    };

    return (
        <View style={[{ backgroundColor: cardColor }, styles.container]}>
            <View style={styles.container}>
                <Text>Order Number: #{props.id}</Text>
            </View>
            <View style={{ marginTop: 10 }}>
                <Text>Status: {statusText}</Text>
                <Text>Address: {props.shippingAddress1}</Text>
                <Text>City: {props.city}</Text>
                <Text>Country: {props.country}</Text>
                <Text>Date Ordered: {props.dateOrdered.split('T')[0]}</Text>
            </View>
            <View style={styles.priceContainer}>
                <Text>Price: </Text>
                <Text style={styles.price}>$ {props.totalPrice}</Text>
            </View>
            {props.editMode ? (
                <View style={{ marginTop: 20 }}>
                    <Button title="Mark as Shipped" onPress={() => setStatusChange('3')} />
                    <View style={{ marginBottom: 10 }}/>
                    <Button color="green" title="Update Order" onPress={() => updateOrder()} />
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        margin: 10,
        borderRadius: 10
    },
    priceContainer: {
        marginTop: 10,
        alignSelf: 'flex-end',
        flexDirection: 'row'
    },
    price: {
        color: 'white',
        fontWeight: 'bold'
    }
});

export default OrderCard;
