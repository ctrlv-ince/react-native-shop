import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

const CartItem = (props) => {
    const data = props.item;
    return (
        <View style={styles.body}>
            <Image 
                source={{ uri: data.image ? data.image : 'https://fakeimg.pl/200x200/' }}
                style={styles.image}
            />
            <View style={styles.center}>
                <Text style={{ fontWeight: 'bold' }}>{data.name}</Text>
                <Text>$ {data.price} x {data.quantity}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    body: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: 'lightgrey'
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15
    },
    center: {
        flexDirection: 'column'
    }
});

export default CartItem;
