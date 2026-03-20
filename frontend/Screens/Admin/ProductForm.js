import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import * as SecureStore from 'expo-secure-store';
import axios from "axios";
import baseURL from "../../assets/common/baseurl";
import { COLORS, SPACING, RADIUS, SHADOWS, COMMON_STYLES } from '../../assets/common/theme';

const ProductForm = (props) => {
    const [pickerValue, setPickerValue] = useState("Unknown");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [mainImage, setMainImage] = useState("");
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [token, setToken] = useState("");
    const [error, setError] = useState("");
    const [stock, setStock] = useState("");
    const [item, setItem] = useState(null);

    useEffect(() => {
        if (!props.route.params) {
            setItem(null);
        } else {
            setItem(props.route.params.item);
            setName(props.route.params.item.name);
            setPrice(props.route.params.item.price.toString());
            setDescription(props.route.params.item.description);
            const imgUrl = props.route.params.item.images?.[0]?.url || '';
            setMainImage(imgUrl);
            setImage(imgUrl);
            setCategory(props.route.params.item.category?._id || props.route.params.item.category);
            setStock(props.route.params.item.stock?.toString() || '0');
        }

        axios.get(`${baseURL}categories`).then((res) => {
             setCategories(res.data);
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
        if (name === "" || price === "" || description === "" || category === "" || stock === "") {
            setError("Please fill in the form correctly");
            return;
        }

        let formData = new FormData();
        const newImageUri = "file:///" + image.split("file:/").join("");

        formData.append("name", name);
        formData.append("price", price);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("stock", stock);

        if (image !== (item?.images?.[0]?.url) && image) {
            formData.append("image", {
                uri: newImageUri,
                type: "image/jpeg",
                name: newImageUri.split("/").pop()
            });
        }

        const token = await SecureStore.getItemAsync('jwt');
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
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
            {/* Image Section */}
            <View style={styles.imageCard}>
                <View style={styles.imageContainer}>
                    <Image style={styles.image} source={{ uri: mainImage ? mainImage : "https://fakeimg.pl/200x200/" }}/>
                </View>
                <View style={styles.photoButtons}>
                    <TouchableOpacity style={styles.photoButton} onPress={pickImage} activeOpacity={0.7}>
                        <Ionicons name="image-outline" size={18} color={COLORS.primary} />
                        <Text style={styles.photoButtonText}>Gallery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.photoButton} onPress={takePhoto} activeOpacity={0.7}>
                        <Ionicons name="camera-outline" size={18} color={COLORS.accent} />
                        <Text style={[styles.photoButtonText, { color: COLORS.accent }]}>Camera</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Form */}
            <View style={styles.formCard}>
                <Text style={styles.label}>Name *</Text>
                <TextInput style={styles.input} placeholder="Product name" placeholderTextColor={COLORS.textMuted} value={name} onChangeText={setName} />
                
                <Text style={styles.label}>Price *</Text>
                <TextInput style={styles.input} placeholder="Price" placeholderTextColor={COLORS.textMuted} keyboardType={"numeric"} value={price} onChangeText={setPrice} />
                
                <Text style={styles.label}>Stock Count *</Text>
                <TextInput style={styles.input} placeholder="Count in stock" placeholderTextColor={COLORS.textMuted} keyboardType={"numeric"} value={stock} onChangeText={setStock} />
                
                <Text style={styles.label}>Description *</Text>

                <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top', paddingTop: SPACING.md }]} placeholder="Product description" placeholderTextColor={COLORS.textMuted} value={description} onChangeText={setDescription} multiline />

                <Text style={styles.label}>Category *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll} contentContainerStyle={styles.categoryScrollContent}>
                    {categories.map((c) => (
                        <TouchableOpacity
                            key={c._id}
                            style={[
                                styles.categoryChip,
                                category === c._id && styles.categoryChipActive
                            ]}
                            onPress={() => setCategory(c._id)}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.categoryChipText,
                                category === c._id && styles.categoryChipTextActive
                            ]}>{c.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {error ? (
                    <View style={styles.errorBanner}>
                        <Ionicons name="alert-circle" size={16} color={COLORS.danger} />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : null}

                <TouchableOpacity
                    style={[COMMON_STYLES.primaryButton, { marginTop: SPACING.lg }]}
                    onPress={() => addProduct()}
                    activeOpacity={0.7}
                >
                    <Text style={COMMON_STYLES.primaryButtonText}>
                        {item ? 'Update Product' : 'Add Product'}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: SPACING.base,
        backgroundColor: COLORS.background,
    },
    imageCard: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        alignItems: 'center',
        ...SHADOWS.medium,
        marginBottom: SPACING.base,
    },
    imageContainer: {
        width: 160,
        height: 160,
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
        backgroundColor: COLORS.surfaceAlt,
        marginBottom: SPACING.base,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    photoButtons: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    photoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.base,
        borderRadius: RADIUS.sm,
        backgroundColor: COLORS.inputBg,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    photoButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.primary,
    },
    formCard: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        ...SHADOWS.medium,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.textMuted,
        marginBottom: 6,
        marginTop: SPACING.md,
    },
    input: {
        height: 48,
        backgroundColor: COLORS.inputBg,
        borderRadius: RADIUS.md,
        paddingHorizontal: SPACING.md,
        borderWidth: 1.5,
        borderColor: COLORS.inputBorder,
        fontSize: 15,
        color: COLORS.text,
    },
    categoryScroll: {
        marginTop: 4,
    },
    categoryScrollContent: {
        gap: 8,
        paddingVertical: 4,
    },
    categoryChip: {
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.base,
        borderRadius: RADIUS.full,
        backgroundColor: COLORS.inputBg,
        borderWidth: 1.5,
        borderColor: COLORS.inputBorder,
    },
    categoryChipActive: {
        backgroundColor: COLORS.primaryLight,
        borderColor: COLORS.primary,
    },
    categoryChipText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.textMuted,
    },
    categoryChipTextActive: {
        color: COLORS.primary,
    },
    errorBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: COLORS.danger + '10',
        padding: SPACING.md,
        borderRadius: RADIUS.sm,
        marginTop: SPACING.base,
    },
    errorText: {
        color: COLORS.danger,
        fontSize: 13,
        fontWeight: '500',
    },
});

export default ProductForm;
