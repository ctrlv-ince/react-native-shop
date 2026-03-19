import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeNavigator from './HomeNavigator';
import UserNavigator from './UserNavigator';
import AdminNavigator from './AdminNavigator';
import CartNavigator from './CartNavigator';
import { useDispatch, useSelector } from 'react-redux';
import { loadCartFromDB } from '../Redux/Actions/cartActions';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import baseURL from '../assets/common/baseurl';

const Tab = createBottomTabNavigator();



export default function Main({ navigation }) {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(loadCartFromDB());

        // Notification listener logic
        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
            const data = response.notification.request.content.data;
            if (data && data.orderId) {
                // Navigate to Order Details
                navigation.navigate('User', { 
                    screen: 'Order Details', 
                    params: { orderId: data.orderId } 
                });
            }
            if (data && data.promoId) {
                // Future use for promotions
            }
        });

        registerForPushNotificationsAsync().then(async token => {
            if (token) {
               const jwt = await SecureStore.getItemAsync('jwt');
               if (jwt) {
                    try {
                        const decoded = require('jwt-decode').jwtDecode(jwt);
                        await axios.put(`${baseURL}users/${decoded.userId}`, 
                            { pushToken: token },
                            { headers: { Authorization: `Bearer ${jwt}` } }
                        );
                        console.log('Push token saved to backend');
                    } catch (err) {
                        console.log('Error saving push token:', err);
                    }
               }
            }
        });

        return () => {
            Notifications.removeNotificationSubscription(responseListener);
        };
    }, [dispatch]);

    async function registerForPushNotificationsAsync() {
        let token;
        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                return;
            }
            token = (await Notifications.getExpoPushTokenAsync()).data;
        }
        return token;
    }

    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeNavigator} />
            <Tab.Screen name="Cart" component={CartNavigator} />
            <Tab.Screen name="Admin" component={AdminNavigator} />
            <Tab.Screen name="User" component={UserNavigator} />
        </Tab.Navigator>
    )
}
