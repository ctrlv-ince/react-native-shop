import React from 'react';
import { View, Dimensions, StyleSheet, Button, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart } from '../../Redux/Actions/cartActions';
import { SwipeListView } from 'react-native-swipe-list-view';
import CartItem from './CartItem';

var { height, width } = Dimensions.get('window');

const Cart = (props) => {
    const cartItems = useSelector(state => state.cartItems);
    const dispatch = useDispatch();

    var total = 0;
    cartItems.forEach(cart => {
        return (total += cart.price * cart.quantity);
    });

    return (
        <>
            {cartItems.length ? (
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <SwipeListView
                        data={cartItems}
                        keyExtractor={(data) => data.id.toString()}
                        renderItem={(data) => (
                             <CartItem item={data.item} />
                        )}
                        renderHiddenItem={(data) => (
                            <View style={styles.hiddenContainer}>
                                <Button 
                                   title="Remove" 
                                   color="red"
                                   onPress={() => dispatch(removeFromCart(data.item))}
                                />
                            </View>
                        )}
                        disableRightSwipe={true}
                        previewOpenDelay={3000}
                        friction={1000}
                        tension={40}
                        leftOpenValue={75}
                        stopLeftSwipe={75}
                        rightOpenValue={-75}
                    />
                    <View style={styles.bottomContainer}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
                            <Text style={styles.price}>$ {Math.round(total * 100) / 100}</Text>
                            <Button title="Clear" onPress={() => dispatch(clearCart())} />
                        </View>
                        <Button
                            title="Checkout"
                            color="green"
                            onPress={() => props.navigation.navigate('CheckoutNavigator')}
                        />
                    </View>
                </View>
            ) : (
                <View style={styles.emptyContainer}>
                    <Text>Looks like your cart is empty</Text>
                    <Text>Add products to your cart to get started</Text>
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    emptyContainer: {
        height: height,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bottomContainer: {
        flexDirection: 'column',
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: 'white',
        elevation: 20,
        paddingBottom: 20,
        width: '100%'
    },
    price: {
        fontSize: 18,
        margin: 20,
        color: 'red'
    },
    hiddenContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        flexDirection: 'row',
        paddingRight: 10,
        paddingTop: 10
    }
});

export default Cart;
