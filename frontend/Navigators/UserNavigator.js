import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../Screens/User/Login';
import Register from '../Screens/User/Register';
import UserProfile from '../Screens/User/UserProfile';
import EditProfile from '../Screens/User/EditProfile';
import OrderDetails from '../Screens/User/OrderDetails';
import { STACK_HEADER_STYLE } from '../assets/common/theme';

const Stack = createStackNavigator();

export default function UserNavigator() {
    return (
        <Stack.Navigator screenOptions={STACK_HEADER_STYLE}>
            <Stack.Screen 
                name="Login"
                component={Login}
                options={{
                    headerShown: false
                }}
            />
             <Stack.Screen 
                name="Register"
                component={Register}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen 
                name="User Profile"
                component={UserProfile}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen 
                name="Edit Profile"
                component={EditProfile}
                options={{
                    headerShown: true
                }}
            />
            <Stack.Screen 
                name="Order Details"
                component={OrderDetails}
                options={{
                    headerShown: true
                }}
            />
        </Stack.Navigator>
    )
}
