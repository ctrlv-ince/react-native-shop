import { ADD_TO_CART, REMOVE_FROM_CART, CLEAR_CART, LOAD_CART } from '../constants';

const cartItems = (state = [], action) => {
    switch (action.type) {
        case LOAD_CART:
            return action.payload;
        case ADD_TO_CART:
            const exists = state.find((x) => x.id === action.payload.id);
            if (exists) {
                 return state.map(x => x.id === action.payload.id ? { ...x, quantity: x.quantity + 1 } : x);
            }
            return [...state, { ...action.payload, quantity: 1 }];
        case REMOVE_FROM_CART:
            return state.filter(cartItem => cartItem.id !== action.payload.id);
        case CLEAR_CART:
            return [];
        default:
            return state;
    }
};

export default cartItems;
