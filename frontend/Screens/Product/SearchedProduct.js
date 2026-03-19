import React from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../../assets/common/theme';

var { width } = Dimensions.get("window")

const SearchedProduct = (props) => {
    const { productsFiltered } = props;
    return (
        <View style={{ width: width, flex: 1, backgroundColor: COLORS.white }}>
            {productsFiltered.length > 0 ? (
                productsFiltered.map((item) => (
                    <TouchableOpacity 
                        key={item._id} 
                        style={styles.item}
                        onPress={() => props.navigation.navigate("Product Detail", { item: item })}
                        activeOpacity={0.6}
                    >
                        <View style={styles.center}>
                            <Text style={styles.productName}>{item.name}</Text>
                            <Text style={styles.productDesc} numberOfLines={1}>{item.description}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
                    </TouchableOpacity>
                ))
            ) : (
                <View style={styles.emptyContainer}>
                    <Ionicons name="search-outline" size={48} color={COLORS.textLight} />
                    <Text style={styles.emptyText}>
                        No products match the selected criteria
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60,
    },
    emptyText: {
        color: COLORS.textMuted,
        fontSize: 14,
        marginTop: SPACING.md,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.base,
        borderBottomWidth: 1,
        borderColor: COLORS.border,
    },
    center: {
        flex: 1,
    },
    productName: {
        fontWeight: '700',
        fontSize: 15,
        color: COLORS.text,
        marginBottom: 2,
    },
    productDesc: {
        fontSize: 13,
        color: COLORS.textMuted,
    },
})

export default SearchedProduct;
