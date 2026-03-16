import React, { useState, useCallback } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import baseURL from '../../assets/common/baseurl';
import { useFocusEffect } from '@react-navigation/native';
import OrderCard from '../../Shared/OrderCard';

const Orders = (props) => {
    const [orderList, setOrderList] = useState();

    useFocusEffect(
        useCallback(() => {
            getOrders();
            return () => {
                setOrderList();
            };
        }, [])
    );

    const getOrders = () => {
        axios
            .get(`${baseURL}orders`)
            .then((x) => {
                setOrderList(x.data);
            })
            .catch((error) => console.log(error));
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={orderList}
                renderItem={({ item }) => (
                    <OrderCard navigation={props.navigation} {...item} editMode={true} />
                )}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5
    }
});

export default Orders;
