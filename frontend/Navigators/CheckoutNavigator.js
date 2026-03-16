import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Checkout from '../Screens/Checkout/Checkout';
import Payment from '../Screens/Checkout/Payment';
import Confirm from '../Screens/Checkout/Confirm';

const Stack = createStackNavigator();

export default function CheckoutNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Checkout" component={Checkout} />
            <Stack.Screen name="Payment" component={Payment} />
            <Stack.Screen name="Confirm" component={Confirm} />
        </Stack.Navigator>
    )
}
