import { ADD_TO_CART, REMOVE_FROM_CART, CLEAR_CART, LOAD_CART } from '../constants';
import * as DB from '../../Shared/Database';

export const addToCart = (payload) => {
    return async (dispatch) => {
        await DB.insertCartItem(payload);
        dispatch({
            type: ADD_TO_CART,
            payload
        });
    }
}

export const removeFromCart = (payload) => {
    return async (dispatch) => {
        await DB.removeCartItem(payload.id);
        dispatch({
            type: REMOVE_FROM_CART,
            payload
        });
    }
}

export const clearCart = () => {
    return async (dispatch) => {
        await DB.clearCart();
        dispatch({
            type: CLEAR_CART
        });
    }
}

export const loadCartFromDB = () => {
     return async (dispatch) => {
          const items = await DB.fetchCartItems();
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
