import { ADD_TO_CART, REMOVE_FROM_CART, CLEAR_CART, LOAD_CART } from '../constants';

const cartItems = (state = [], action) => {
    switch (action.type) {
        case LOAD_CART:
            return action.payload;
        case ADD_TO_CART:
            const exists = state.find((x) => x.id === action.payload.id);
            const qtyToAdd = action.payload.quantityToAdd || 1;
            if (exists) {
                 return state.map(x => x.id === action.payload.id ? { ...x, quantity: x.quantity + qtyToAdd } : x);
            }
            return [...state, { ...action.payload, quantity: qtyToAdd }];
        case 'UPDATE_CART_QTY':
            return state.map(x => x.id === action.payload.id ? { ...x, quantity: action.payload.quantity } : x);
        case REMOVE_FROM_CART:
            return state.filter(cartItem => cartItem.id !== action.payload.id);
        case CLEAR_CART:
            return [];
        default:
            return state;
    }
};

export default cartItems;
