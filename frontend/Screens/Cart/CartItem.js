import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { updateCartQty, removeFromCart } from '../../Redux/Actions/cartActions';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../../assets/common/theme';

const CartItem = (props) => {
    const data = props.item;
    const dispatch = useDispatch();

    const handleUpdateQty = (change) => {
        const newQty = data.quantity + change;
        if (newQty > 0) {
            dispatch(updateCartQty(data.id, newQty));
        } else {
            dispatch(removeFromCart(data));
        }
    };

    return (
        <View style={styles.body}>
            <Image 
                source={{ uri: data.images?.[0]?.url || data.image || 'https://fakeimg.pl/200x200/?text=No+Image' }}
                style={styles.image}
            />
            <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>{data.name}</Text>
                <Text style={styles.price}>₱{data.price}</Text>
            </View>
            <View style={styles.controls}>
                <View style={styles.stepperContainer}>
                    <TouchableOpacity onPress={() => handleUpdateQty(-1)} style={styles.stepperBtn} activeOpacity={0.7}>
                        <Ionicons name="remove" size={16} color={COLORS.primary} />
                    </TouchableOpacity>
                    <Text style={styles.stepperText}>{data.quantity}</Text>
                    <TouchableOpacity onPress={() => handleUpdateQty(1)} style={styles.stepperBtn} activeOpacity={0.7}>
                        <Ionicons name="add" size={16} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.subtotal}>₱{(data.price * data.quantity).toFixed(2)}</Text>
            </View>
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
        justifyContent: 'center',
    },
    name: {
        fontWeight: '700',
        fontSize: 14,
        color: COLORS.text,
        marginBottom: 4,
    },
    price: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '600',
    },
    controls: {
        alignItems: 'flex-end',
        gap: 6,
    },
    stepperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surfaceAlt,
        borderRadius: RADIUS.sm,
        paddingHorizontal: 2,
    },
    stepperBtn: {
        padding: 6,
    },
    stepperText: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.text,
        minWidth: 24,
        textAlign: 'center',
    },
    subtotal: {
        fontSize: 15,
        fontWeight: '800',
        color: COLORS.text,
    },
});

export default CartItem;
