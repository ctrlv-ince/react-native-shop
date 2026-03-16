const initialState = {
    orders: [],
    loading: false,
    error: null
};

const orderReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'FETCH_ORDERS_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_ORDERS_SUCCESS':
            return { ...state, loading: false, orders: action.payload };
        case 'FETCH_ORDERS_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'UPDATE_ORDER_STATUS':
            return {
                ...state,
                orders: state.orders.map(o => 
                    o.id === action.payload.id ? action.payload : o
                )
            };
        default:
            return state;
    }
}

export default orderReducer;
