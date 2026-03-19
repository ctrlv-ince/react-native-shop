import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
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

export default function App() {
  useEffect(() => {
     initDb();
  }, []);

  return (
    <SafeAreaProvider>
    <AuthGlobal>
      <Provider store={store}>
        <NavigationContainer>
        <StatusBar style="dark" />
        <DrawerNavigator />
        <Toast />
      </NavigationContainer>
    </Provider>
    </AuthGlobal>
    </SafeAreaProvider>
  );
}
