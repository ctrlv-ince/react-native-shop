import React, { useState, useCallback } from "react";
import { View, Text, FlatList, Button, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import baseURL from "../../assets/common/baseurl";

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

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <Button title="Add New Product" onPress={() => props.navigation.navigate("ProductForm")} color="green"/>
            </View>
            <FlatList
                data={productList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.itemText}>{item.name}</Text>
                        <View style={{flexDirection: 'column'}}>
                           <View style={{flexDirection: 'row', marginBottom: 5}}>
                               <Button title="Edit" onPress={() => props.navigation.navigate("ProductForm", { item })}/>
                               <View style={{width: 5}}/>
                               <Button title="Promo" color="orange" onPress={() => sendPromo(item.id)} />
                               <View style={{width: 5}}/>
                               <Button title="Delete" color="red" onPress={() => deleteProduct(item.id)} />
                           </View>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    buttonContainer: {
        margin: 20,
        alignSelf: "center",
    },
    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 15,
        borderBottomWidth: 1,
        borderColor: "gray"
    },
    itemText: {
        fontSize: 16,
        fontWeight: "bold"
    }
});

export default Products;
