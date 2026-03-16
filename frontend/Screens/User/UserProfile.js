import React, { useContext, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import baseURL from '../../assets/common/baseurl';
import { AuthContext } from '../../Context/Store/AuthGlobal';
import { logoutUser } from '../../Context/Actions/Auth.actions';

const UserProfile = (props) => {
    const context = useContext(AuthContext);
    const [userProfile, setUserProfile] = useState();

    useFocusEffect(
        useCallback(() => {
            if (
                context.stateUser.isAuthenticated === false || 
                context.stateUser.isAuthenticated === null
            ) {
                props.navigation.navigate('Login');
            } else {
                SecureStore.getItemAsync('jwt').then((res) => {
                    axios
                        .get(`${baseURL}users/${context.stateUser.user.userId}`, {
                            headers: { Authorization: `Bearer ${res}` },
                        })
                        .then((user) => setUserProfile(user.data));
                });
            }

            return () => {
                setUserProfile();
            };
        }, [context.stateUser.isAuthenticated])
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={{ fontSize: 30 }}>
                {userProfile ? userProfile.name : ''}
            </Text>
            <View style={{ marginTop: 20 }}>
                <Text style={{ margin: 10 }}>
                    Email: {userProfile ? userProfile.email : ''}
                </Text>
                <Text style={{ margin: 10 }}>
                    Phone: {userProfile ? userProfile.phone : ''}
                </Text>
            </View>
            <View style={{ marginTop: 80 }}>
                <Button title={"Sign Out"} onPress={() => {
                    SecureStore.deleteItemAsync('jwt');
                    logoutUser(context.dispatch);
                }}/>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20
    }
});

export default UserProfile;
