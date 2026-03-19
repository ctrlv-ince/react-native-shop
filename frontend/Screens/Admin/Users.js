import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import baseURL from '../../assets/common/baseurl';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../assets/common/theme';

const Users = (props) => {
    const insets = useSafeAreaInsets();
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            fetchUsers();
            return () => {
                setUserList([]);
            }
        }, [])
    );

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = await SecureStore.getItemAsync('jwt');
            const res = await axios.get(`${baseURL}users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserList(res.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = (userId, userName) => {
        Alert.alert(
            "Delete User",
            `Are you sure you want to delete ${userName}? This action cannot be undone.`,
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const token = await SecureStore.getItemAsync('jwt');
                            await axios.delete(`${baseURL}users/${userId}`, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            // Update local state instead of doing a full refetch
                            setUserList(userList.filter(user => user.id !== userId));
                        } catch (error) {
                            console.error('Error deleting user:', error);
                            Alert.alert('Error', 'Unable to delete the user.');
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>User Management</Text>
                <Text style={styles.headerSubtitle}>Total Users: {userList.length}</Text>
            </View>

            {loading ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={userList}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            {/* Avatar */}
                            {item.photo ? (
                                <Image 
                                    source={{ uri: item.photo }} 
                                    style={styles.avatar} 
                                />
                            ) : (
                                <View style={[styles.avatar, styles.initialAvatar]}>
                                    <Text style={styles.initialText}>
                                        {item.name ? item.name.charAt(0).toUpperCase() : '?'}
                                    </Text>
                                </View>
                            )}
                            
                            {/* User Info */}
                            <View style={styles.userInfo}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                    <Text style={styles.name}>{item.name}</Text>
                                    {item.isAdmin && (
                                        <View style={styles.adminBadge}>
                                            <Text style={styles.adminBadgeText}>Admin</Text>
                                        </View>
                                    )}
                                </View>
                                <View style={styles.contactRow}>
                                    <Ionicons name="mail" size={12} color={COLORS.textMuted} />
                                    <Text style={styles.detail} numberOfLines={1}>{item.email}</Text>
                                </View>
                                <View style={styles.contactRow}>
                                    <Ionicons name="call" size={12} color={COLORS.textMuted} />
                                    <Text style={styles.detail}>{item.phone || 'No phone'}</Text>
                                </View>
                            </View>

                            {/* Actions */}
                            <TouchableOpacity 
                                style={styles.deleteBtn}
                                onPress={() => deleteUser(item.id, item.name)}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: COLORS.background, 
        paddingHorizontal: SPACING.base 
    },
    headerContainer: {
        paddingVertical: SPACING.lg,
        paddingHorizontal: SPACING.sm,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.text,
    },
    headerSubtitle: {
        fontSize: 14,
        color: COLORS.textMuted,
        marginTop: 4,
    },
    loader: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: SPACING.base,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.md,
        ...SHADOWS.small
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.inputBg,
        marginRight: SPACING.md,
    },
    initialAvatar: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.primaryLight,
    },
    initialText: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.primary,
    },
    userInfo: {
        flex: 1,
    },
    name: { 
        fontSize: 16, 
        fontWeight: '700', 
        color: COLORS.text, 
        marginBottom: 2 
    },
    adminBadge: {
        backgroundColor: COLORS.primaryLight,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: RADIUS.sm,
    },
    adminBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: COLORS.primary,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 2,
    },
    detail: { 
        fontSize: 13, 
        color: COLORS.textMuted 
    },
    deleteBtn: {
        padding: SPACING.sm,
        backgroundColor: COLORS.danger + '15',
        borderRadius: RADIUS.sm,
        marginLeft: SPACING.sm,
    }
});

export default Users;
