import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Products from "../Screens/Admin/Products";
import ProductForm from "../Screens/Admin/ProductForm";
import Orders from "../Screens/Admin/Orders";

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
            <Stack.Screen 
                name="Orders"
                component={Orders}
                options={{
                    title: "Manage Orders"
                }}
            />
        </Stack.Navigator>
    );
}
