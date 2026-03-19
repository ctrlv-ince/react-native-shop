import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../Redux/Actions/cartActions';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import baseURL from '../../assets/common/baseurl';
import { COLORS, SPACING, RADIUS, SHADOWS, COMMON_STYLES } from '../../assets/common/theme';

var { width, height } = Dimensions.get('window');

const Confirm = (props) => {
    const finalOrder = props.route.params.order;
    const dispatch = useDispatch();

    const confirmOrder = () => {
        const orderParams = finalOrder;

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
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            {/* Shipping Card */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Ionicons name="location-outline" size={20} color={COLORS.primary} />
                    <Text style={styles.cardTitle}>Shipping Address</Text>
                </View>
                <View style={styles.addressBlock}>
                    <Text style={styles.addressText}>{finalOrder.shippingAddress1}</Text>
                    {finalOrder.shippingAddress2 ? <Text style={styles.addressText}>{finalOrder.shippingAddress2}</Text> : null}
                    <Text style={styles.addressText}>{finalOrder.city}, {finalOrder.zip}</Text>
                    <Text style={styles.addressText}>{finalOrder.country}</Text>
                </View>
            </View>

            {/* Items Card */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Ionicons name="bag-outline" size={20} color={COLORS.primary} />
                    <Text style={styles.cardTitle}>Order Items</Text>
                </View>
                {finalOrder.orderItems.map((x) => (
                    <View style={styles.itemRow} key={x.product ? x.product : Math.random()}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.itemId}>Product: {x.product || x.id}</Text>
                        </View>
                        <Text style={styles.itemQty}>x{x.quantity}</Text>
                    </View>
                ))}
            </View>

            {/* Place Order */}
            <TouchableOpacity
                style={[COMMON_STYLES.primaryButton, { marginTop: SPACING.sm }]}
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
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: SPACING.base,
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: COLORS.text,
    },
    addressBlock: {
        paddingLeft: 28,
    },
    addressText: {
        fontSize: 14,
        color: COLORS.textMuted,
        lineHeight: 22,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderColor: COLORS.border,
    },
    itemId: {
        fontSize: 13,
        color: COLORS.text,
    },
    itemQty: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.primary,
    },
});

export default Confirm;
