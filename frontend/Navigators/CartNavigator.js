import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Cart from '../Screens/Cart/Cart';
import CheckoutNavigator from './CheckoutNavigator';
import { STACK_HEADER_STYLE } from '../assets/common/theme';

const Stack = createStackNavigator();

export default function CartNavigator() {
    return (
        <Stack.Navigator screenOptions={STACK_HEADER_STYLE}>
            <Stack.Screen 
                name="CartScreen"
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
