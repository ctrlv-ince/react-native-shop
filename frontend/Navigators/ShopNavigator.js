import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ProductContainer from '../Screens/Product/ProductContainer';
import SingleProduct from '../Screens/Product/SingleProduct';
import ReviewForm from '../Screens/Product/ReviewForm';
import UserNavigator from './UserNavigator';
import AdminNavigator from './AdminNavigator';
import { STACK_HEADER_STYLE } from '../assets/common/theme';

const Stack = createStackNavigator();

export default function ShopNavigator() {
    return (
        <Stack.Navigator screenOptions={STACK_HEADER_STYLE}>
            <Stack.Screen 
                name="Products"
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
            <Stack.Screen 
                name="Review Form"
                component={ReviewForm}
                options={{
                    headerShown: true,
                }}
            />
            <Stack.Screen 
                name="UserNav"
                component={UserNavigator}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen 
                name="AdminNav"
                component={AdminNavigator}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
}
