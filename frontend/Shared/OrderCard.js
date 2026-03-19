import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useDispatch } from 'react-redux';
import { updateOrderStatus } from '../Redux/Actions/orderActions';
import Toast from 'react-native-toast-message';

const OrderCard = (props) => {
    const dispatch = useDispatch();
    const [statusText, setStatusText] = useState('');
    const [cardColor, setCardColor] = useState('#E74C3C');
    const [statusChange, setStatusChange] = useState('');

    useEffect(() => {
        if (props.status === 'Delivered') {
            setStatusText('Delivered');
            setCardColor('#2ECC71');
        } else if (props.status === 'Shipped') {
            setStatusText('Shipped');
            setCardColor('#F1C40F');
        } else {
            setStatusText('Pending');
            setCardColor('#E74C3C');
        }

        return () => {
            setStatusText('');
            setCardColor('');
        };
    }, [props.status]);

    const updateOrder = () => {
        if (!statusChange) {
            Toast.show({
                topOffset: 60,
                type: 'error',
                text1: 'Please select a status first'
            });
            return;
        }

        dispatch(updateOrderStatus(props.id, statusChange));
        Toast.show({
            topOffset: 60,
            type: 'success',
            text1: 'Order Updated',
            text2: `Status changed to ${statusChange}`
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
                    <Button title="Mark as Pending" color="#E74C3C" onPress={() => setStatusChange('Pending')} />
                    <View style={{ marginBottom: 5 }}/>
                    <Button title="Mark as Shipped" color="#F1C40F" onPress={() => setStatusChange('Shipped')} />
                    <View style={{ marginBottom: 5 }}/>
                    <Button title="Mark as Delivered" color="#2ECC71" onPress={() => setStatusChange('Delivered')} />
                    <View style={{ marginBottom: 10 }}/>
                    {statusChange ? <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Selected: {statusChange}</Text> : null}
                    <View style={{ marginBottom: 5 }}/>
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
