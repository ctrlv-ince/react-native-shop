import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import baseURL from '../../assets/common/baseurl';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../assets/common/theme';

const OrderDetails = (props) => {
    const [order, setOrder] = useState();
    
    useEffect(() => {
        const orderId = props.route.params ? props.route.params.orderId : null;
        if (orderId) {
            SecureStore.getItemAsync('jwt').then(token => {
                axios.get(`${baseURL}orders/${orderId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then((res) => setOrder(res.data))
                .catch((error) => console.log(error));
            });
        }

        return () => { setOrder(); }
    }, []);

    if (!order) return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
    );

    const getStatusColor = (status) => {
        switch(status) {
            case 'Delivered': return COLORS.success;
            case 'Shipped': return COLORS.warning;
            default: return COLORS.danger;
        }
    };

    const totalPrice = order.orderItems?.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0) || 0;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Order Header */}
            <View style={styles.card}>
                <View style={styles.orderHeaderRow}>
                    <Text style={styles.orderId}>Order #{order._id?.slice(-6)}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '15' }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>{order.status}</Text>
                    </View>
                </View>
                <Text style={styles.dateText}>
                    <Ionicons name="calendar-outline" size={13} color={COLORS.textMuted} /> {order.dateOrdered?.split('T')[0]}
                </Text>
            </View>

            {/* Shipping (User address) */}
            {order.user?.address && (
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="location-outline" size={18} color={COLORS.primary} />
                        <Text style={styles.cardTitle}>Shipping Address</Text>
                    </View>
                    <View style={styles.addressBlock}>
                        <Text style={styles.addressLine}>{order.user.name}</Text>
                        <Text style={styles.addressLine}>{order.user.address}</Text>
                    </View>
                </View>
            )}

            {/* Items */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Ionicons name="bag-outline" size={18} color={COLORS.primary} />
                    <Text style={styles.cardTitle}>Items</Text>
                </View>
                {order.orderItems.map(item => (
                    <View key={item._id} style={styles.itemRow}>
                        <Image
                            source={{ uri: item.product?.images?.[0]?.url || 'https://fakeimg.pl/40x40/?text=P' }}
                            style={styles.itemImage}
                        />
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemName} numberOfLines={1}>{item.product?.name || 'Product'}</Text>
                            <Text style={styles.itemMeta}>₱{item.price?.toLocaleString()} × {item.quantity}</Text>
                        </View>
                        <Text style={styles.itemTotal}>₱{(item.price * item.quantity).toLocaleString()}</Text>
                    </View>
                ))}
            </View>

            {/* Total */}
            <View style={styles.totalCard}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalPrice}>₱ {totalPrice.toLocaleString()}</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    container: {
        padding: SPACING.base,
        backgroundColor: COLORS.background,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        ...SHADOWS.medium,
    },
    orderHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    orderId: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.text,
    },
    statusBadge: {
        paddingHorizontal: SPACING.md,
        paddingVertical: 4,
        borderRadius: RADIUS.xl,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
    },
    dateText: {
        fontSize: 13,
        color: COLORS.textMuted,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: SPACING.md,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text,
    },
    addressBlock: {
        paddingLeft: 26,
    },
    addressLine: {
        fontSize: 14,
        color: COLORS.textMuted,
        lineHeight: 22,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.sm,
        borderBottomWidth: 1,
        borderColor: COLORS.border,
    },
    itemImage: {
        width: 40,
        height: 40,
        borderRadius: RADIUS.sm,
        backgroundColor: COLORS.surfaceAlt,
        marginRight: SPACING.md,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 14,
        color: COLORS.text,
        fontWeight: '600',
    },
    itemMeta: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginTop: 2,
    },
    itemTotal: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.primary,
    },
    totalCard: {
        backgroundColor: COLORS.primaryLight,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    totalPrice: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.primary,
    },
});

export default OrderDetails;
