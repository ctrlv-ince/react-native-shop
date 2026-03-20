import React from 'react';
import { StyleSheet, View, Dimensions, Image, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../assets/common/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 2 - 24;

const ProductCard = (props) => {
    const { name, price, images, stock, onPress } = props;
    const imageUrl = images?.[0]?.url;

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image 
                    style={styles.image}
                    resizeMode="cover"
                    source={{ uri: imageUrl ? imageUrl : 'https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png' }}
                />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={2}>
                    {name}
                </Text>
                <Text style={styles.price}>₱{price}</Text>

                {stock > 0 ? (
                    <TouchableOpacity style={styles.addButton} onPress={onPress} activeOpacity={0.7}>
                        <Ionicons name="cart-outline" size={16} color={COLORS.white} />
                        <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.unavailableBadge}>
                        <Text style={styles.unavailableText}>Out of Stock</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.lg,
        marginTop: SPACING.md,
        marginBottom: SPACING.sm,
        overflow: 'hidden',
        ...SHADOWS.medium,
    },
    imageContainer: {
        width: '100%',
        height: CARD_WIDTH * 0.85,
        backgroundColor: COLORS.surfaceAlt,
        borderTopLeftRadius: RADIUS.lg,
        borderTopRightRadius: RADIUS.lg,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    infoContainer: {
        padding: SPACING.md,
    },
    title: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 4,
        lineHeight: 18,
    },
    price: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.primary,
        marginBottom: SPACING.sm,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: 8,
        borderRadius: RADIUS.sm,
        gap: 6,
    },
    addButtonText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '700',
    },
    unavailableBadge: {
        backgroundColor: COLORS.surfaceAlt,
        paddingVertical: 8,
        borderRadius: RADIUS.sm,
        alignItems: 'center',
    },
    unavailableText: {
        color: COLORS.danger,
        fontSize: 12,
        fontWeight: '600',
    },
});

export default ProductCard;
