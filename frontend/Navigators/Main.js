import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeNavigator from './HomeNavigator';
import UserNavigator from './UserNavigator';
import AdminNavigator from './AdminNavigator';

const Tab = createBottomTabNavigator();

const DummyScreen = () => <View><Text>Screen</Text></View>

export default function Main() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeNavigator} />
            <Tab.Screen name="Cart" component={DummyScreen} />
            <Tab.Screen name="Admin" component={AdminNavigator} />
            <Tab.Screen name="User" component={UserNavigator} />
        </Tab.Navigator>
    )
}
