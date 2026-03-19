import axios from 'axios';
import baseURL from '../../assets/common/baseurl';

export const fetchReviews = (productId) => async (dispatch) => {
    try {
        dispatch({ type: 'FETCH_REVIEWS_REQUEST' });
        const { data } = await axios.get(`${baseURL}reviews/${productId}`);
        dispatch({ type: 'FETCH_REVIEWS_SUCCESS', payload: data });
    } catch (error) {
        dispatch({ type: 'FETCH_REVIEWS_FAIL', payload: error.message });
    }
};

export const createReview = (reviewData) => async (dispatch) => {
    try {
        const { data } = await axios.post(`${baseURL}reviews`, reviewData);
        dispatch({ type: 'ADD_REVIEW_SUCCESS', payload: data });
        return { success: true };
    } catch (error) {
        const msg = error.response?.data ? error.response.data : 'Failed to submit review';
        return { success: false, message: msg };
    }
};

export const updateReview = (id, reviewData) => async (dispatch) => {
    try {
        const { data } = await axios.put(`${baseURL}reviews/${id}`, reviewData);
        dispatch({ type: 'UPDATE_REVIEW_SUCCESS', payload: data });
        return { success: true };
    } catch (error) {
        const msg = error.response?.data ? error.response.data : 'Failed to update review';
        return { success: false, message: msg };
    }
};
