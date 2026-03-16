import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../Redux/Actions/orderActions';
import { useFocusEffect } from '@react-navigation/native';
import OrderCard from '../../Shared/OrderCard';

const Orders = (props) => {
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector(state => state.ordersState);

    useFocusEffect(
        useCallback(() => {
            dispatch(fetchOrders());
        }, [dispatch])
    );

    if (loading) return <ActivityIndicator size="large" color="red" />;
    return (
        <View style={styles.container}>
            <FlatList
                data={orders}
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
