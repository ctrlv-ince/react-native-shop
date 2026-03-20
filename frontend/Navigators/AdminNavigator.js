import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Products from "../Screens/Admin/Products";
import ProductForm from "../Screens/Admin/ProductForm";
import { STACK_HEADER_STYLE } from '../assets/common/theme';

const Stack = createStackNavigator();

export default function AdminNavigator() {
    return (
        <Stack.Navigator screenOptions={STACK_HEADER_STYLE}>
            <Stack.Screen
                name="Products"
                component={Products}
                options={{
                    title: "Manage Products"
                }}
            />
            <Stack.Screen 
                name="ProductForm"
                component={ProductForm}
                options={{
                    title: "Product Form"
                }}
            />
        </Stack.Navigator>
    );
}

