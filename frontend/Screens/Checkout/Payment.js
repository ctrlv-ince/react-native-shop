import React, { useState } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';

const Payment = (props) => {
    const order = props.route.params;
    const [selected, setSelected] = useState(1);

    const paymentMethods = [
        { name: 'Cash on Delivery', value: 1 },
        { name: 'Bank Transfer', value: 2 },
        { name: 'Card Payment', value: 3 }
    ];

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Choose your payment method</Text>
            {paymentMethods.map((item, index) => {
                return (
                    <View key={item.name} style={styles.radioBlock}>
                        <Button 
                            title={item.name}
                            color={selected === item.value ? 'orange' : 'grey'}
                            onPress={() => setSelected(item.value)} 
                        />
                    </View>
                );
            })}
            <View style={{ marginTop: 60, alignSelf: 'center', width: '80%' }}>
                <Button 
                    title={"Confirm"} 
                    onPress={() => props.navigation.navigate("Confirm", { order: order })} 
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    radioBlock: {
        marginBottom: 10,
        width: '100%'
    }
});

export default Payment;
