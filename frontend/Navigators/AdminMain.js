import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../assets/common/theme';

import Dashboard from '../Screens/Admin/Dashboard';
import AdminNavigator from './AdminNavigator';
import CategoryNavigator from './CategoryNavigator';
import Orders from '../Screens/Admin/Orders';
import Users from '../Screens/Admin/Users';
import UserNavigator from './UserNavigator';

const Tab = createBottomTabNavigator();

export default function AdminMain() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: COLORS.white,
                    borderTopWidth: 1,
                    borderTopColor: COLORS.border,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                    ...SHADOWS.small,
                },
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.tabInactive,
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                },
            }}
        >
            <Tab.Screen 
                name="Dashboard" 
                component={Dashboard} 
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="pie-chart" size={size} color={color} />
                    ),
                    tabBarLabel: 'Dashboard',
                }}
            />
            <Tab.Screen 
                name="ProductsTab" 
                component={AdminNavigator} 
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="cube" size={size} color={color} />
                    ),
                    tabBarLabel: 'Products',
                }}
            />
            <Tab.Screen 
                name="OrdersTab" 
                component={Orders}
                options={{
                    headerShown: true,
                    headerTitle: 'Manage Orders',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="receipt" size={size} color={color} />
                    ),
                    tabBarLabel: 'Orders',
                }}
            />
            <Tab.Screen 
                name="CategoriesTab" 
                component={CategoryNavigator}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="grid" size={size} color={color} />
                    ),
                    tabBarLabel: 'Categories',
                }}
            />
            <Tab.Screen 
                name="Users" 
                component={Users}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="people" size={size} color={color} />
                    ),
                    tabBarLabel: 'Users',
                }}
            />
            <Tab.Screen 
                name="Profile" 
                component={UserNavigator}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                    tabBarLabel: 'Profile',
                }}
            />
        </Tab.Navigator>
    )
}
