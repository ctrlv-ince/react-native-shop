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
