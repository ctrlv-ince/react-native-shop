import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';

var { width } = Dimensions.get("window")

const SearchedProduct = (props) => {
    const { productsFiltered } = props;
    return (
        <View style={{ width: width }}>
            {productsFiltered.length > 0 ? (
                productsFiltered.map((item) => (
                    <View key={item._id} style={styles.item}>
                        <View style={styles.center}>
                            <Text>{item.name}</Text>
                            <Text>{item.description}</Text>
                        </View>
                    </View>
                ))
            ) : (
                <View style={styles.center}>
                    <Text style={{ alignSelf: 'center' }}>
                        No products match the selected criteria
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: 'grey'
    }
})

export default SearchedProduct;
