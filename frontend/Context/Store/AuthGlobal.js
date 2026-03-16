import React, { useReducer, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import * as SecureStore from 'expo-secure-store';
import authReducer from '../Reducers/Auth.reducer';
import { SET_CURRENT_USER } from '../Actions/Auth.actions';

export const AuthContext = React.createContext();

const AuthGlobal = (props) => {
    const [stateUser, dispatch] = useReducer(authReducer, {
        isAuthenticated: false,
        user: {}
    });
    const [showChild, setShowChild] = useState(false);

    useEffect(() => {
        setShowChild(true);
        const loadToken = async () => {
             const jwt = await SecureStore.getItemAsync('jwt');
             if (jwt) {
                 const decoded = jwtDecode(jwt);
                 if (showChild) {
                     dispatch({ type: SET_CURRENT_USER, payload: decoded, userProfile: decoded });
                 }
             }
        }
        loadToken();
        return () => setShowChild(false);
    }, []);

    if (!showChild) {
        return null;
    }

    return (
        <AuthContext.Provider
            value={{
                stateUser,
                dispatch
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthGlobal;
