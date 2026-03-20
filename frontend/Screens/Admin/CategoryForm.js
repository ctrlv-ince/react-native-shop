import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import Toast from "react-native-toast-message";
import * as SecureStore from 'expo-secure-store';
import axios from "axios";
import baseURL from "../../assets/common/baseurl";
import { COLORS, SPACING, RADIUS, SHADOWS, COMMON_STYLES } from '../../assets/common/theme';

const PRESET_COLORS = [
    '#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#6366F1',
];

const PRESET_ICONS = [
    'game-controller', 'headset', 'laptop', 'phone-portrait',
    'watch', 'tv', 'musical-notes', 'camera', 'fitness',
    'shirt', 'basketball', 'car-sport', 'fast-food', 'book',
];

const CategoryForm = (props) => {
    const [name, setName] = useState("");
    const [icon, setIcon] = useState("");
    const [color, setColor] = useState("");
    const [error, setError] = useState("");
    const [item, setItem] = useState(null);

    useEffect(() => {
        if (props.route.params) {
            const cat = props.route.params.item;
            setItem(cat);
            setName(cat.name || "");
            setIcon(cat.icon || "");
            setColor(cat.color || "");
        }
    }, []);

    const submitCategory = async () => {
        if (name === "") {
            setError("Category name is required");
            return;
        }

        const data = { name, icon, color };
        const token = await SecureStore.getItemAsync('jwt');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        if (item !== null) {
            axios.put(`${baseURL}categories/${item._id}`, data, config)
                .then((res) => {
                    if (res.status === 200) {
                        Toast.show({ topOffset: 60, type: "success", text1: "Category updated successfully" });
                        setTimeout(() => props.navigation.goBack(), 500);
                    }
                })
                .catch(() => {
                    Toast.show({ topOffset: 60, type: "error", text1: "Something went wrong" });
                });
        } else {
            axios.post(`${baseURL}categories`, data, config)
                .then((res) => {
                    if (res.status === 200 || res.status === 201) {
                        Toast.show({ topOffset: 60, type: "success", text1: "Category created successfully" });
                        setTimeout(() => props.navigation.goBack(), 500);
                    }
                })
                .catch(() => {
                    Toast.show({ topOffset: 60, type: "error", text1: "Something went wrong" });
                });
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.formCard}>
                <Text style={styles.label}>Category Name *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter category name"
                    placeholderTextColor={COLORS.textMuted}
                    value={name}
                    onChangeText={(text) => { setName(text); setError(""); }}
                />

                <Text style={styles.label}>Icon</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScroll} contentContainerStyle={styles.pickerContent}>
                    {PRESET_ICONS.map((iconName) => (
                        <TouchableOpacity
                            key={iconName}
                            style={[
                                styles.iconChip,
                                icon === iconName && styles.iconChipActive,
                            ]}
                            onPress={() => setIcon(iconName)}
                            activeOpacity={0.7}
                        >
                            <Ionicons name={iconName} size={22} color={icon === iconName ? COLORS.primary : COLORS.textMuted} />
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <Text style={styles.label}>Color</Text>
                <View style={styles.colorGrid}>
                    {PRESET_COLORS.map((c) => (
                        <TouchableOpacity
                            key={c}
                            style={[
                                styles.colorSwatch,
                                { backgroundColor: c },
                                color === c && styles.colorSwatchActive,
                            ]}
                            onPress={() => setColor(c)}
                            activeOpacity={0.7}
                        >
                            {color === c && (
                                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {error ? (
                    <View style={styles.errorBanner}>
                        <Ionicons name="alert-circle" size={16} color={COLORS.danger} />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : null}

                <TouchableOpacity
                    style={[COMMON_STYLES.primaryButton, { marginTop: SPACING.lg }]}
                    onPress={submitCategory}
                    activeOpacity={0.7}
                >
                    <Text style={COMMON_STYLES.primaryButtonText}>
                        {item ? 'Update Category' : 'Add Category'}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: SPACING.base,
        backgroundColor: COLORS.background,
    },
    formCard: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        ...SHADOWS.medium,
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
    pickerScroll: {
        marginTop: 4,
    },
    pickerContent: {
        gap: 8,
        paddingVertical: 4,
    },
    iconChip: {
        width: 44,
        height: 44,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.inputBg,
        borderWidth: 1.5,
        borderColor: COLORS.inputBorder,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconChipActive: {
        backgroundColor: COLORS.primaryLight,
        borderColor: COLORS.primary,
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 4,
    },
    colorSwatch: {
        width: 36,
        height: 36,
        borderRadius: RADIUS.full,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    colorSwatchActive: {
        borderColor: COLORS.text,
        ...SHADOWS.small,
    },
    errorBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: COLORS.danger + '10',
        padding: SPACING.md,
        borderRadius: RADIUS.sm,
        marginTop: SPACING.base,
    },
    errorText: {
        color: COLORS.danger,
        fontSize: 13,
        fontWeight: '500',
    },
});

export default CategoryForm;
