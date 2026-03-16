import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Products from "../Screens/Admin/Products";
import ProductForm from "../Screens/Admin/ProductForm";

const Stack = createStackNavigator();

export default function AdminNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Products"
                component={Products}
                options={{
                    title: "Manage Services"
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
