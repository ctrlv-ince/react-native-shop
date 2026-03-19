import React from 'react';
import { TouchableOpacity, View, Dimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../Redux/Actions/cartActions';
import Toast from 'react-native-toast-message';
import ProductCard from './ProductCard';

const { width } = Dimensions.get('window');

const ProductList = (props) => {
    const { item } = props;
    const dispatch = useDispatch();
    return (
        <TouchableOpacity 
            style={{ width: '50%' }}
            onPress={() => props.navigation.navigate("Product Detail", { item: item })}
        >
            <View style={{ width: width / 2, backgroundColor: 'gainsboro' }}>
                <ProductCard {...item} onPress={() => {
                    dispatch(addToCart(item));
                    Toast.show({
                        topOffset: 60,
                        type: 'success',
                        text1: `${item.name} added to Cart`
                    });
                }} />
            </View>
        </TouchableOpacity>
    );
};

export default ProductList;
