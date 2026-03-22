import React from 'react';
import { View, Text, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { loadCartFromDB } from '../Redux/Actions/cartActions';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import axios from 'axios';
import baseURL from '../assets/common/baseurl';
import { COLORS, SHADOWS } from '../assets/common/theme';
import { AuthContext } from '../Context/Store/AuthGlobal';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

import HomeNavigator from './HomeNavigator';
import ShopNavigator from './ShopNavigator';
import CartNavigator from './CartNavigator';

const Tab = createBottomTabNavigator();

export default function Main({ navigation }) {
    const dispatch = useDispatch();
    const context = React.useContext(AuthContext);
    const cartItems = useSelector(state => state.cartItems);
    const insets = useSafeAreaInsets();

    React.useEffect(() => {
        dispatch(loadCartFromDB());

        const handleNotificationResponse = (response) => {
            const data = response?.notification?.request?.content?.data;
            if (!data) return;

            if (data.orderId) {
                navigation.navigate('Home', {
                    screen: 'UserNav',
                    params: {
                        screen: 'Order Details',
                        params: { orderId: data.orderId }
                    }
                });
                return;
            }

            if (data.orderHistory) {
                navigation.navigate('Home', {
                    screen: 'UserNav',
                    params: { screen: 'Order History' }
                });
                return;
            }

            const productId = data.promoId || data.productId;
            if (productId) {
                axios.get(`${baseURL}products/${productId}`)
                    .then(res => {
                        navigation.navigate('Home', {
                            screen: 'Product Detail',
                            params: { item: res.data }
                        });
                    })
                    .catch(err => console.log('Error fetching product from notification:', err));
            }
        };

        // Notification listener logic
        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
            handleNotificationResponse(response);
        });

        // Handle cold start notification for iOS/Android
        (async () => {
            const lastResponse = await Notifications.getLastNotificationResponseAsync();
            if (lastResponse) {
                handleNotificationResponse(lastResponse);
            }
        })();

        registerForPushNotificationsAsync().then(async token => {
            if (token) {
               const jwt = await SecureStore.getItemAsync('jwt');
               if (jwt) {
                    try {
                        const decoded = require('jwt-decode').jwtDecode(jwt);
                        await axios.put(`${baseURL}users/${decoded.userId || decoded.id}`, 
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
    }, [dispatch, context.stateUser.isAuthenticated]);

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

            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }

            try {
                token = (await Notifications.getExpoPushTokenAsync({
                    projectId: "b7ef4e91-b19b-4302-9be9-08bb7097eb85",
                })).data;
            } catch (err) {
                alert("Push Token Error: " + err.message);
                console.log("Push Token Error:", err);
            }
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
                    height: 60 + insets.bottom,
                    paddingBottom: 8 + insets.bottom,
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
