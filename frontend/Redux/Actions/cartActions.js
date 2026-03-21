import { ADD_TO_CART, REMOVE_FROM_CART, CLEAR_CART, LOAD_CART } from '../constants';
import * as DB from '../../Shared/Database';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';

const getUserId = async () => {
    try {
        const token = await SecureStore.getItemAsync('jwt');
        if (token) {
            const decoded = jwtDecode(token);
            return decoded.userId;
        }
    } catch(e) {}
    return 'guest';
}

export const addToCart = (payload, cartQuantity = 1) => {
    return async (dispatch) => {
        const userId = await getUserId();
        await DB.insertCartItem(payload, cartQuantity, userId);
        dispatch({
            type: ADD_TO_CART,
            payload: { ...payload, quantityToAdd: cartQuantity }
        });
    }
}

export const updateCartQty = (id, quantity) => {
    return async (dispatch) => {
        const userId = await getUserId();
        await DB.updateCartItemQty(id, quantity, userId);
        dispatch({
            type: 'UPDATE_CART_QTY',
            payload: { id, quantity }
        });
    }
}

export const removeFromCart = (payload) => {
    return async (dispatch) => {
        const userId = await getUserId();
        await DB.removeCartItem(payload.id, userId);
        dispatch({
            type: REMOVE_FROM_CART,
            payload
        });
    }
}

export const clearCart = () => {
    return async (dispatch) => {
        const userId = await getUserId();
        await DB.clearCart(userId);
        dispatch({
            type: CLEAR_CART
        });
    }
}

export const loadCartFromDB = () => {
     return async (dispatch) => {
          const userId = await getUserId();
          const items = await DB.fetchCartItems(userId);
          // Map DB keys to normal Redux expected items
          const mappedItems = items.map(i => ({
               id: i.productId,
               name: i.name,
               price: i.price,
               image: i.image,
               quantity: i.quantity
          }));
          dispatch({
              type: LOAD_CART,
              payload: mappedItems
          });
     }
}
