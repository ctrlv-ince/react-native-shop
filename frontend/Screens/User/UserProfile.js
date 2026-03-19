import React, { useContext, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import baseURL from '../../assets/common/baseurl';
import { AuthContext } from '../../Context/Store/AuthGlobal';
import { logoutUser } from '../../Context/Actions/Auth.actions';
import { COLORS, SPACING, RADIUS, SHADOWS, COMMON_STYLES } from '../../assets/common/theme';

const UserProfile = (props) => {
    const context = useContext(AuthContext);
    const navigation = useNavigation();
    const [userProfile, setUserProfile] = useState();

    useFocusEffect(
        useCallback(() => {
            if (
                context.stateUser.isAuthenticated === false || 
                context.stateUser.isAuthenticated === null
            ) {
                props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                });
            } else {
                SecureStore.getItemAsync('jwt').then((res) => {
                    axios
                        .get(`${baseURL}users/${context.stateUser.user.userId}`, {
                            headers: { Authorization: `Bearer ${res}` },
                        })
                        .then((user) => setUserProfile(user.data));
                });
            }

            return () => {
                // Kept empty to retain profile state across tab switches
            };
        }, [context.stateUser.isAuthenticated])
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Profile Card */}
            <View style={styles.profileCard}>
                <View style={[styles.avatarContainer, !userProfile?.photo && { backgroundColor: COLORS.primaryLight }]}>
                    {userProfile?.photo ? (
                        <Image source={{ uri: userProfile.photo }} style={styles.avatar} />
                    ) : (
                        <View style={[styles.avatar, { justifyContent: 'center', alignItems: 'center' }]}>
                            <Text style={{ fontSize: 40, fontWeight: '800', color: COLORS.primary }}>
                                {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : '?'}
                            </Text>
                        </View>
                    )}
                </View>
                <Text style={styles.name}>
                    {userProfile ? userProfile.name : ''}
                </Text>

                {/* Info Rows */}
                <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                        <Ionicons name="mail-outline" size={18} color={COLORS.primary} />
                        <Text style={styles.infoText}>
                            {userProfile ? userProfile.email : ''}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="call-outline" size={18} color={COLORS.primary} />
                        <Text style={styles.infoText}>
                            {userProfile ? userProfile.phone : ''}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Actions */}
            <View style={styles.actionsCard}>
                <TouchableOpacity 
                    style={styles.actionRow}
                    onPress={() => props.navigation.navigate('Edit Profile')}
                    activeOpacity={0.6}
                >
                    <View style={[styles.actionIcon, { backgroundColor: COLORS.primaryLight }]}>
                        <Ionicons name="create-outline" size={20} color={COLORS.primary} />
                    </View>
                    <Text style={styles.actionText}>Edit Profile</Text>
                    <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
                </TouchableOpacity>
            </View>

            {/* Sign Out */}
            <TouchableOpacity 
                style={styles.signOutButton}
                onPress={() => {
                    SecureStore.deleteItemAsync('jwt');
                    logoutUser(context.dispatch);
                }}
                activeOpacity={0.7}
            >
                <Ionicons name="log-out-outline" size={18} color={COLORS.danger} />
                <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: COLORS.background,
        padding: SPACING.base,
        paddingTop: SPACING.xl,
    },
    profileCard: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.lg,
        padding: SPACING.xl,
        alignItems: 'center',
        ...SHADOWS.medium,
        marginBottom: SPACING.base,
    },
    avatarContainer: {
        padding: 4,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: COLORS.primary,
        marginBottom: SPACING.base,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    name: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.text,
        marginBottom: SPACING.base,
    },
    infoSection: {
        width: '100%',
        gap: SPACING.sm,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        backgroundColor: COLORS.inputBg,
        borderRadius: RADIUS.sm,
    },
    infoText: {
        fontSize: 14,
        color: COLORS.textMuted,
    },
    actionsCard: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
        ...SHADOWS.medium,
        marginBottom: SPACING.base,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.base,
        borderBottomWidth: 1,
        borderColor: COLORS.border,
    },
    actionIcon: {
        width: 36,
        height: 36,
        borderRadius: RADIUS.sm,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    actionText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.text,
    },
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: SPACING.md,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.danger + '10',
    },
    signOutText: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.danger,
    },
});

export default UserProfile;
