import React, { useState, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import baseURL from '../../assets/common/baseurl';
import { AuthContext } from '../../Context/Store/AuthGlobal';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../assets/common/theme';

const OrderHistory = (props) => {
    const context = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            if (context.stateUser.isAuthenticated) {
                const userId = context.stateUser.user.userId;
                SecureStore.getItemAsync('jwt').then(token => {
                    axios.get(`${baseURL}orders/user/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    .then(res => {
                        setOrders(res.data);
                        setLoading(false);
                    })
                    .catch(() => setLoading(false));
                });
            }
            return () => {
                setOrders([]);
                setLoading(true);
            };
        }, [])
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return COLORS.success;
            case 'Shipped': return COLORS.warning;
            default: return COLORS.danger;
        }
    };

    const totalPrice = (items) => {
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    if (loading) return (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
    );

    return (
        <View style={styles.container}>
            {orders.length > 0 ? (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    renderItem={({ item: order }) => (
                        <View style={styles.orderCard}>
                            {/* Order Header */}
                            <View style={styles.orderHeader}>
                                <View>
                                    <Text style={styles.orderId}>#{order._id?.slice(-6)}</Text>
                                    <Text style={styles.orderDate}>{order.dateOrdered?.split('T')[0]}</Text>
                                </View>
                                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '15' }]}>
                                    <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>{order.status}</Text>
                                </View>
                            </View>

                            {/* Order Items */}
                            {order.orderItems.map((item, index) => (
                                <View key={item._id || index} style={styles.itemRow}>
                                    <Image
                                        source={{ uri: item.product?.images?.[0]?.url || 'https://fakeimg.pl/60x60/?text=Product' }}
                                        style={styles.itemImage}
                                    />
                                    <View style={styles.itemInfo}>
                                        <Text style={styles.itemName} numberOfLines={1}>{item.product?.name || 'Product'}</Text>
                                        <Text style={styles.itemMeta}>₱{item.price?.toLocaleString()} × {item.quantity}</Text>
                                    </View>

                                    {/* Review button — only for delivered orders */}
                                    {order.status === 'Delivered' && (
                                        <TouchableOpacity
                                            style={[
                                                styles.reviewBtn,
                                                item.isReviewed && styles.reviewBtnDone,
                                            ]}
                                            onPress={() => {
                                                if (item.product?._id) {
                                                    props.navigation.navigate('Review Form', {
                                                        productId: item.product._id,
                                                        orderId: order._id,
                                                        productName: item.product.name,
                                                    });
                                                }
                                            }}
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons
                                                name={item.isReviewed ? "checkmark-circle" : "star-outline"}
                                                size={14}
                                                color={item.isReviewed ? COLORS.success : COLORS.primary}
                                            />
                                            <Text style={[
                                                styles.reviewBtnText,
                                                item.isReviewed && { color: COLORS.success }
                                            ]}>
                                                {item.isReviewed ? 'Reviewed' : 'Review'}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ))}

                            {/* Total */}
                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Total</Text>
                                <Text style={styles.totalPrice}>₱{totalPrice(order.orderItems).toLocaleString()}</Text>
                            </View>
                        </View>
                    )}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Ionicons name="receipt-outline" size={64} color={COLORS.textLight} />
                    <Text style={styles.emptyText}>No orders yet</Text>
                    <Text style={styles.emptySubtext}>Your order history will appear here</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: SPACING.base,
    },
    orderCard: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.lg,
        padding: SPACING.base,
        marginBottom: SPACING.md,
        ...SHADOWS.medium,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
        paddingBottom: SPACING.sm,
        borderBottomWidth: 1,
        borderColor: COLORS.border,
    },
    orderId: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.text,
    },
    orderDate: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginTop: 2,
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
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderColor: COLORS.border,
    },
    itemImage: {
        width: 44,
        height: 44,
        borderRadius: RADIUS.sm,
        backgroundColor: COLORS.surfaceAlt,
        marginRight: SPACING.md,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
    },
    itemMeta: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginTop: 2,
    },
    reviewBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 6,
        borderRadius: RADIUS.sm,
        backgroundColor: COLORS.primaryLight,
    },
    reviewBtnDone: {
        backgroundColor: COLORS.success + '15',
    },
    reviewBtnText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.primary,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: SPACING.md,
    },
    totalLabel: {
        fontSize: 14,
        color: COLORS.textMuted,
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.primary,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textMuted,
        marginTop: SPACING.md,
    },
    emptySubtext: {
        fontSize: 14,
        color: COLORS.textLight,
        marginTop: 4,
    },
});

export default OrderHistory;
