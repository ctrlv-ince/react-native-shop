import axios from 'axios';
import baseURL from '../../assets/common/baseurl';

export const fetchProducts = () => async (dispatch) => {
    try {
        dispatch({ type: 'FETCH_PRODUCTS_REQUEST' });
        const { data } = await axios.get(`${baseURL}products`);
        dispatch({ type: 'FETCH_PRODUCTS_SUCCESS', payload: data });
    } catch (error) {
        dispatch({ type: 'FETCH_PRODUCTS_FAIL', payload: error.message });
    }
};
