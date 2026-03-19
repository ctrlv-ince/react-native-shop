import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
                    <Text style={styles.orderId}>#{props.id?.slice(-6)}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
                        <Text style={[styles.statusBadgeText, { color: statusColor }]}>{statusText}</Text>
                    </View>
                </View>

                {/* Details */}
                <View style={styles.detailsSection}>
                    <View style={styles.detailRow}>
                        <Ionicons name="location-outline" size={14} color={COLORS.textMuted} />
                        <Text style={styles.detailText}>{props.shippingAddress1}, {props.city}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Ionicons name="globe-outline" size={14} color={COLORS.textMuted} />
                        <Text style={styles.detailText}>{props.country}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Ionicons name="calendar-outline" size={14} color={COLORS.textMuted} />
                        <Text style={styles.detailText}>{props.dateOrdered.split('T')[0]}</Text>
                    </View>
                </View>

                {/* Price */}
                <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Total</Text>
                    <Text style={styles.priceValue}>₱ {props.totalPrice}</Text>
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
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    orderId: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.text,
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
    },
    detailText: {
        fontSize: 13,
        color: COLORS.textMuted,
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
