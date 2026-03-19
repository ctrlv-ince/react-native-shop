import React, { useEffect, useContext, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { AuthContext } from '../../Context/Store/AuthGlobal';
import { loginUser } from '../../Context/Actions/Auth.actions';
import Toast from 'react-native-toast-message';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

const Login = (props) => {
    const context = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // TODO: Replace with your actual Google OAuth client IDs for MP2 (20pts)
    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: 'YOUR_EXPO_CLIENT_ID', // Replace with actual Expo client ID
        iosClientId: 'YOUR_IOS_CLIENT_ID',     // Replace with actual iOS client ID
        androidClientId: 'YOUR_ANDROID_CLIENT_ID', // Replace with actual Android client ID
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { authentication } = response;
            // Handle successful google auth, e.g extract token and pass to backend
            Toast.show({ topOffset: 60, type: 'success', text1: 'Google Login Successful' });
        }
    }, [response]);

    useEffect(() => {
        if (context.stateUser.isAuthenticated === true) {
            props.navigation.navigate('User Profile');
        }
    }, [context.stateUser.isAuthenticated]);

    const handleSubmit = () => {
        const user = {
            email,
            password
        };

        if (email === '' || password === '') {
            setError('Please fill in your credentials');
            return;
        }

        loginUser(user, context.dispatch);
    };

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>
            {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
            <TextInput
                style={styles.input}
                placeholder="Enter Email"
                name="email"
                id="email"
                value={email}
                onChangeText={(text) => setEmail(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Enter Password"
                name="password"
                id="password"
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => setPassword(text)}
            />
            <View style={styles.buttonGroup}>
                <Button title="Login" onPress={() => handleSubmit()} />
            </View>
            <View style={styles.buttonGroup}>
                <Text style={styles.middleText}>Don't have an account yet?</Text>
                <Button title="Register" onPress={() => props.navigation.navigate('Register')} />
            </View>
            <View style={[styles.buttonGroup, { marginTop: 40 }]}>
                <Button 
                    title="Sign in with Google" 
                    color="#DB4437" 
                    disabled={!request}
                    onPress={() => promptAsync()} 
                />
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
    },
    middleText: {
        marginBottom: 10,
        alignSelf: 'center'
    }
});

export default Login;
