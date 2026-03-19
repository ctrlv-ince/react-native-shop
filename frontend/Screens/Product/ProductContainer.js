import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, FlatList, Dimensions, TextInput, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../Redux/Actions/productActions';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

import ProductList from './ProductList';
import SearchedProduct from './SearchedProduct';
import CategoryFilter from './CategoryFilter';
import baseURL from '../../assets/common/baseurl';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../assets/common/theme';

var { height } = Dimensions.get('window');

const ProductContainer = (props) => {
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { products, loading: productsLoading, error } = useSelector(state => state.productsState);

    const [productsFiltered, setProductsFiltered] = useState([]);
    const [focus, setFocus] = useState(false);
    const [categories, setCategories] = useState([]);
    const [productsCtg, setProductsCtg] = useState([]);
    const [active, setActive] = useState();
    const [maxPrice, setMaxPrice] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    useFocusEffect(
        useCallback(() => {
            dispatch(fetchProducts());
            
            setFocus(false);
            setActive(-1);
            
        
            // Categories
            axios
                .get(`${baseURL}categories`)
                .then((res) => {
                    setCategories(res.data)
                })
                .catch((error) => {
                    console.log('Api call error')
                });
        
            return () => {
                setProductsFiltered([]);
                setFocus(false);
                setCategories([]);
                setActive();
            };
        }, [dispatch])
    );

    useEffect(() => {
        if (products.length > 0) {
            setProductsFiltered(products);
            setProductsCtg(products);
        }
    }, [products]);

    const searchProduct = (text) => {
        setProductsFiltered(
            products.filter((i) => i.name.toLowerCase().includes(text.toLowerCase()))
        );
    };

    const filterByPrice = (priceText) => {
        setMaxPrice(priceText);
    }

    // Combined category + price filter
    useEffect(() => {
        let filtered = products;

        // Apply category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter((i) => i.category._id === selectedCategory || i.category === selectedCategory);
        }

        // Apply price filter
        if (maxPrice !== '') {
            const priceNum = parseFloat(maxPrice);
            if (!isNaN(priceNum)) {
                filtered = filtered.filter((i) => i.price <= priceNum);
            }
        }

        setProductsCtg(filtered);
    }, [selectedCategory, maxPrice, products]);

    const openList = () => {
        setFocus(true);
    };

    const onBlur = () => {
        setFocus(false);
    };

    // Categories
    const changeCtg = (ctg) => {
        setSelectedCategory(ctg);
        if (ctg === 'all') {
            setActive(true);
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>GameZone</Text>
                    <Text style={styles.headerSubtitle}>Find your next gear</Text>
                </View>
                <TouchableOpacity 
                    style={styles.profileButton}
                    onPress={() => navigation.navigate('UserNav')}
                >
                    <Ionicons name="person-circle-outline" size={36} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            {productsLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
            <>
            {/* Search Bar */}
            <View style={styles.searchSection}>
                <View style={styles.searchInputContainer}>
                    <Ionicons name="search" size={18} color={COLORS.textMuted} style={{ marginRight: 8 }} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search products..."
                        placeholderTextColor={COLORS.textMuted}
                        onFocus={openList}
                        onChangeText={(text) => searchProduct(text)}
                    />
                </View>
                <View style={styles.searchInputContainer}>
                    <Ionicons name="pricetag-outline" size={18} color={COLORS.textMuted} style={{ marginRight: 8 }} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Max price..."
                        placeholderTextColor={COLORS.textMuted}
                        keyboardType="numeric"
                        value={maxPrice}
                        onChangeText={(text) => filterByPrice(text)}
                    />
                </View>
            </View>

            {focus === true ? (
                <SearchedProduct 
                    navigation={props.navigation}
                    productsFiltered={productsFiltered}
                />
            ) : (
                <View style={{ flex: 1 }}>
                    <CategoryFilter
                        categories={categories}
                        CategoryFilter={changeCtg}
                        productsCtg={productsCtg}
                        active={active}
                        setActive={setActive}
                    />
                    {productsCtg.length > 0 ? (
                        <FlatList
                            numColumns={2}
                            data={productsCtg}
                            renderItem={({ item }) => <ProductList navigation={props.navigation} key={item.id} item={item} />}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.listContainer}
                            showsVerticalScrollIndicator={false}
                        />
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="game-controller-outline" size={64} color={COLORS.textLight} />
                            <Text style={styles.emptyText}>No products found</Text>
                        </View>
                    )}
                </View>
            )}
            </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.base,
        paddingBottom: SPACING.sm,
        backgroundColor: COLORS.white,
        ...SHADOWS.small,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: COLORS.primary,
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 13,
        color: COLORS.textMuted,
        marginTop: 2,
    },
    profileButton: {
        padding: 4,
    },
    searchSection: {
        paddingHorizontal: SPACING.base,
        paddingVertical: SPACING.sm,
        backgroundColor: COLORS.white,
        gap: 8,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.inputBg,
        borderRadius: RADIUS.md,
        paddingHorizontal: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    searchInput: {
        flex: 1,
        height: 42,
        fontSize: 14,
        color: COLORS.text,
    },
    listContainer: {
        paddingHorizontal: SPACING.sm,
        paddingBottom: 100,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.textMuted,
        marginTop: SPACING.md,
    },
});

export default ProductContainer;
