import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, Image, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../assets/common/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 2 - 24;

const ProductCard = (props) => {
    const { name, price, images, stock, onPress, rating, numReviews } = props;
    const [qty, setQty] = useState(1);
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
                
                <View style={styles.reviewContainer}>
                    <Ionicons name="star" size={12} color="#f5c518" />
                    <Text style={styles.ratingText}>{(rating || 0).toFixed(1)}</Text>
                    <Text style={styles.reviewCountText}>({numReviews || 0} {numReviews === 1 ? 'review' : 'reviews'})</Text>
                </View>

                <Text style={styles.price}>₱{price}</Text>

                {stock > 0 ? (
                    <View style={styles.actionRow}>
                        <View style={styles.stepperContainer}>
                            <TouchableOpacity onPress={() => setQty(Math.max(1, qty - 1))} style={styles.stepperButton}>
                                <Ionicons name="remove" size={14} color={COLORS.primary} />
                            </TouchableOpacity>
                            <Text style={styles.stepperValue}>{qty}</Text>
                            <TouchableOpacity onPress={() => setQty(Math.min(stock, qty + 1))} style={styles.stepperButton}>
                                <Ionicons name="add" size={14} color={COLORS.primary} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity 
                            style={styles.addButton} 
                            onPress={() => { onPress(qty); setQty(1); }} 
                            activeOpacity={0.7}
                        >
                            <Ionicons name="cart-outline" size={16} color={COLORS.white} />
                            <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                    </View>
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
    reviewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
        gap: 4,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.text,
    },
    reviewCountText: {
        fontSize: 11,
        color: COLORS.textMuted,
    },
    price: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.primary,
        marginBottom: SPACING.sm,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 6,
    },
    stepperContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.inputBg,
        borderRadius: RADIUS.sm,
        borderWidth: 1,
        borderColor: COLORS.border,
        height: 32,
    },
    stepperButton: {
        paddingHorizontal: 8,
        height: '100%',
        justifyContent: 'center',
    },
    stepperValue: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.text,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        height: 32,
        paddingHorizontal: 10,
        borderRadius: RADIUS.sm,
        gap: 4,
    },
    addButtonText: {
        color: COLORS.white,
        fontSize: 12,
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
