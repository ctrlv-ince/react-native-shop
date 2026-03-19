import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../Redux/Actions/orderActions';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import OrderCard from '../../Shared/OrderCard';
import { COLORS, SPACING } from '../../assets/common/theme';

const Orders = (props) => {
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector(state => state.ordersState);

    useFocusEffect(
        useCallback(() => {
            dispatch(fetchOrders());
        }, [dispatch])
    );

    if (loading) return (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
    );

    return (
        <View style={styles.container}>
            {orders && orders.length > 0 ? (
                <FlatList
                    data={orders}
                    renderItem={({ item }) => (
                        <OrderCard navigation={props.navigation} {...item} editMode={true} />
                    )}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Ionicons name="receipt-outline" size={64} color={COLORS.textLight} />
                    <Text style={styles.emptyText}>No orders yet</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: SPACING.sm,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.textMuted,
        marginTop: SPACING.md,
    },
});

export default Orders;
