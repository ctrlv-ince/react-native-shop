import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { updateOrderStatus } from '../Redux/Actions/orderActions';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../assets/common/theme';

const OrderCard = (props) => {
    const dispatch = useDispatch();
    const [statusText, setStatusText] = useState('');
    const [statusColor, setStatusColor] = useState(COLORS.danger);
    const [statusChange, setStatusChange] = useState('');

    // Compute total price from order items
    const totalPrice = props.orderItems?.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0) || 0;

    useEffect(() => {
        if (props.status === 'Delivered') {
            setStatusText('Delivered');
            setStatusColor(COLORS.success);
        } else if (props.status === 'Shipped') {
            setStatusText('Shipped');
            setStatusColor(COLORS.warning);
        } else {
            setStatusText('Pending');
            setStatusColor(COLORS.danger);
        }

        return () => {
            setStatusText('');
            setStatusColor('');
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
        <View style={styles.container}>
            {/* Status indicator bar */}
            <View style={[styles.statusBar, { backgroundColor: statusColor }]} />
            
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.headerRow}>
                    <View style={styles.userInfoContainer}>
                        {props.user?.photo ? (
                            <Image source={{ uri: props.user.photo }} style={styles.userAvatar} />
                        ) : (
                            <View style={styles.userAvatarFallback}>
                                <Ionicons name="person" size={16} color={COLORS.primary} />
                            </View>
                        )}
                        <View style={styles.userTextInfo}>
                            <Text style={styles.orderId}>#{props.id?.slice(-6)}</Text>
                            <Text style={styles.userName}>{props.user?.name || 'Unknown User'}</Text>
                        </View>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
                        <Text style={[styles.statusBadgeText, { color: statusColor }]}>{statusText}</Text>
                    </View>
                </View>

                {/* Details */}
                <View style={styles.detailsSection}>
                    <View style={styles.detailRow}>
                        <Ionicons name="calendar-outline" size={14} color={COLORS.textMuted} />
                        <Text style={styles.detailText}>{props.dateOrdered?.split('T')[0]}</Text>
                    </View>
                    
                    <View style={styles.itemsList}>
                        <Text style={styles.itemsListTitle}>Ordered Items:</Text>
                        {props.orderItems?.map((item, index) => (
                            <View key={item.product?._id || index} style={styles.itemRow}>
                                <Image 
                                    source={{ uri: item.product?.images?.[0]?.url || item.product?.image || 'https://fakeimg.pl/50x50/?text=P' }} 
                                    style={styles.itemImage} 
                                />
                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemName} numberOfLines={1}>{item.product?.name || 'Unknown Item'}</Text>
                                    <Text style={styles.itemMeta}>Qty: {item.quantity}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Price */}
                <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Total</Text>
                    <Text style={styles.priceValue}>₱ {totalPrice.toLocaleString()}</Text>
                </View>

                {/* Admin Edit Mode */}
                {props.editMode ? (
                    <View style={styles.editSection}>
                        <Text style={styles.editLabel}>Update Status</Text>
                        <View style={styles.statusButtons}>
                            {[
                                { label: 'Pending', color: COLORS.danger },
                                { label: 'Shipped', color: COLORS.warning },
                                { label: 'Delivered', color: COLORS.success },
                            ].map(s => (
                                <TouchableOpacity
                                    key={s.label}
                                    style={[
                                        styles.statusBtn,
                                        { borderColor: s.color },
                                        statusChange === s.label && { backgroundColor: s.color }
                                    ]}
                                    onPress={() => setStatusChange(s.label)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[
                                        styles.statusBtnText,
                                        { color: s.color },
                                        statusChange === s.label && { color: COLORS.white }
                                    ]}>{s.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity
                            style={[styles.updateBtn, !statusChange && { opacity: 0.5 }]}
                            onPress={() => updateOrder()}
                            activeOpacity={0.7}
                            disabled={!statusChange}
                        >
                            <Text style={styles.updateBtnText}>Update Order</Text>
                        </TouchableOpacity>
                    </View>
                ) : null}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.lg,
        margin: SPACING.sm,
        flexDirection: 'row',
        overflow: 'hidden',
        ...SHADOWS.medium,
    },
    statusBar: {
        width: 4,
    },
    content: {
        flex: 1,
        padding: SPACING.base,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.md,
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    userAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: SPACING.sm,
    },
    userAvatarFallback: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.sm,
    },
    userTextInfo: {
        justifyContent: 'center',
    },
    orderId: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.text,
    },
    userName: {
        fontSize: 13,
        color: COLORS.textMuted,
        fontWeight: '500',
    },
    statusBadge: {
        paddingHorizontal: SPACING.md,
        paddingVertical: 4,
        borderRadius: RADIUS.xl,
    },
    statusBadgeText: {
        fontSize: 12,
        fontWeight: '700',
    },
    detailsSection: {
        gap: 6,
        marginBottom: SPACING.md,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: SPACING.sm,
    },
    detailText: {
        fontSize: 13,
        color: COLORS.textMuted,
    },
    itemsList: {
        marginTop: SPACING.sm,
        paddingTop: SPACING.sm,
        borderTopWidth: 1,
        borderTopColor: COLORS.surfaceAlt,
    },
    itemsListTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.textMuted,
        marginBottom: SPACING.sm,
        textTransform: 'uppercase',
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    itemImage: {
        width: 40,
        height: 40,
        borderRadius: RADIUS.sm,
        backgroundColor: COLORS.surfaceAlt,
        marginRight: SPACING.sm,
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
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: SPACING.sm,
        borderTopWidth: 1,
        borderColor: COLORS.border,
    },
    priceLabel: {
        fontSize: 14,
        color: COLORS.textMuted,
    },
    priceValue: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.primary,
    },
    editSection: {
        marginTop: SPACING.base,
        paddingTop: SPACING.base,
        borderTopWidth: 1,
        borderColor: COLORS.border,
    },
    editLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.textMuted,
        marginBottom: SPACING.sm,
    },
    statusButtons: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: SPACING.md,
    },
    statusBtn: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: RADIUS.sm,
        borderWidth: 1.5,
        alignItems: 'center',
    },
    statusBtnText: {
        fontSize: 12,
        fontWeight: '700',
    },
    updateBtn: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.md,
        borderRadius: RADIUS.md,
        alignItems: 'center',
    },
    updateBtnText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '700',
    },
});

export default OrderCard;
