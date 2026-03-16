import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import axios from 'axios';
import baseURL from '../../assets/common/baseurl';
import Toast from 'react-native-toast-message';

const Register = (props) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const register = () => {
        if (email === '' || name === '' || phone === '' || password === '') {
            setError('Please fill in the form correctly');
            return;
        }

        let user = {
            name: name,
            email: email,
            password: password,
            phone: phone,
            isAdmin: false
        };

        axios
            .post(`${baseURL}users/register`, user)
            .then((res) => {
                if (res.status == 200) {
                    Toast.show({
                        topOffset: 60,
                        type: 'success',
                        text1: 'Registration Succeeded',
                        text2: 'Please login into your account'
                    });
                    setTimeout(() => {
                        props.navigation.navigate('Login');
                    }, 500);
                }
            })
            .catch((error) => {
                Toast.show({
                    topOffset: 60,
                    type: 'error',
                    text1: 'Something went wrong',
                    text2: 'Please try again'
                });
            });
    };

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Register</Text>
            {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
            <TextInput
                style={styles.input}
                placeholder="Email"
                name="email"
                id="email"
                onChangeText={(text) => setEmail(text.toLowerCase())}
            />
            <TextInput
                style={styles.input}
                placeholder="Name"
                name="name"
                id="name"
                onChangeText={(text) => setName(text)}
            />
             <TextInput
                style={styles.input}
                placeholder="Phone Number"
                name="phone"
                id="phone"
                keyboardType="numeric"
                onChangeText={(text) => setPhone(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                name="password"
                id="password"
                secureTextEntry={true}
                onChangeText={(text) => setPassword(text)}
            />
            <View style={styles.buttonGroup}>
                <Button title="Register" onPress={() => register()} />
            </View>
            <View style={styles.buttonGroup}>
                <Button title="Back to Login" onPress={() => props.navigation.navigate('Login')} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    input: {
        width: '80%',
        height: 60,
        backgroundColor: 'white',
        margin: 10,
        borderRadius: 20,
        padding: 10,
        borderWidth: 2,
        borderColor: 'orange'
    },
    buttonGroup: {
        width: '80%',
        alignItems: 'center',
        marginTop: 20
    }
});

export default Register;
