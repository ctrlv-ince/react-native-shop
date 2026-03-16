import axios from 'axios';
import baseURL from '../../assets/common/baseurl';

export const fetchOrders = () => async (dispatch) => {
    try {
        dispatch({ type: 'FETCH_ORDERS_REQUEST' });
        const { data } = await axios.get(`${baseURL}orders`);
        dispatch({ type: 'FETCH_ORDERS_SUCCESS', payload: data });
    } catch (error) {
        dispatch({ type: 'FETCH_ORDERS_FAIL', payload: error.message });
    }
};

export const updateOrderStatus = (id, statusChange) => async (dispatch) => {
    try {
        const { data } = await axios.put(`${baseURL}orders/${id}`, { status: statusChange });
        dispatch({ type: 'UPDATE_ORDER_STATUS', payload: data });
    } catch (error) {
        console.error(error);
    }
};
