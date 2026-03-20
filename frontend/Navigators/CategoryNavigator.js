import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Categories from "../Screens/Admin/Categories";
import CategoryForm from "../Screens/Admin/CategoryForm";
import { STACK_HEADER_STYLE } from '../assets/common/theme';

const Stack = createStackNavigator();

export default function CategoryNavigator() {
    return (
        <Stack.Navigator screenOptions={STACK_HEADER_STYLE}>
            <Stack.Screen
                name="CategoriesList"
                component={Categories}
                options={{
                    title: "Manage Categories"
                }}
            />
            <Stack.Screen
                name="CategoryForm"
                component={CategoryForm}
                options={{
                    title: "Category Form"
                }}
            />
        </Stack.Navigator>
    );
}
