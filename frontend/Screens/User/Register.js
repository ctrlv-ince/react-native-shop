import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Platform, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import baseURL from '../../assets/common/baseurl';
import Toast from 'react-native-toast-message';
import { COLORS, SPACING, RADIUS, SHADOWS, COMMON_STYLES } from '../../assets/common/theme';

const Register = (props) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [error, setError] = useState('');

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    const register = () => {
        if (email === '' || name === '' || phone === '' || password === '') {
            Toast.show({
                topOffset: 60,
                type: 'error',
                text1: 'Incomplete Form',
                text2: 'Please fill in all required fields'
            });
            return;
        }

        if (password !== confirmPassword) {
            Toast.show({
                topOffset: 60,
                type: 'error',
                text1: 'Password Mismatch',
                text2: 'Passwords do not match'
            });
            return;
        }

        Toast.show({
            topOffset: 60,
            type: 'info',
            text1: 'Registering...',
            text2: 'Please wait'
        });

        let formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('phone', phone);
        formData.append('address', address);
        formData.append('isAdmin', 'false');

        if (avatar) {
            const newImageUri = "file:///" + avatar.split("file:/").join("");
            formData.append('photo', {
                uri: newImageUri,
                type: 'image/jpeg',
                name: newImageUri.split('/').pop(),
            });
        }

        fetch(`${baseURL}users/register`, {
            method: 'POST',
            body: formData,
            headers: {
                Accept: 'application/json'
            },
        })
        .then((res) => {
            if (res.ok) {
                return res.json().then((data) => ({ status: res.status, data, ok: true }));
            } else {
                return res.json().then((data) => ({ status: res.status, data, ok: false })).catch(() => ({ status: res.status, data: { message: "Server error" }, ok: false }));
            }
        })
        .then(({ status, data, ok }) => {
            if (ok) {
                Toast.show({
                    topOffset: 60,
                    type: 'success',
                    text1: 'Registration Succeeded',
                    text2: 'Please login into your account'
                });
                setTimeout(() => {
                    props.navigation.navigate('Login');
                }, 500);
            } else {
                console.log("Registration Error:", data);
                const errorMsg = data.message || (typeof data === 'string' ? data : 'Please try again');
                Toast.show({
                    topOffset: 60,
                    type: 'error',
                    text1: 'Registration Failed',
                    text2: errorMsg
                });
            }
        })
        .catch((error) => {
            console.log("Network Error:", error.message);
            Toast.show({
                topOffset: 60,
                type: 'error',
                text1: 'Network Error',
                text2: 'Please check your connection and try again'
            });
        });
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
                    <Ionicons name="person-add" size={32} color={COLORS.primary} />
                </View>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Join the GameZone community</Text>
            </View>

            {/* Form */}
            <View style={styles.formCard}>
                {error ? (
                    <View style={styles.errorBanner}>
                        <Ionicons name="alert-circle" size={16} color={COLORS.danger} />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : null}

                {/* Avatar Upload */}
                <View style={styles.avatarSection}>
                    <TouchableOpacity onPress={pickImage} activeOpacity={0.7}>
                        {avatar ? (
                            <Image source={{ uri: avatar }} style={styles.avatarImage} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Ionicons name="camera" size={28} color={COLORS.textMuted} />
                            </View>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={pickImage}>
                        <Text style={styles.avatarLabel}>
                            {avatar ? 'Change Photo' : 'Add Photo'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Email *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="you@example.com"
                    placeholderTextColor={COLORS.textMuted}
                    onChangeText={(text) => setEmail(text.toLowerCase())}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Your name"
                    placeholderTextColor={COLORS.textMuted}
                    onChangeText={(text) => setName(text)}
                />

                <Text style={styles.label}>Phone Number *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Phone number"
                    placeholderTextColor={COLORS.textMuted}
                    keyboardType="numeric"
                    onChangeText={(text) => setPhone(text)}
                />

                <Text style={styles.label}>Address</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Your address (optional)"
                    placeholderTextColor={COLORS.textMuted}
                    onChangeText={(text) => setAddress(text)}
                />

                <Text style={styles.label}>Password *</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="••••••••"
                        placeholderTextColor={COLORS.textMuted}
                        secureTextEntry={!showPassword}
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

                <Text style={styles.label}>Confirm Password *</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="••••••••"
                        placeholderTextColor={COLORS.textMuted}
                        secureTextEntry={!showConfirmPassword}
                        onChangeText={(text) => setConfirmPassword(text)}
                    />
                    <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        <Ionicons
                            name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                            size={20}
                            color={COLORS.textMuted}
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[COMMON_STYLES.primaryButton, { marginTop: SPACING.lg }]}
                    onPress={() => register()}
                    activeOpacity={0.7}
                >
                    <Text style={COMMON_STYLES.primaryButtonText}>Create Account</Text>
                </TouchableOpacity>
            </View>

            {/* Login Link */}
            <View style={styles.loginRow}>
                <Text style={styles.loginLabel}>Already have an account?</Text>
                <TouchableOpacity onPress={() => props.navigation.navigate('Login')}>
                    <Text style={styles.loginLink}>Sign In</Text>
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
        paddingVertical: SPACING.xl,
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
    avatarSection: {
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.inputBg,
        borderWidth: 2,
        borderColor: COLORS.border,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: COLORS.primary,
    },
    avatarLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.primary,
        marginTop: 8,
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
    loginRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SPACING.xl,
        gap: 6,
    },
    loginLabel: {
        fontSize: 14,
        color: COLORS.textMuted,
    },
    loginLink: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.primary,
    },
});

export default Register;
