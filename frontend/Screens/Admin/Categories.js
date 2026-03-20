import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import baseURL from '../../assets/common/baseurl';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../assets/common/theme';

const Categories = (props) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            axios.get(`${baseURL}categories`)
                .then((res) => {
                    setCategories(res.data);
                    setLoading(false);
                })
                .catch((error) => console.log('Error fetching categories'));
                
            return () => {
                setCategories([]);
                setLoading(true);
            }
        }, [])
    );

    const deleteCategory = (id) => {
        Alert.alert(
            "Delete Category",
            "Are you sure you want to delete this category? Products using it may be affected.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        const token = await SecureStore.getItemAsync('jwt');
                        axios.delete(`${baseURL}categories/${id}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        })
                            .then(() => {
                                setCategories(categories.filter((item) => item._id !== id));
                            })
                            .catch((error) => console.log(error));
                    }
                }
            ]
        );
    };

    if (loading) return (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => props.navigation.navigate("CategoryForm")}
                activeOpacity={0.7}
            >
                <Ionicons name="add-circle-outline" size={20} color={COLORS.white} />
                <Text style={styles.addButtonText}>Add New Category</Text>
            </TouchableOpacity>

            <FlatList
                data={categories}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.cardLeft}>
                            {item.color && (
                                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                            )}
                            {item.icon && (
                                <Ionicons name={item.icon} size={20} color={item.color || COLORS.primary} />
                            )}
                            <Text style={styles.name}>{item.name}</Text>
                        </View>
                        <View style={styles.actionRow}>
                            <TouchableOpacity 
                                style={[styles.actionBtn, { backgroundColor: COLORS.primaryLight }]}
                                onPress={() => props.navigation.navigate("CategoryForm", { item })}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="create-outline" size={16} color={COLORS.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.actionBtn, { backgroundColor: COLORS.danger + '10' }]}
                                onPress={() => deleteCategory(item._id)}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: SPACING.base,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.md,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.base,
        ...SHADOWS.medium,
    },
    addButtonText: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: '700',
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: SPACING.base,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.sm,
        ...SHADOWS.small,
    },
    cardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
        marginRight: SPACING.md,
    },
    colorDot: {
        width: 12,
        height: 12,
        borderRadius: RADIUS.full,
    },
    name: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.text,
    },
    actionRow: {
        flexDirection: 'row',
        gap: 8,
    },
    actionBtn: {
        width: 36,
        height: 36,
        borderRadius: RADIUS.sm,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Categories;
