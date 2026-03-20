import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { createReview, updateReview } from '../../Redux/Actions/reviewActions';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import baseURL from '../../assets/common/baseurl';
import { AuthContext } from '../../Context/Store/AuthGlobal';
import Toast from 'react-native-toast-message';
import { COLORS, SPACING, RADIUS, SHADOWS, COMMON_STYLES } from '../../assets/common/theme';

const ReviewForm = (props) => {
    const { productId, orderId, productName } = props.route.params;
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [existingReviewId, setExistingReviewId] = useState(null);
    const context = useContext(AuthContext);
    const dispatch = useDispatch();

    useEffect(() => {
        // Fetch existing review if any
        if (context.stateUser.isAuthenticated) {
            axios.get(`${baseURL}reviews/${productId}`)
                .then(res => {
                    const userReview = res.data.find(r => r.user._id === context.stateUser.user.userId || r.user === context.stateUser.user.userId);
                    if (userReview) {
                        setRating(userReview.rating);
                        setComment(userReview.comment);
                        setExistingReviewId(userReview._id);
                    }
                })
                .catch(err => console.log(err));
        }
    }, []);

    const submitReview = async () => {
        if (!context.stateUser.isAuthenticated) {
            Toast.show({ type: 'error', text1: 'Please login to review' });
            return;
        }

        const reviewData = {
            user: context.stateUser.user.userId,
            name: context.stateUser.user.name || 'User',
            product: productId,
            order: orderId,
            rating,
            comment
        };

        if (existingReviewId) {
            const result = await dispatch(updateReview(existingReviewId, reviewData));
            if (result.success) {
                Toast.show({ type: 'success', text1: 'Review updated!' });
                props.navigation.goBack();
            } else {
                Toast.show({ type: 'error', text1: result.message || 'Failed to update review' });
            }
        } else {
            const result = await dispatch(createReview(reviewData));
            if (result.success) {
                Toast.show({ type: 'success', text1: 'Review submitted!' });
                props.navigation.goBack();
            } else {
                Toast.show({ type: 'error', text1: result.message || 'Failed to submit review' });
            }
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>
                    {existingReviewId ? 'Edit Your Review' : 'Write a Review'}
                </Text>
                <Text style={styles.subtitle}>
                    {existingReviewId ? 'Update your rating and comment' : 'Share your experience with this product'}
                </Text>

                {/* Star Rating */}
                <Text style={styles.label}>Rating</Text>
                <View style={styles.starsContainer}>
                    {[1, 2, 3, 4, 5].map(num => (
                        <TouchableOpacity
                            key={num}
                            onPress={() => setRating(num)}
                            activeOpacity={0.6}
                            style={styles.starButton}
                        >
                            <Ionicons
                                name={rating >= num ? "star" : "star-outline"}
                                size={32}
                                color={rating >= num ? COLORS.warning : COLORS.textLight}
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Comment */}
                <Text style={styles.label}>Comment</Text>
                <TextInput 
                    style={styles.input} 
                    placeholder="Share your thoughts..." 
                    placeholderTextColor={COLORS.textMuted}
                    multiline 
                    value={comment} 
                    onChangeText={setComment}
                    textAlignVertical="top"
                />

                {/* Submit */}
                <TouchableOpacity
                    style={COMMON_STYLES.primaryButton}
                    onPress={submitReview}
                    activeOpacity={0.7}
                >
                    <Text style={COMMON_STYLES.primaryButtonText}>
                        {existingReviewId ? 'Update Review' : 'Submit Review'}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: SPACING.base,
        backgroundColor: COLORS.background,
        flexGrow: 1,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        ...SHADOWS.medium,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.text,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textMuted,
        marginBottom: SPACING.lg,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.sm,
    },
    starsContainer: {
        flexDirection: 'row',
        marginBottom: SPACING.lg,
        gap: 8,
    },
    starButton: {
        padding: 4,
    },
    input: {
        width: '100%',
        height: 120,
        borderWidth: 1.5,
        borderColor: COLORS.inputBorder,
        backgroundColor: COLORS.inputBg,
        padding: SPACING.md,
        marginBottom: SPACING.lg,
        borderRadius: RADIUS.md,
        fontSize: 14,
        color: COLORS.text,
        lineHeight: 22,
    }
});

export default ReviewForm;
