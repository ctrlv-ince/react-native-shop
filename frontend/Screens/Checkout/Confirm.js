import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Button, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../Redux/Actions/cartActions';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import baseURL from '../../assets/common/baseurl';

var { width, height } = Dimensions.get('window');

const Confirm = (props) => {
    const finalOrder = props.route.params;
    const dispatch = useDispatch();

    const confirmOrder = () => {
        const orderParams = finalOrder.order.order;

        axios
            .post(`${baseURL}orders`, orderParams)
            .then((res) => {
                if (res.status == 200 || res.status == 201) {
                    Toast.show({
                        topOffset: 60,
                        type: 'success',
                        text1: 'Order Completed',
                        text2: 'Thank you for your purchase!'
                    });
                    
                    setTimeout(() => {
                        dispatch(clearCart());
                        props.navigation.navigate('Cart');
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
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Confirm Order</Text>
                {props.route.params ? (
                    <View style={{ borderWidth: 1, borderColor: 'orange', padding: 10, marginTop: 20 }}>
                        <Text style={styles.title}>Shipping to:</Text>
                        <View style={{ padding: 8 }}>
                            <Text>Address: {finalOrder.order.order.shippingAddress1}</Text>
                            <Text>Address2: {finalOrder.order.order.shippingAddress2}</Text>
                            <Text>City: {finalOrder.order.order.city}</Text>
                            <Text>Zip Code: {finalOrder.order.order.zip}</Text>
                            <Text>Country: {finalOrder.order.order.country}</Text>
                        </View>
                        <Text style={styles.title}>Items:</Text>
                        {finalOrder.order.order.orderItems.map((x) => {
                            return (
                                <View style={styles.listItem} key={x.product ? x.product : Math.random()}>
                                    <View>
                                        <Text>Product ID: {x.product || x.id}</Text>
                                    </View>
                                    <Text>Price: {x.price}</Text>
                                    <Text>Quantity: {x.quantity}</Text>
                                </View>
                            );
                        })}
                    </View>
                ) : null}
                <View style={{ alignItems: 'center', margin: 20 }}>
                    <Button title={'Place order'} onPress={confirmOrder} />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        height: height,
        padding: 8,
        alignContent: 'center',
        backgroundColor: 'white'
    },
    titleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 8
    },
    title: {
        alignSelf: 'center',
        margin: 8,
        fontSize: 16,
        fontWeight: 'bold'
    },
    listItem: {
        alignItems: 'center',
        backgroundColor: 'white',
        justifyContent: 'center',
        width: width / 1.2,
        padding: 5
    }
});

export default Confirm;
