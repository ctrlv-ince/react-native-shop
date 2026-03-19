import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import baseURL from '../../assets/common/baseurl';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../assets/common/theme';

const Categories = (props) => {
    const insets = useSafeAreaInsets();
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
            }
        }, [])
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
            ) : (
                <FlatList
                    data={categories}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.name}>{item.name}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.base },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: {
        backgroundColor: COLORS.white,
        padding: SPACING.md,
        borderRadius: RADIUS.sm,
        marginBottom: SPACING.base,
        ...SHADOWS.small
    },
    name: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 4 }
});

export default Categories;
