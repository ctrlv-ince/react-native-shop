import React, { useState, useEffect, useContext } from 'react';
import { Text, View, Button, StyleSheet, TextInput, ScrollView } from 'react-native';
import { AuthContext } from '../../Context/Store/AuthGlobal';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';

const Checkout = (props) => {
    const context = useContext(AuthContext);
    const cartItems = useSelector(state => state.cartItems);

    const [orderItems, setOrderItems] = useState([]);
    const [address, setAddress] = useState('');
    const [address2, setAddress2] = useState('');
    const [city, setCity] = useState('');
    const [zip, setZip] = useState('');
    const [country, setCountry] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        setOrderItems(cartItems);

        if(context.stateUser.isAuthenticated) {
            setPhone(context.stateUser.userProfile?.phone || '');
            // Could fill address from profile if preferred
        }

        return () => {
            setOrderItems([]);
        }
    }, [cartItems]);

    const checkOut = () => {
        if (!address || !city || !zip || !country || !phone) {
            Toast.show({ topOffset: 60, type: 'error', text1: 'Please fill in required fields' });
            return;
        }

        let order = {
            city,
            country,
            dateOrdered: Date.now(),
            orderItems: cartItems.map(item => ({ product: item.id, quantity: item.quantity })),
            phone,
            shippingAddress1: address,
            shippingAddress2: address2,
            status: "Pending",
            user: context.stateUser.user.userId,
            zip,
        }

        props.navigation.navigate("Payment", { order: order })
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
             <TextInput style={styles.input} placeholder="Phone" keyboardType={"numeric"} value={phone} onChangeText={setPhone} />
             <TextInput style={styles.input} placeholder="Shipping Address 1" value={address} onChangeText={setAddress} />
             <TextInput style={styles.input} placeholder="Shipping Address 2" value={address2} onChangeText={setAddress2} />
             <TextInput style={styles.input} placeholder="City" value={city} onChangeText={setCity} />
             <TextInput style={styles.input} placeholder="Zip Code" keyboardType={"numeric"} value={zip} onChangeText={setZip} />
             <TextInput style={styles.input} placeholder="Country" value={country} onChangeText={setCountry} />

             <View style={{ width: '80%', alignItems: "center", marginTop: 20 }}>
                 <Button title="Confirm" onPress={checkOut}/>
             </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        padding: 20
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

export default Checkout;
