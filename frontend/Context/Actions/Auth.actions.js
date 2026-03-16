import { jwtDecode } from 'jwt-decode';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';
import baseURL from '../../assets/common/baseurl';

export const SET_CURRENT_USER = 'SET_CURRENT_USER';

export const loginUser = (user, dispatch) => {
    fetch(`${baseURL}users/login`, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
    .then((res) => res.json())
    .then(async (data) => {
        if (data) {
            const token = data.token;
            await SecureStore.setItemAsync('jwt', token);
            const decoded = jwtDecode(token);
            dispatch({ type: SET_CURRENT_USER, payload: decoded, userProfile: data });
        } else {
           logoutUser(dispatch);
        }
    })
    .catch((err) => {
        Toast.show({
            topOffset: 60,
            type: 'error',
            text1: 'Please provide correct credentials',
            text2: ''
        });
        logoutUser(dispatch);
    });
};

export const logoutUser = async (dispatch) => {
    await SecureStore.deleteItemAsync('jwt');
    dispatch({ type: SET_CURRENT_USER, payload: {} });
};
