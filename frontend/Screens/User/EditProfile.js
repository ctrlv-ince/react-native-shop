import React, { useState, useEffect, useContext } from "react";
import { View, Text, Image, StyleSheet, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import baseURL from "../../assets/common/baseurl";
import { AuthContext } from "../../Context/Store/AuthGlobal";
import { COLORS, SPACING, RADIUS, SHADOWS, COMMON_STYLES } from '../../assets/common/theme';

const EditProfile = (props) => {
    const context = useContext(AuthContext);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [image, setImage] = useState("");
    const [mainImage, setMainImage] = useState("");
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        SecureStore.getItemAsync("jwt").then((res) => {
            axios
                .get(`${baseURL}users/${context.stateUser.user.userId}`, {
                    headers: { Authorization: `Bearer ${res}` },
                })
                .then((user) => {
                    setUserProfile(user.data);
                    setName(user.data.name);
                    setPhone(user.data.phone);
                    setAddress(user.data.address || "");
                    setMainImage(user.data.photo);
                    setImage(user.data.photo);
                });
        });
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        });

        if (!result.canceled) {
            setMainImage(result.assets[0].uri);
            setImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        let result = await ImagePicker.launchCameraAsync({
             mediaTypes: ['images'],
             allowsEditing: true,
             aspect: [1, 1],
             quality: 1
        });
        if (!result.canceled) {
            setMainImage(result.assets[0].uri);
            setImage(result.assets[0].uri);
        }
    }

    const updateProfile = async () => {
        const token = await SecureStore.getItemAsync("jwt");

        let formData = new FormData();
        formData.append("name", name);
        formData.append("phone", phone);
        formData.append("address", address);

        if (image && image !== userProfile?.photo) {
            const newImageUri = "file:///" + image.split("file:/").join("");
            formData.append("photo", {
                uri: newImageUri,
                type: "image/jpeg",
                name: newImageUri.split("/").pop()
            });
        }

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            }
        };

        axios.put(`${baseURL}users/${context.stateUser.user.userId}`, formData, config).then((res) => {
            if (res.status === 200 || res.status === 201) {
                Toast.show({ topOffset: 60, type: "success", text1: "Profile Updated" });
                setTimeout(() => props.navigation.goBack(), 500);
            }
        }).catch((err) => {
            Toast.show({ topOffset: 60, type: "error", text1: "Something went wrong" });
        });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Avatar Section */}
            <View style={styles.avatarCard}>
                <View style={styles.avatarContainer}>
                    <Image 
                        style={styles.image} 
                        source={{ uri: mainImage ? mainImage : "https://fakeimg.pl/200x200/" }}
                    />
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
                <Text style={styles.label}>Name</Text>
                <TextInput style={styles.input} placeholder="Name" placeholderTextColor={COLORS.textMuted} value={name} onChangeText={setName} />
                
                <Text style={styles.label}>Phone</Text>
                <TextInput style={styles.input} placeholder="Phone" placeholderTextColor={COLORS.textMuted} keyboardType={"numeric"} value={phone} onChangeText={setPhone} />

                <Text style={styles.label}>Address</Text>
                <TextInput style={styles.input} placeholder="Address (optional)" placeholderTextColor={COLORS.textMuted} value={address} onChangeText={setAddress} />

                <TouchableOpacity
                    style={[COMMON_STYLES.primaryButton, { marginTop: SPACING.lg }]}
                    onPress={() => updateProfile()}
                    activeOpacity={0.7}
                >
                    <Text style={COMMON_STYLES.primaryButtonText}>Save Changes</Text>
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
    avatarCard: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        alignItems: 'center',
        ...SHADOWS.medium,
        marginBottom: SPACING.base,
    },
    avatarContainer: {
        padding: 4,
        borderRadius: 70,
        borderWidth: 3,
        borderColor: COLORS.primary,
        marginBottom: SPACING.base,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 60,
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
});

export default EditProfile;
