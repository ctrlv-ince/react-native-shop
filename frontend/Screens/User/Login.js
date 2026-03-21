import React, { useEffect, useContext, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { AuthContext } from '../../Context/Store/AuthGlobal';
import { loginUser } from '../../Context/Actions/Auth.actions';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { loadCartFromDB } from '../../Redux/Actions/cartActions';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { COLORS, SPACING, RADIUS, SHADOWS, COMMON_STYLES } from '../../assets/common/theme';

import * as SecureStore from 'expo-secure-store';
import baseURL from '../../assets/common/baseurl';
import { jwtDecode } from 'jwt-decode';

WebBrowser.maybeCompleteAuthSession();

const Login = (props) => {
    const context = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const reduxDispatch = useDispatch();

    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_EXPO_CLIENT_ID',
        iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID || 'YOUR_IOS_CLIENT_ID',
        androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID || 'YOUR_ANDROID_CLIENT_ID',
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { authentication } = response;
            Toast.show({ topOffset: 60, type: 'info', text1: 'Authenticating with Google...' });
            
            // Get user info from Google
            fetch('https://www.googleapis.com/userinfo/v2/me', {
                headers: { Authorization: `Bearer ${authentication.accessToken}` },
            })
            .then(res => res.json())
            .then(userInfo => {
                // Send to backend
                return fetch(`${baseURL}users/google-login`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: userInfo.email,
                        name: userInfo.name,
                        photo: userInfo.picture
                    })
                });
            })
            .then(res => res.json())
            .then(data => {
                if (data && data.token) {
                    SecureStore.setItemAsync('jwt', data.token).then(() => {
                        const decoded = jwtDecode(data.token);
                        context.dispatch({
                            type: 'SET_CURRENT_USER',
                            payload: decoded,
                            userProfile: data
                        });
                        Toast.show({ topOffset: 60, type: 'success', text1: 'Google Login Successful' });
                    });
                } else {
                    Toast.show({ topOffset: 60, type: 'error', text1: 'Login failed', text2: data.message });
                }
            })
            .catch(err => {
                Toast.show({ topOffset: 60, type: 'error', text1: 'Google Login Error', text2: err.message });
            });
        }
    }, [response]);

    useEffect(() => {
        if (context.stateUser.isAuthenticated === true) {
            reduxDispatch(loadCartFromDB());
            props.navigation.navigate('Home');
        }
    }, [context.stateUser.isAuthenticated]);

    const handleSubmit = () => {
        const user = { email, password };

        if (email === '' || password === '') {
            Toast.show({
                topOffset: 60,
                type: 'error',
                text1: 'Incomplete Credentials',
                text2: 'Please fill in your email and password'
            });
            return;
        }

        Toast.show({
            topOffset: 60,
            type: 'info',
            text1: 'Signing In...',
            text2: 'Please wait'
        });

        loginUser(user, context.dispatch);
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={{ flex: 1 }}
        >
            <ScrollView 
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="always"
            >
            {/* Header */}
            <View style={styles.logoContainer}>
                <View style={styles.iconCircle}>
                    <Ionicons name="game-controller" size={36} color={COLORS.primary} />
                </View>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to your GameZone account</Text>
            </View>

            {/* Form */}
            <View style={styles.formCard}>
                {error ? (
                    <View style={styles.errorBanner}>
                        <Ionicons name="alert-circle" size={16} color={COLORS.danger} />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : null}

                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="you@example.com"
                    placeholderTextColor={COLORS.textMuted}
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="••••••••"
                        placeholderTextColor={COLORS.textMuted}
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                    />
                    <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Ionicons
                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                            size={20}
                            color={COLORS.textMuted}
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[COMMON_STYLES.primaryButton, { marginTop: SPACING.lg }]}
                    onPress={() => handleSubmit()}
                    activeOpacity={0.7}
                >
                    <Text style={COMMON_STYLES.primaryButtonText}>Sign In</Text>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or</Text>
                    <View style={styles.dividerLine} />
                </View>

                {/* Google Sign In */}
                <TouchableOpacity
                    style={styles.googleButton}
                    disabled={!request}
                    onPress={() => promptAsync()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="logo-google" size={18} color="#DB4437" />
                    <Text style={styles.googleButtonText}>Sign in with Google</Text>
                </TouchableOpacity>
            </View>

            {/* Register Link */}
            <View style={styles.registerRow}>
                <Text style={styles.registerLabel}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => props.navigation.navigate('Register')}>
                    <Text style={styles.registerLink}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: 40,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    iconCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: COLORS.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.base,
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: COLORS.text,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textMuted,
        marginTop: 4,
    },
    formCard: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        ...SHADOWS.medium,
    },
    errorBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: COLORS.danger + '10',
        padding: SPACING.md,
        borderRadius: RADIUS.sm,
        marginBottom: SPACING.base,
    },
    errorText: {
        color: COLORS.danger,
        fontSize: 13,
        fontWeight: '500',
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.textMuted,
        marginBottom: 6,
        marginTop: SPACING.md,
    },
    input: {
        height: 48,
        backgroundColor: COLORS.inputBg,
        borderRadius: RADIUS.md,
        paddingHorizontal: SPACING.md,
        borderWidth: 1.5,
        borderColor: COLORS.inputBorder,
        fontSize: 15,
        color: COLORS.text,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.inputBg,
        borderRadius: RADIUS.md,
        borderWidth: 1.5,
        borderColor: COLORS.inputBorder,
    },
    passwordInput: {
        flex: 1,
        height: 48,
        paddingHorizontal: SPACING.md,
        fontSize: 15,
        color: COLORS.text,
    },
    eyeButton: {
        paddingHorizontal: SPACING.md,
        height: 48,
        justifyContent: 'center',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: SPACING.lg,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.border,
    },
    dividerText: {
        marginHorizontal: SPACING.md,
        color: COLORS.textMuted,
        fontSize: 13,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: SPACING.md,
        borderRadius: RADIUS.md,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        backgroundColor: COLORS.white,
    },
    googleButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.text,
    },
    registerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SPACING.xl,
        gap: 6,
    },
    registerLabel: {
        fontSize: 14,
        color: COLORS.textMuted,
    },
    registerLink: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.primary,
    },
});

export default Login;
