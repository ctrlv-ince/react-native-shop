import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS, COMMON_STYLES } from '../../assets/common/theme';

const Payment = (props) => {
    const order = props.route.params.order;
    const [selected, setSelected] = useState(1);

    const paymentMethods = [
        { name: 'Cash on Delivery', value: 1, icon: 'cash-outline' },
        { name: 'Bank Transfer', value: 2, icon: 'business-outline' },
        { name: 'Card Payment', value: 3, icon: 'card-outline' },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Payment Method</Text>
                <Text style={styles.subtitle}>Choose how you'd like to pay</Text>
                
                {paymentMethods.map((item) => {
                    const isSelected = selected === item.value;
                    return (
                        <TouchableOpacity 
                            key={item.name} 
                            style={[styles.methodCard, isSelected && styles.methodCardSelected]}
                            onPress={() => setSelected(item.value)}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
                                <Ionicons name={item.icon} size={22} color={isSelected ? COLORS.primary : COLORS.textMuted} />
                            </View>
                            <Text style={[styles.methodText, isSelected && styles.methodTextSelected]}>
                                {item.name}
                            </Text>
                            <View style={[styles.radio, isSelected && styles.radioSelected]}>
                                {isSelected && <View style={styles.radioInner} />}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <TouchableOpacity
                style={[COMMON_STYLES.primaryButton, { marginHorizontal: SPACING.base, marginTop: SPACING.lg }]}
                onPress={() => props.navigation.navigate("Confirm", { order: order })}
                activeOpacity={0.7}
            >
                <Text style={COMMON_STYLES.primaryButtonText}>Continue</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: SPACING.base,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        ...SHADOWS.medium,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textMuted,
        marginBottom: SPACING.lg,
    },
    methodCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.base,
        borderRadius: RADIUS.md,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        marginBottom: SPACING.sm,
    },
    methodCardSelected: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primaryLight,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: RADIUS.sm,
        backgroundColor: COLORS.surfaceAlt,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    iconContainerSelected: {
        backgroundColor: COLORS.white,
    },
    methodText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.text,
    },
    methodTextSelected: {
        color: COLORS.primary,
    },
    radio: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: COLORS.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioSelected: {
        borderColor: COLORS.primary,
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.primary,
    },
});

export default Payment;
