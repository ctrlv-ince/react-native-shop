import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../Context/Store/AuthGlobal';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { COLORS, SPACING, RADIUS, SHADOWS, COMMON_STYLES } from '../../assets/common/theme';

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
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Shipping Information</Text>

                <Text style={styles.label}>Phone *</Text>
                <TextInput style={styles.input} placeholder="Enter phone number" placeholderTextColor={COLORS.textMuted} keyboardType={"numeric"} value={phone} onChangeText={setPhone} />
                
                <Text style={styles.label}>Address Line 1 *</Text>
                <TextInput style={styles.input} placeholder="Street address" placeholderTextColor={COLORS.textMuted} value={address} onChangeText={setAddress} />
                
                <Text style={styles.label}>Address Line 2</Text>
                <TextInput style={styles.input} placeholder="Apt, suite, unit (optional)" placeholderTextColor={COLORS.textMuted} value={address2} onChangeText={setAddress2} />
                
                <Text style={styles.label}>City *</Text>
                <TextInput style={styles.input} placeholder="City" placeholderTextColor={COLORS.textMuted} value={city} onChangeText={setCity} />
                
                <Text style={styles.label}>Zip Code *</Text>
                <TextInput style={styles.input} placeholder="Zip / Postal code" placeholderTextColor={COLORS.textMuted} keyboardType={"numeric"} value={zip} onChangeText={setZip} />
                
                <Text style={styles.label}>Country *</Text>
                <TextInput style={styles.input} placeholder="Country" placeholderTextColor={COLORS.textMuted} value={country} onChangeText={setCountry} />

                <TouchableOpacity
                    style={[COMMON_STYLES.primaryButton, { marginTop: SPACING.lg }]}
                    onPress={checkOut}
                    activeOpacity={0.7}
                >
                    <Text style={COMMON_STYLES.primaryButtonText}>Continue to Payment</Text>
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
    card: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        ...SHADOWS.medium,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.lg,
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
        fontSize: 14,
        color: COLORS.text,
    },
});

export default Checkout;
