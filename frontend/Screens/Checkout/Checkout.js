import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { AuthContext } from '../../Context/Store/AuthGlobal';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../../Redux/Actions/cartActions';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import baseURL from '../../assets/common/baseurl';
import Toast from 'react-native-toast-message';
import { COLORS, SPACING, RADIUS, SHADOWS, COMMON_STYLES } from '../../assets/common/theme';

const Checkout = (props) => {
    const context = useContext(AuthContext);
    const cartItems = useSelector(state => state.cartItems);
    const dispatch = useDispatch();

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const confirmOrder = () => {
        Alert.alert(
            'Confirm Order',
            `Place order for ₱${total.toLocaleString()}?\n\nItems: ${cartItems.length}\nDelivery to your registered address.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Place Order',
                    onPress: async () => {
                        try {
                            const token = await SecureStore.getItemAsync('jwt');
                            const orderData = {
                                orderItems: cartItems.map(item => ({
                                    product: item.id,
                                    quantity: item.quantity,
                                })),
                                user: context.stateUser.user.userId,
                            };

                            await axios.post(`${baseURL}orders`, orderData, {
                                headers: { Authorization: `Bearer ${token}` }
                            });

                            dispatch(clearCart());
                            Toast.show({
                                topOffset: 60,
                                type: 'success',
                                text1: 'Order placed successfully!',
                                text2: 'Check your order history for updates'
                            });
                            props.navigation.navigate('Cart');
                        } catch (error) {
                            console.error(error);
                            Toast.show({
                                topOffset: 60,
                                type: 'error',
                                text1: 'Failed to place order',
                                text2: error.response?.data || error.message
                            });
                        }
                    }
                }
            ]
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Order Summary */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Order Summary</Text>

                {cartItems.map((item, index) => (
                    <View key={item.id || index} style={styles.itemRow}>
                        <Image
                            source={{ uri: item.image || 'https://fakeimg.pl/50x50/?text=P' }}
                            style={styles.itemImage}
                        />
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                            <Text style={styles.itemMeta}>₱{item.price?.toLocaleString()} × {item.quantity}</Text>
                        </View>
                        <Text style={styles.itemTotal}>₱{(item.price * item.quantity).toLocaleString()}</Text>
                    </View>
                ))}

                {/* Total */}
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalPrice}>₱{total.toLocaleString()}</Text>
                </View>
            </View>

            {/* Delivery Info */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Ionicons name="location-outline" size={18} color={COLORS.primary} />
                    <Text style={styles.cardHeaderText}>Delivery Address</Text>
                </View>
                <Text style={styles.addressText}>
                    Your order will be delivered to the address on your profile.
                </Text>
            </View>

            {/* Place Order Button */}
            <TouchableOpacity
                style={[COMMON_STYLES.primaryButton, { marginTop: SPACING.md }]}
                onPress={confirmOrder}
                activeOpacity={0.7}
            >
                <Text style={COMMON_STYLES.primaryButtonText}>Place Order</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
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
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.md,
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
    itemTotal: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.primary,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: SPACING.md,
        marginTop: SPACING.sm,
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
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: SPACING.sm,
    },
    cardHeaderText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text,
    },
    addressText: {
        fontSize: 14,
        color: COLORS.textMuted,
        lineHeight: 20,
    },
});

export default Checkout;
