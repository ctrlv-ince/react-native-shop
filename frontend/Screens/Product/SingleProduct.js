import React, { useState, useEffect, useCallback } from 'react';
import { Image, View, StyleSheet, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../Redux/Actions/cartActions';
import { fetchReviews } from '../../Redux/Actions/reviewActions';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import baseURL from '../../assets/common/baseurl';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SPACING, RADIUS, SHADOWS, COMMON_STYLES } from '../../assets/common/theme';

const SingleProduct = (props) => {
    const [item, setItem] = useState(props.route.params.item);
    const dispatch = useDispatch();
    const { reviews, loading: reviewsLoading } = useSelector(state => state.reviewsState);

    useFocusEffect(
        useCallback(() => {
            dispatch(fetchReviews(item.id || item._id));
        }, [dispatch])
    );

    const renderStars = (rating) => {
        return [1, 2, 3, 4, 5].map(i => (
            <Ionicons
                key={i}
                name={i <= rating ? "star" : "star-outline"}
                size={14}
                color={COLORS.warning}
            />
        ));
    };

    return (
        <View style={styles.container}>
            <ScrollView style={{ marginBottom: 80 }} showsVerticalScrollIndicator={false}>
                {/* Product Image */}
                <View style={styles.imageContainer}>
                    <Image 
                        source={{ uri: item.image ? item.image : 'https://fakeimg.pl/400x400/' }}
                        resizeMode="contain"
                        style={styles.image}
                    />
                </View>

                {/* Product Info */}
                <View style={styles.contentContainer}>
                    <Text style={styles.brand}>{item.brand}</Text>
                    <Text style={styles.contentHeader}>{item.name}</Text>
                    
                    <View style={styles.availabilityRow}>
                        <View style={[
                            styles.stockBadge,
                            { backgroundColor: item.countInStock > 0 ? COLORS.success + '15' : COLORS.danger + '15' }
                        ]}>
                            <View style={[
                                styles.stockDot,
                                { backgroundColor: item.countInStock > 0 ? COLORS.success : COLORS.danger }
                            ]} />
                            <Text style={[
                                styles.stockText,
                                { color: item.countInStock > 0 ? COLORS.success : COLORS.danger }
                            ]}>
                                {item.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.description}>{item.description}</Text>
                </View>

                {/* Reviews Section */}
                <View style={styles.reviewsContainer}>
                    <View style={styles.reviewsHeader}>
                        <Text style={styles.reviewsTitle}>Reviews</Text>
                        <TouchableOpacity 
                            style={styles.writeReviewButton}
                            onPress={() => props.navigation.navigate('Review Form', { productId: item.id || item._id })}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="create-outline" size={16} color={COLORS.primary} />
                            <Text style={styles.writeReviewText}>Write Review</Text>
                        </TouchableOpacity>
                    </View>
                    {reviewsLoading ? (
                        <ActivityIndicator color={COLORS.primary} style={{ marginTop: 20 }} />
                    ) : (
                        reviews.length > 0 ? reviews.map(r => (
                            <View key={r._id} style={styles.reviewCard}>
                                <View style={styles.reviewHeader}>
                                    <View style={styles.reviewerAvatar}>
                                        <Ionicons name="person" size={14} color={COLORS.primary} />
                                    </View>
                                    <Text style={styles.reviewerName}>{r.user?.name || 'User'}</Text>
                                    <View style={styles.ratingRow}>
                                        {renderStars(r.rating)}
                                    </View>
                                </View>
                                <Text style={styles.reviewComment}>{r.comment}</Text>
                            </View>
                        )) : (
                            <View style={styles.noReviews}>
                                <Ionicons name="chatbubble-outline" size={32} color={COLORS.textLight} />
                                <Text style={styles.noReviewsText}>No reviews yet</Text>
                            </View>
                        )
                    )}
                </View>
            </ScrollView>

            {/* Bottom Bar */}
            <View style={styles.bottomContainer}>
                <View>
                    <Text style={styles.priceLabel}>Price</Text>
                    <Text style={styles.price}>₱ {item.price}</Text>
                </View>
                <TouchableOpacity 
                    style={[
                        styles.addToCartButton,
                        item.countInStock <= 0 && { opacity: 0.5 }
                    ]}
                    onPress={() => {
                        if (item.countInStock <= 0) return;
                        dispatch(addToCart(item));
                        Toast.show({
                            topOffset: 60,
                            type: 'success',
                            text1: `${item.name} added to Cart`
                        });
                    }}
                    activeOpacity={0.7}
                    disabled={item.countInStock <= 0}
                >
                    <Ionicons name="cart-outline" size={20} color={COLORS.white} />
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    imageContainer: {
        backgroundColor: COLORS.white,
        paddingVertical: SPACING.lg,
    },
    image: {
        width: '100%',
        height: 280,
    },
    contentContainer: {
        backgroundColor: COLORS.white,
        marginTop: SPACING.sm,
        padding: SPACING.lg,
    },
    brand: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.accent,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    contentHeader: {
        fontWeight: '800',
        fontSize: 22,
        color: COLORS.text,
        marginBottom: SPACING.md,
    },
    availabilityRow: {
        marginBottom: SPACING.md,
    },
    stockBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: SPACING.md,
        paddingVertical: 6,
        borderRadius: RADIUS.xl,
        gap: 6,
    },
    stockDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    stockText: {
        fontSize: 12,
        fontWeight: '700',
    },
    description: {
        fontSize: 14,
        color: COLORS.textMuted,
        lineHeight: 22,
    },
    reviewsContainer: {
        backgroundColor: COLORS.white,
        marginTop: SPACING.sm,
        padding: SPACING.lg,
    },
    reviewsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.base,
    },
    reviewsTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
    },
    writeReviewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 6,
        paddingHorizontal: SPACING.md,
        borderRadius: RADIUS.sm,
        backgroundColor: COLORS.primaryLight,
    },
    writeReviewText: {
        color: COLORS.primary,
        fontSize: 13,
        fontWeight: '600',
    },
    reviewCard: {
        padding: SPACING.md,
        marginBottom: SPACING.sm,
        backgroundColor: COLORS.inputBg,
        borderRadius: RADIUS.md,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
        gap: 8,
    },
    reviewerAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    reviewerName: {
        fontWeight: '600',
        fontSize: 14,
        color: COLORS.text,
        flex: 1,
    },
    ratingRow: {
        flexDirection: 'row',
        gap: 2,
    },
    reviewComment: {
        fontSize: 13,
        color: COLORS.textMuted,
        lineHeight: 20,
    },
    noReviews: {
        alignItems: 'center',
        paddingVertical: SPACING.xl,
    },
    noReviewsText: {
        marginTop: SPACING.sm,
        color: COLORS.textMuted,
        fontSize: 14,
    },
    bottomContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: COLORS.white,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        ...SHADOWS.medium,
    },
    priceLabel: {
        fontSize: 12,
        color: COLORS.textMuted,
        fontWeight: '500',
    },
    price: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.primary,
    },
    addToCartButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.xl,
        borderRadius: RADIUS.md,
        gap: 8,
    },
    addToCartText: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: '700',
    },
});

export default SingleProduct;
