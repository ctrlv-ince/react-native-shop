import React, { useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import Main from './Main';
import AdminMain from './AdminMain';
import { AuthContext } from '../Context/Store/AuthGlobal';
import { COLORS } from '../assets/common/theme';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
    const context = useContext(AuthContext);
    const isAdmin = context.stateUser.isAuthenticated && context.stateUser.user.isAdmin;

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
            {isAdmin ? (
                <Drawer.Screen 
                    name="AdminTabs" 
                    component={AdminMain} 
                    options={{
                        drawerLabel: 'Dashboard',
                        drawerIcon: ({ color, size }) => (
                            <Ionicons name="pie-chart" size={size} color={color} />
                        ),
                    }}
                />
            ) : (
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
            )}
        </Drawer.Navigator>
    )
}
