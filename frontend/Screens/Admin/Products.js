import React, { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";
import baseURL from "../../assets/common/baseurl";
import { COLORS, SPACING, RADIUS, SHADOWS, COMMON_STYLES } from '../../assets/common/theme';

const Products = (props) => {
    const [productList, setProductList] = useState();
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            axios.get(`${baseURL}products`).then((res) => {
                setProductList(res.data);
                setLoading(false);
            });
            return () => {
                setProductList();
                setLoading(true);
            };
        }, [])
    );

    const deleteProduct = (id) => {
        axios.delete(`${baseURL}products/${id}`)
            .then(() => {
                const productsFilter = productList.filter((item) => item.id !== id);
                setProductList(productsFilter);
            })
            .catch((error) => console.log(error));
    };

    const sendPromo = (id) => {
        axios.post(`${baseURL}products/promo/${id}`)
            .then(() => {
                alert("Promo Notification Sent Successfully!");
            })
            .catch((error) => console.log(error));
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
                onPress={() => props.navigation.navigate("ProductForm")}
                activeOpacity={0.7}
            >
                <Ionicons name="add-circle-outline" size={20} color={COLORS.white} />
                <Text style={styles.addButtonText}>Add New Product</Text>
            </TouchableOpacity>

            <FlatList
                data={productList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.productCard}>
                        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                        <View style={styles.actionRow}>
                            <TouchableOpacity 
                                style={[styles.actionBtn, { backgroundColor: COLORS.primaryLight }]}
                                onPress={() => props.navigation.navigate("ProductForm", { item })}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="create-outline" size={16} color={COLORS.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.actionBtn, { backgroundColor: COLORS.warning + '15' }]}
                                onPress={() => sendPromo(item.id)}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="megaphone-outline" size={16} color={COLORS.warning} />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.actionBtn, { backgroundColor: COLORS.danger + '10' }]}
                                onPress={() => deleteProduct(item.id)}
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
    productCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: SPACING.base,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.sm,
        ...SHADOWS.small,
    },
    productName: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.text,
        flex: 1,
        marginRight: SPACING.md,
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

export default Products;
