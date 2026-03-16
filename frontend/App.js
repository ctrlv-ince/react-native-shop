import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

// Navigation
import DrawerNavigator from './Navigators/DrawerNavigator';

// Redux
import { Provider } from 'react-redux';
import store from './Redux/store';

// Context API (Auth)
import AuthGlobal from './Context/Store/AuthGlobal';

export default function App() {
  return (
    <AuthGlobal>
      <Provider store={store}>
        <NavigationContainer>
        <DrawerNavigator />
        <Toast />
      </NavigationContainer>
    </Provider>
    </AuthGlobal>
  );
}
