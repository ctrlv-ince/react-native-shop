import React, { useContext, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthContext } from '../../Context/Store/AuthGlobal';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import baseURL from '../../assets/common/baseurl';
import { COLORS, SPACING, RADIUS, SHADOWS, STACK_HEADER_STYLE } from '../../assets/common/theme';

const Dashboard = (props) => {
    const context = useContext(AuthContext);
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    
    const [stats, setStats] = useState({
        products: 0,
        orders: 0,
        users: 0,
        categories: 0
    });
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const fetchStats = async () => {
                setLoading(true);
                try {
                    const token = await SecureStore.getItemAsync('jwt');
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    
                    const [prodRes, ordRes, usrRes, catRes] = await Promise.all([
                        axios.get(`${baseURL}products`),
                        axios.get(`${baseURL}orders`, config),
                        axios.get(`${baseURL}users`, config),
                        axios.get(`${baseURL}categories`)
                    ]);
                    
                    setStats({
                        products: prodRes.data ? prodRes.data.length : 0,
                        orders: ordRes.data ? ordRes.data.length : 0,
                        users: usrRes.data ? usrRes.data.length : 0,
                        categories: catRes.data ? catRes.data.length : 0
                    });
                } catch (error) {
                    console.error("Error fetching admin stats", error);
                } finally {
                    setLoading(false);
                }
            };
            
            fetchStats();
        }, [])
    );

    const StatCard = ({ title, count, icon, color, route }) => (
        <TouchableOpacity 
            style={styles.statCard} 
            onPress={() => navigation.navigate(route)}
            activeOpacity={0.7}
        >
            <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
                <Ionicons name={icon} size={28} color={color} />
            </View>
            <Text style={styles.statCount}>{loading ? '-' : count}</Text>
            <Text style={styles.statTitle}>{title}</Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top + SPACING.lg }]}>
            <View style={styles.header}>
                <Text style={styles.greeting}>Admin Dashboard</Text>
                <Text style={styles.subtitle}>Overview & Management</Text>
            </View>

            <View style={styles.grid}>
                <StatCard title="Products" count={stats.products} icon="cube-outline" color={COLORS.primary} route="Products" />
                <StatCard title="Orders" count={stats.orders} icon="receipt-outline" color={COLORS.warning} route="Orders" />
                <StatCard title="Users" count={stats.users} icon="people-outline" color={COLORS.accent} route="Users" />
                <StatCard title="Categories" count={stats.categories} icon="grid-outline" color={COLORS.success} route="Categories" />
            </View>
            
            <View style={styles.actions}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <TouchableOpacity 
                    style={styles.actionBtn}
                    onPress={() => navigation.navigate('Products', { screen: 'ProductForm' })}
                >
                    <Ionicons name="add-circle-outline" size={20} color={COLORS.white} />
                    <Text style={styles.actionText}>Add New Product</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: COLORS.background,
        padding: SPACING.lg,
    },
    header: {
        marginBottom: SPACING.xl,
    },
    greeting: {
        fontSize: 26,
        fontWeight: '800',
        color: COLORS.text,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textMuted,
        marginTop: 4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: SPACING.md,
    },
    statCard: {
        width: '47%',
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        alignItems: 'flex-start',
        ...SHADOWS.medium,
        marginBottom: SPACING.md,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.base,
    },
    statCount: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.text,
    },
    statTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textMuted,
        marginTop: 4,
    },
    actions: {
        marginTop: SPACING.xl,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.md,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        padding: SPACING.md,
        borderRadius: RADIUS.sm,
        justifyContent: 'center',
        gap: 8,
    },
    actionText: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: '600',
    }
});

export default Dashboard;
