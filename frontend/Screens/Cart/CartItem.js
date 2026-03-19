import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../assets/common/theme';

const CartItem = (props) => {
    const data = props.item;
    return (
        <View style={styles.body}>
            <Image 
                source={{ uri: data.image ? data.image : 'https://fakeimg.pl/200x200/' }}
                style={styles.image}
            />
            <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>{data.name}</Text>
                <View style={styles.priceRow}>
                    <Text style={styles.price}>₱{data.price}</Text>
                    <Text style={styles.quantity}>x {data.quantity}</Text>
                </View>
            </View>
            <Text style={styles.subtotal}>₱{(data.price * data.quantity).toFixed(2)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    body: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: SPACING.md,
        marginHorizontal: SPACING.md,
        marginTop: SPACING.sm,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    image: {
        width: 56,
        height: 56,
        borderRadius: RADIUS.sm,
        backgroundColor: COLORS.surfaceAlt,
        marginRight: SPACING.md,
    },
    info: {
        flex: 1,
    },
    name: {
        fontWeight: '700',
        fontSize: 14,
        color: COLORS.text,
        marginBottom: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    price: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '600',
    },
    quantity: {
        fontSize: 13,
        color: COLORS.textMuted,
    },
    subtotal: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.text,
    },
});

export default CartItem;
