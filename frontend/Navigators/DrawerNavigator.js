import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import Main from './Main';
import { COLORS } from '../assets/common/theme';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    backgroundColor: COLORS.white,
                    width: 260,
                },
                drawerActiveTintColor: COLORS.primary,
                drawerInactiveTintColor: COLORS.textMuted,
                drawerLabelStyle: {
                    fontSize: 15,
                    fontWeight: '600',
                    marginLeft: -8,
                },
                drawerItemStyle: {
                    borderRadius: 12,
                    marginHorizontal: 8,
                    paddingVertical: 2,
                },
            }}
        >
            <Drawer.Screen 
                name="MainTabs" 
                component={Main} 
                options={{
                    drawerLabel: 'Shop',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="game-controller" size={size} color={color} />
                    ),
                }}
            />
        </Drawer.Navigator>
    )
}
