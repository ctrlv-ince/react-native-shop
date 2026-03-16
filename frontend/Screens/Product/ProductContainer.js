import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, FlatList, ScrollView, Dimensions, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

import ProductList from './ProductList';
import SearchedProduct from './SearchedProduct';
import CategoryFilter from './CategoryFilter';
import baseURL from '../../assets/common/baseurl';

var { height } = Dimensions.get('window');

const ProductContainer = (props) => {
    const [products, setProducts] = useState([]);
    const [productsFiltered, setProductsFiltered] = useState([]);
    const [focus, setFocus] = useState(false);
    const [categories, setCategories] = useState([]);
    const [productsCtg, setProductsCtg] = useState([]);
    const [active, setActive] = useState();
    const [initialState, setInitialState] = useState([]);
    const [loading, setLoading] = useState(true);
    const [maxPrice, setMaxPrice] = useState('');

    useFocusEffect(
        useCallback(() => {
            setFocus(false);
            setActive(-1);
            
            // Products
            axios
                .get(`${baseURL}products`)
                .then((res) => {
                    setProducts(res.data);
                    setProductsFiltered(res.data);
                    setProductsCtg(res.data);
                    setInitialState(res.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log('Api call error')
                })
        
            // Categories
            axios
                .get(`${baseURL}categories`)
                .then((res) => {
                    setCategories(res.data)
                })
                .catch((error) => {
                    console.log('Api call error')
                })
        
            return () => {
                setProducts([]);
                setProductsFiltered([]);
                setFocus(false);
                setCategories([]);
                setActive();
                setInitialState([]);
            };
        }, [])
    );

    const searchProduct = (text) => {
        setProductsFiltered(
            products.filter((i) => i.name.toLowerCase().includes(text.toLowerCase()))
        );
    };

    const filterByPrice = (priceText) => {
        setMaxPrice(priceText);
        if (priceText === '') {
            setProductsCtg(initialState);
            return;
        }
        const priceNum = parseFloat(priceText);
        setProductsCtg(
            initialState.filter((i) => i.price <= priceNum)
        );
    }

    const openList = () => {
        setFocus(true);
    };

    const onBlur = () => {
        setFocus(false);
    };

    // Categories
    const changeCtg = (ctg) => {
        if (ctg === 'all') {
            setProductsCtg(initialState);
            setActive(true);
        } else {
            setProductsCtg(
                initialState.filter((i) => i.category._id === ctg || i.category === ctg)
            );
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search Products..."
                    onFocus={openList}
                    onChangeText={(text) => searchProduct(text)}
                />
            </View>
            <View style={styles.searchBar}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Max Price Range..."
                    keyboardType="numeric"
                    value={maxPrice}
                    onChangeText={(text) => filterByPrice(text)}
                />
            </View>
            {focus === true ? (
                <SearchedProduct 
                    navigation={props.navigation}
                    productsFiltered={productsFiltered}
                />
            ) : (
                <View>
                    <View>
                        <CategoryFilter
                            categories={categories}
                            CategoryFilter={changeCtg}
                            productsCtg={productsCtg}
                            active={active}
                            setActive={setActive}
                        />
                    </View>
                    {productsCtg.length > 0 ? (
                        <View style={styles.listContainer}>
                            <FlatList
                                numColumns={2}
                                data={productsCtg}
                                renderItem={({ item }) => <ProductList navigation={props.navigation} key={item.id} item={item} />}
                                keyExtractor={(item) => item.id}
                            />
                        </View>
                    ) : (
                        <View style={[styles.center, { height: height / 2 }]}>
                            <Text>No products found</Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'gainsboro',
    },
    listContainer: {
        height: height,
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-start",
        flexWrap: "wrap",
        backgroundColor: "gainsboro",
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    searchBar: {
        width: '100%',
        padding: 10,
        backgroundColor: 'white'
    },
    searchInput: {
        height: 40,
        backgroundColor: '#e8e8e8',
        borderRadius: 20,
        paddingLeft: 20
    }
});

export default ProductContainer;
