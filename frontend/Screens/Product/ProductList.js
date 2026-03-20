import React, { useContext } from 'react';
import { TouchableOpacity, View, Dimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../Redux/Actions/cartActions';
import Toast from 'react-native-toast-message';
import ProductCard from './ProductCard';
import { AuthContext } from '../../Context/Store/AuthGlobal';
import { COLORS } from '../../assets/common/theme';

const { width } = Dimensions.get('window');

const ProductList = (props) => {
    const { item } = props;
    const dispatch = useDispatch();
    const context = useContext(AuthContext);
    return (
        <TouchableOpacity 
            style={{ width: '50%', alignItems: 'center' }}
            onPress={() => props.navigation.navigate("Product Detail", { item: item })}
            activeOpacity={0.7}
        >
            <ProductCard {...item} onPress={() => {
                if (!context.stateUser.isAuthenticated) {
                    Toast.show({
                        topOffset: 60,
                        type: 'error',
                        text1: 'Please log in to add items to cart'
                    });
                    return;
                }
                dispatch(addToCart(item));
                Toast.show({
                    topOffset: 60,
                    type: 'success',
                    text1: `${item.name} added to Cart`
                });
            }} />
        </TouchableOpacity>
    );
};

export default ProductList;
