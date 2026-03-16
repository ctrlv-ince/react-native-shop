import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Main from './Main';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
    return (
        <Drawer.Navigator>
            <Drawer.Screen 
                name="Shop" 
                component={Main} 
                options={{ headerShown: false }} 
            />
        </Drawer.Navigator>
    )
}
