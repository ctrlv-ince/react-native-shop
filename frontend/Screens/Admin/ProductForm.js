import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform, TextInput, Button, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../../assets/common/baseurl";

const ProductForm = (props) => {
    const [pickerValue, setPickerValue] = useState("Unknown");
    const [brand, setBrand] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [mainImage, setMainImage] = useState("");
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [token, setToken] = useState("");
    const [error, setError] = useState("");
    const [countInStock, setCountInStock] = useState("");
    const [item, setItem] = useState(null);

    useEffect(() => {
        if (!props.route.params) {
            setItem(null);
        } else {
            setItem(props.route.params.item);
            setBrand(props.route.params.item.brand);
            setName(props.route.params.item.name);
            setPrice(props.route.params.item.price.toString());
            setDescription(props.route.params.item.description);
            setMainImage(props.route.params.item.image);
            setImage(props.route.params.item.image);
            setCategory(props.route.params.item.category?._id || props.route.params.item.category);
            setCountInStock(props.route.params.item.countInStock.toString());
        }

        axios.get(`${baseURL}categories`).then((res) => {
             setCategories(res.data);
             // Ensure we have a default category if editing or creating
             if (!props.route.params || res.data.length > 0) {
                 if(res.data.length > 0 && !props.route.params) {
                     setCategory(res.data[0]._id);
                 }
             }
        }).catch((err) => alert("Error loading categories"));

        return () => {
            setCategories([]);
        };
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        if (!result.canceled) {
            setMainImage(result.assets[0].uri);
            setImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        let result = await ImagePicker.launchCameraAsync({
             allowsEditing: true,
             aspect: [4, 3],
             quality: 1
        });
        if (!result.canceled) {
            setMainImage(result.assets[0].uri);
            setImage(result.assets[0].uri);
        }
    }

    const addProduct = async () => {
        if (name === "" || price === "" || description === "" || category === "" || countInStock === "") {
            setError("Please fill in the form correctly");
            return;
        }

        let formData = new FormData();
        const newImageUri = "file:///" + image.split("file:/").join("");

        formData.append("name", name);
        formData.append("brand", brand);
        formData.append("price", price);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("countInStock", countInStock);
        formData.append("richDescription", description);
        formData.append("rating", 0);
        formData.append("numReviews", 0);
        formData.append("isFeatured", false);

        if (image !== item?.image && image) {
            formData.append("image", {
                uri: newImageUri,
                type: "image/jpeg",
                name: newImageUri.split("/").pop()
            });
        }

        const config = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        };

        if (item !== null) {
            axios.put(`${baseURL}products/${item.id}`, formData, config).then((res) => {
                if (res.status === 200 || res.status === 201) {
                    Toast.show({ topOffset: 60, type: "success", text1: "Product successfuly updated" });
                    setTimeout(() => props.navigation.goBack(), 500);
                }
            }).catch((err) => {
                Toast.show({ topOffset: 60, type: "error", text1: "Something went wrong" });
            });
        } else {
            axios.post(`${baseURL}products`, formData, config).then((res) => {
                if (res.status === 200 || res.status === 201) {
                    Toast.show({ topOffset: 60, type: "success", text1: "New Product added" });
                    setTimeout(() => props.navigation.goBack(), 500);
                }
            }).catch((err) => {
                console.log(err.response)
                Toast.show({ topOffset: 60, type: "error", text1: "Something went wrong", text2: err.message });
            });
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
             <View style={styles.imageContainer}>
                <Image style={styles.image} source={{ uri: mainImage ? mainImage : "https://fakeimg.pl/200x200/" }}/>
                <Button title="Pick Photo" onPress={pickImage} />
                <Button title="Use Camera" onPress={takePhoto} color="orange" />
             </View>
             
             <TextInput style={styles.input} placeholder="Brand" value={brand} onChangeText={setBrand} />
             <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
             <TextInput style={styles.input} placeholder="Price" keyboardType={"numeric"} value={price} onChangeText={setPrice} />
             <TextInput style={styles.input} placeholder="Stock Count" keyboardType={"numeric"} value={countInStock} onChangeText={setCountInStock} />
             <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />

             {error ? <Text style={{ color: "red", margin: 10 }}>{error}</Text> : null}

             <Button title="Confirm" onPress={() => addProduct()} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        padding: 20
    },
    imageContainer: {
        width: 200,
        height: 250,
        borderStyle: "solid",
        borderWidth: 8,
        padding: 0,
        justifyContent: "center",
        borderRadius: 100,
        borderColor: "#E0E0E0",
        elevation: 10
    },
    image: {
        width: "100%",
        height: 150,
        borderRadius: 100
    },
    input: {
        width: "80%",
        height: 60,
        backgroundColor: "white",
        margin: 10,
        borderRadius: 20,
        padding: 10,
        borderWidth: 2,
        borderColor: "orange"
    }
});

export default ProductForm;
