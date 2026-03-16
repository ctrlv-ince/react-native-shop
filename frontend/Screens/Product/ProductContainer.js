import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

import ProductList from './ProductList';
import baseURL from '../../assets/common/baseurl';

const ProductContainer = (props) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            axios
                .get(`${baseURL}products`)
                .then((res) => {
                    setProducts(res.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log('Api call error:', error);
                    setLoading(false);
                });

            return () => {
                setProducts([]);
            };
        }, [])
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="red" />
                </View>
            ) : (
                <View>
                    <FlatList
                        numColumns={2}
                        data={products}
                        renderItem={({ item }) => (
                            <ProductList
                                navigation={props.navigation}
                                key={item.id}
                                item={item}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                    />
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
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    }
});

export default ProductContainer;
