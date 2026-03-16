import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Cart from '../Screens/Cart/Cart';

const DummyCheckoutNavigator = () => null;

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
            {/* Navigation placeholder mapped inside Main.js or separately */}
        </Stack.Navigator>
    )
}
