import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import cartItems from './Reducers/cartItems';
import orderReducer from './Reducers/orderReducer';
import productReducer from './Reducers/productReducer';
import reviewReducer from './Reducers/reviewReducer';

const reducers = combineReducers({
    cartItems: cartItems,
    ordersState: orderReducer,
    productsState: productReducer,
    reviewsState: reviewReducer
});

const store = createStore(
    reducers,
    applyMiddleware(thunk)
);

export default store;
