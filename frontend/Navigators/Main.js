import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import UserNavigator from './UserNavigator';

const Tab = createBottomTabNavigator();

const DummyScreen = () => <View><Text>Screen</Text></View>

export default function Main() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={DummyScreen} />
            <Tab.Screen name="Cart" component={DummyScreen} />
            <Tab.Screen name="User" component={UserNavigator} />
        </Tab.Navigator>
    )
}
