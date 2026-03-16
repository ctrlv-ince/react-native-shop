import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';

import ProductContainer from '../Screens/Product/ProductContainer';
import SingleProduct from '../Screens/Product/SingleProduct';

const Stack = createStackNavigator();

export default function HomeNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="Home"
                component={ProductContainer}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen 
                name="Product Detail"
                component={SingleProduct}
                options={{
                    headerShown: true,
                }}
            />
        </Stack.Navigator>
    );
}
