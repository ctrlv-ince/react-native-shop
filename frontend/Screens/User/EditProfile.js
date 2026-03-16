import React, { useState, useEffect, useContext } from "react";
import { View, Text, Image, StyleSheet, TextInput, Button, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import baseURL from "../../assets/common/baseurl";
import { AuthContext } from "../../Context/Store/AuthGlobal";

const EditProfile = (props) => {
    const context = useContext(AuthContext);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
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
                    setMainImage(user.data.photo);
                    setImage(user.data.photo);
                });
        });
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
             <View style={styles.imageContainer}>
                <Image style={styles.image} source={{ uri: mainImage ? mainImage : "https://fakeimg.pl/200x200/" }}/>
                <Button title="Pick Photo" onPress={pickImage} />
                <Button title="Use Camera" onPress={takePhoto} color="orange" />
             </View>
             
             <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
             <TextInput style={styles.input} placeholder="Phone" keyboardType={"numeric"} value={phone} onChangeText={setPhone} />

             <Button title="Save Profile" onPress={() => updateProfile()} />
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
        elevation: 10,
        marginBottom: 20
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

export default EditProfile;
