import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Cart from '../Screens/Cart/Cart';
import CheckoutNavigator from './CheckoutNavigator';

const Stack = createStackNavigator();

export default function CartNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="Cart"
                component={Cart}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen 
                name="CheckoutNavigator"
                component={CheckoutNavigator}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    )
}
