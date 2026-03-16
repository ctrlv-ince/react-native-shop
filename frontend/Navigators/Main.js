import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeNavigator from './HomeNavigator';
import UserNavigator from './UserNavigator';
import AdminNavigator from './AdminNavigator';
import CartNavigator from './CartNavigator';
import { useDispatch } from 'react-redux';
import { loadCartFromDB } from '../Redux/Actions/cartActions';

const Tab = createBottomTabNavigator();

const DummyScreen = () => <View><Text>Screen</Text></View>

export default function Main() {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(loadCartFromDB());
    }, [dispatch]);

    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeNavigator} />
            <Tab.Screen name="Cart" component={CartNavigator} />
            <Tab.Screen name="Admin" component={AdminNavigator} />
            <Tab.Screen name="User" component={UserNavigator} />
        </Tab.Navigator>
    )
}
