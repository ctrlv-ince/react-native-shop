import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { loadCartFromDB } from '../Redux/Actions/cartActions';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import baseURL from '../assets/common/baseurl';
import { COLORS, SHADOWS } from '../assets/common/theme';

import HomeNavigator from './HomeNavigator';
import ShopNavigator from './ShopNavigator';
import CartNavigator from './CartNavigator';

const Tab = createBottomTabNavigator();

export default function Main({ navigation }) {
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cartItems);

    React.useEffect(() => {
        dispatch(loadCartFromDB());

        // Notification listener logic
        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
            const data = response.notification.request.content.data;
            if (data && data.orderId) {
                navigation.navigate('Home', {
                    screen: 'UserNav',
                    params: {
                        screen: 'Order Details',
                        params: { orderId: data.orderId }
                    }
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
            responseListener.remove();
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
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: COLORS.white,
                    borderTopWidth: 1,
                    borderTopColor: COLORS.border,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                    ...SHADOWS.small,
                },
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.tabInactive,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            }}
        >
            <Tab.Screen 
                name="Home" 
                component={HomeNavigator} 
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                    tabBarLabel: 'Home',
                }}
            />
            <Tab.Screen 
                name="Shop" 
                component={ShopNavigator} 
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="game-controller" size={size} color={color} />
                    ),
                    tabBarLabel: 'Shop',
                }}
            />
            <Tab.Screen 
                name="Cart" 
                component={CartNavigator}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <View>
                            <Ionicons name="cart" size={size} color={color} />
                            {cartItems.length > 0 && (
                                <View style={{
                                    position: 'absolute',
                                    right: -8,
                                    top: -4,
                                    backgroundColor: COLORS.danger,
                                    borderRadius: 10,
                                    width: 18,
                                    height: 18,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Text style={{ color: COLORS.white, fontSize: 10, fontWeight: 'bold' }}>
                                        {cartItems.length}
                                    </Text>
                                </View>
                            )}
                        </View>
                    ),
                    tabBarLabel: 'Cart',
                }}
            />
        </Tab.Navigator>
    )
}
