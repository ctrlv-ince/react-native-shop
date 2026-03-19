import React from 'react';
import { View, Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart } from '../../Redux/Actions/cartActions';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Ionicons } from '@expo/vector-icons';
import CartItem from './CartItem';
import { COLORS, SPACING, RADIUS, SHADOWS, COMMON_STYLES } from '../../assets/common/theme';

var { height, width } = Dimensions.get('window');

const Cart = (props) => {
    const cartItems = useSelector(state => state.cartItems);
    const dispatch = useDispatch();

    var total = 0;
    cartItems.forEach(cart => {
        return (total += cart.price * cart.quantity);
    });

    return (
        <>
            {cartItems.length ? (
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>My Cart</Text>
                        <TouchableOpacity 
                            onPress={() => dispatch(clearCart())}
                            style={styles.clearButton}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
                            <Text style={styles.clearText}>Clear</Text>
                        </TouchableOpacity>
                    </View>

                    <SwipeListView
                        data={cartItems}
                        keyExtractor={(data) => data.id.toString()}
                        renderItem={(data) => (
                             <CartItem item={data.item} />
                        )}
                        renderHiddenItem={(data) => (
                            <View style={styles.hiddenContainer}>
                                <TouchableOpacity 
                                    style={styles.deleteButton}
                                    onPress={() => dispatch(removeFromCart(data.item))}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="trash" size={22} color={COLORS.white} />
                                </TouchableOpacity>
                            </View>
                        )}
                        disableRightSwipe={true}
                        previewOpenDelay={3000}
                        friction={1000}
                        tension={40}
                        leftOpenValue={75}
                        stopLeftSwipe={75}
                        rightOpenValue={-75}
                        contentContainerStyle={{ paddingBottom: 160 }}
                    />

                    {/* Bottom Checkout */}
                    <View style={styles.bottomContainer}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalPrice}>₱ {Math.round(total * 100) / 100}</Text>
                        </View>
                        <TouchableOpacity
                            style={COMMON_STYLES.primaryButton}
                            onPress={() => props.navigation.navigate('CheckoutNavigator')}
                            activeOpacity={0.7}
                        >
                            <Text style={COMMON_STYLES.primaryButtonText}>Checkout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View style={styles.emptyContainer}>
                    <Ionicons name="cart-outline" size={80} color={COLORS.textLight} />
                    <Text style={styles.emptyTitle}>Your cart is empty</Text>
                    <Text style={styles.emptySubtitle}>Add products to your cart to get started</Text>
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.base,
        backgroundColor: COLORS.white,
        ...SHADOWS.small,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.text,
    },
    clearButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 6,
        paddingHorizontal: SPACING.md,
        borderRadius: RADIUS.sm,
        backgroundColor: COLORS.danger + '10',
    },
    clearText: {
        color: COLORS.danger,
        fontSize: 13,
        fontWeight: '600',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.base,
        paddingBottom: SPACING.xl,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        ...SHADOWS.medium,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    totalLabel: {
        fontSize: 16,
        color: COLORS.textMuted,
        fontWeight: '500',
    },
    totalPrice: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.primary,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.background,
        paddingBottom: 50,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.text,
        marginTop: SPACING.lg,
    },
    emptySubtitle: {
        fontSize: 14,
        color: COLORS.textMuted,
        marginTop: SPACING.sm,
    },
    hiddenContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: SPACING.base,
        backgroundColor: COLORS.background,
    },
    deleteButton: {
        backgroundColor: COLORS.danger,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Cart;
