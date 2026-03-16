import React, { useState, useEffect } from 'react';
import { Image, View, StyleSheet, Text, ScrollView, Button } from 'react-native';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../Redux/Actions/cartActions';
import Toast from 'react-native-toast-message';

const SingleProduct = (props) => {
    const [item, setItem] = useState(props.route.params.item);
    const dispatch = useDispatch();

    return (
        <View style={styles.container}>
            <ScrollView style={{ marginBottom: 80, padding: 5 }}>
                <View>
                    <Image 
                        source={{ uri: item.image ? item.image : 'https://fakeimg.pl/400x400/' }}
                        resizeMode="contain"
                        style={styles.image}
                    />
                </View>
                <View style={styles.contentContainer}>
                    <Text style={styles.contentHeader}>{item.name}</Text>
                    <Text style={styles.contentText}>{item.brand}</Text>
                </View>
                <View style={styles.availabilityContainer}>
                    <Text style={[styles.availability, { color: item.countInStock > 0 ? 'green' : 'red' }]}>
                        {item.countInStock > 0 ? 'Available' : 'Out of Stock'}
                    </Text>
                    <Text style={styles.description}>{item.description}</Text>
                </View>
            </ScrollView>

            <View style={styles.bottomContainer}>
                <Text style={styles.price}>$ {item.price}</Text>
                <Button 
                    title="Add" 
                    color="green" 
                    onPress={() => {
                        dispatch(addToCart(item));
                        Toast.show({
                            topOffset: 60,
                            type: 'success',
                            text1: `${item.name} added to Cart`
                        });
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        height: '100%',
        backgroundColor: 'white'
    },
    imageContainer: {
        backgroundColor: 'white',
        padding: 0,
        margin: 0
    },
    image: {
        width: '100%',
        height: 250
    },
    contentContainer: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    contentHeader: {
        fontWeight: 'bold',
        marginBottom: 20,
        fontSize: 24
    },
    contentText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20
    },
    bottomContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: 'white',
        width: '100%',
        justifyContent: 'space-between',
        padding: 20,
        alignItems: 'center',
        elevation: 20
    },
    price: {
        fontSize: 24,
        margin: 20,
        color: 'red'
    },
    availabilityContainer: {
        marginBottom: 20,
        alignItems: "center"
    },
    availability: {
        flexDirection: 'row',
        marginBottom: 10,
        fontWeight: 'bold'
    },
    description: {
        textAlign: 'center',
        padding: 10
    }
});

export default SingleProduct;
