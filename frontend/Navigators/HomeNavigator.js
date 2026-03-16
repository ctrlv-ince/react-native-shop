import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';

import ProductContainer from '../Screens/Product/ProductContainer';

const DummySingleProduct = () => <View><Text>Single Product Screen</Text></View>;

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
                component={DummySingleProduct}
                options={{
                    headerShown: true,
                }}
            />
        </Stack.Navigator>
    );
}
