import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { createReview, updateReview } from '../../Redux/Actions/reviewActions';
import axios from 'axios';
import baseURL from '../../assets/common/baseurl';
import { AuthContext } from '../../Context/Store/AuthGlobal';
import Toast from 'react-native-toast-message';

const ReviewForm = (props) => {
    const { productId } = props.route.params;
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
            product: productId,
            rating,
            comment
        };

        if (existingReviewId) {
            // Update via Redux
            const result = await dispatch(updateReview(existingReviewId, reviewData));
            if (result.success) {
                Toast.show({ type: 'success', text1: 'Review updated!' });
                props.navigation.goBack();
            } else {
                Toast.show({ type: 'error', text1: result.message || 'Failed to update review' });
            }
        } else {
            // Create via Redux
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
            <Text style={styles.title}>{existingReviewId ? 'Edit Your Review' : 'Write a Review'}</Text>

            <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map(num => (
                    <Button 
                        key={num} 
                        title={`★ ${num}`} 
                        color={rating >= num ? 'gold' : 'grey'} 
                        onPress={() => setRating(num)} 
                    />
                ))}
            </View>

            <TextInput 
                style={styles.input} 
                placeholder="Share your thoughts..." 
                multiline 
                value={comment} 
                onChangeText={setComment} 
            />

            <Button title={existingReviewId ? 'Update Review' : 'Submit'} onPress={submitReview} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20
    },
    starsContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 10
    },
    input: {
        width: '100%',
        height: 100,
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
        backgroundColor: 'white'
    }
});

export default ReviewForm;
