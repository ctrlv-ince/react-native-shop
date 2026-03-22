import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import axios from 'axios';
import baseURL from './assets/common/baseurl';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

// Navigation
import DrawerNavigator from './Navigators/DrawerNavigator';

// Redux
import { Provider } from 'react-redux';
import store from './Redux/store';

// Context API (Auth)
import AuthGlobal from './Context/Store/AuthGlobal';

// Database
import { initDb } from './Shared/Database';

export const navigationRef = createNavigationContainerRef();

const handleNotificationResponse = async (response) => {
  console.log('Notification response received', response);
  const data = response?.notification?.request?.content?.data;
  if (!data) {
    console.log('No data payload in notification response.');
    Toast.show({ type: 'error', text1: 'Notification tapped', text2: 'No payload found' });
    return;
  }
  if (!navigationRef.isReady()) {
    console.log('Navigation not ready yet; queueing notification redirect.');
    pendingNotificationResponse.current = response;
    Toast.show({ type: 'info', text1: 'Notification tapped', text2: 'Waiting for navigation'});
    return;
  }

  if (data.orderHistory) {
    navigationRef.navigate('MainTabs', {
      screen: 'Home',
      params: {
        screen: 'UserNav',
        params: { screen: 'Order History' }
      }
    });
    return;
  }

  if (data.orderId) {
    navigationRef.navigate('MainTabs', {
      screen: 'Home',
      params: {
        screen: 'UserNav',
        params: { screen: 'Order Details', params: { orderId: data.orderId } }
      }
    });
    return;
  }

  const productId = data.promoId || data.productId;
  if (productId) {
    try {
      const res = await axios.get(`${baseURL}products/${productId}`);
      navigationRef.navigate('MainTabs', {
        screen: 'Home',
        params: {
          screen: 'Product Detail',
          params: { item: res.data }
        }
      });
    } catch (err) {
      console.log('Error fetching product from notification:', err);
    }
  }
};

export default function App() {
  const pendingNotificationResponse = React.useRef(null);

  useEffect(() => {
     initDb();

     const responseListener = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);

     (async () => {
       const lastResponse = await Notifications.getLastNotificationResponseAsync();
       if (lastResponse) {
         if (navigationRef.isReady()) {
           handleNotificationResponse(lastResponse);
         } else {
           pendingNotificationResponse.current = lastResponse;
         }
       }
     })();

     return () => {
       responseListener.remove();
     };
  }, []);

  return (
    <SafeAreaProvider>
    <AuthGlobal>
      <Provider store={store}>
        <NavigationContainer
          ref={navigationRef}
          onReady={() => {
            if (pendingNotificationResponse.current) {
              handleNotificationResponse(pendingNotificationResponse.current);
              pendingNotificationResponse.current = null;
            }
          }}
        >
        <StatusBar style="dark" />
        <DrawerNavigator />
        <Toast />
      </NavigationContainer>
    </Provider>
    </AuthGlobal>
    </SafeAreaProvider>
  );
}
