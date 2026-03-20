import React, { useContext, useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../Context/Store/AuthGlobal';
import { fetchProducts } from '../../Redux/Actions/productActions';
import { addToCart } from '../../Redux/Actions/cartActions';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import baseURL from '../../assets/common/baseurl';
import * as SecureStore from 'expo-secure-store';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../assets/common/theme';

const { width } = Dimensions.get('window');
const FEATURED_CARD_WIDTH = width * 0.55;

const HomeScreen = (props) => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const context = useContext(AuthContext);
    const dispatch = useDispatch();
    const { products, loading } = useSelector(state => state.productsState);
    const [userProfile, setUserProfile] = useState(null);
    const [categories, setCategories] = useState([]);

    useFocusEffect(
        useCallback(() => {
            dispatch(fetchProducts());

            axios.get(`${baseURL}categories`)
                .then(res => setCategories(res.data))
                .catch(() => {});

            if (context.stateUser.isAuthenticated) {
                SecureStore.getItemAsync('jwt').then(token => {
                    if (token) {
                        axios.get(`${baseURL}users/${context.stateUser.user.userId}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        })
                        .then(res => setUserProfile(res.data))
                        .catch(() => {});
                    }
                });
            }

            return () => {
                setCategories([]);
            };
        }, [context.stateUser.isAuthenticated])
    );

    const featuredProducts = products.filter(p => p.stock > 0).slice(0, 6);
    const userName = userProfile?.name?.split(' ')[0] || 'Gamer';

    const categoryIcons = {
        'Keyboards': 'keypad-outline',
        'Mouse': 'ellipse-outline',
        'Monitors': 'desktop-outline',
        'Headsets': 'headset-outline',
        'Controllers': 'game-controller-outline',
        'Accessories': 'extension-puzzle-outline',
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Hey, {userName}! 👋</Text>
                        <Text style={styles.subtitle}>Ready to level up?</Text>
                    </View>
                    <TouchableOpacity 
                        onPress={() => {
                            if (context.stateUser.isAuthenticated) {
                                navigation.navigate('UserNav');
                            } else {
                                navigation.navigate('UserNav');
                            }
                        }}
                    >
                        {userProfile?.photo ? (
                            <Image source={{ uri: userProfile.photo }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Text style={{ fontSize: 20, fontWeight: '800', color: COLORS.primary }}>
                                    {userName?.charAt(0).toUpperCase() || '?'}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActions}>
                    <TouchableOpacity 
                        style={styles.quickAction}
                        onPress={() => props.navigation.getParent()?.navigate('Shop')}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.quickIcon, { backgroundColor: COLORS.primaryLight }]}>
                            <Ionicons name="storefront-outline" size={22} color={COLORS.primary} />
                        </View>
                        <Text style={styles.quickLabel}>Shop</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.quickAction}
                        onPress={() => props.navigation.getParent()?.navigate('Cart')}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.quickIcon, { backgroundColor: COLORS.accentLight }]}>
                            <Ionicons name="cart-outline" size={22} color={COLORS.accent} />
                        </View>
                        <Text style={styles.quickLabel}>Cart</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.quickAction}
                        onPress={() => navigation.navigate('UserNav')}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.quickIcon, { backgroundColor: '#FEF3C7' }]}>
                            <Ionicons name="person-outline" size={22} color={COLORS.warning} />
                        </View>
                        <Text style={styles.quickLabel}>Profile</Text>
                    </TouchableOpacity>
                </View>

                {/* Categories */}
                {categories.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Categories</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                            {categories.map(cat => (
                                <TouchableOpacity
                                    key={cat._id}
                                    style={styles.categoryChip}
                                    onPress={() => props.navigation.getParent()?.navigate('Shop')}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name={categoryIcons[cat.name] || 'grid-outline'}
                                        size={18}
                                        color={COLORS.primary}
                                    />
                                    <Text style={styles.categoryText}>{cat.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Featured Products */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Featured</Text>
                        <TouchableOpacity onPress={() => props.navigation.getParent()?.navigate('Shop')}>
                            <Text style={styles.seeAll}>See All</Text>
                        </TouchableOpacity>
                    </View>
                    {loading ? (
                        <ActivityIndicator color={COLORS.primary} style={{ paddingVertical: 40 }} />
                    ) : (
                        <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={featuredProducts}
                            keyExtractor={(item) => item.id || item._id}
                            contentContainerStyle={{ gap: 12 }}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.featuredCard}
                                    onPress={() => navigation.navigate('Product Detail', { item })}
                                    activeOpacity={0.7}
                                >
                                    <Image
                                        source={{ uri: item.images?.[0]?.url || 'https://fakeimg.pl/200x200/' }}
                                        style={styles.featuredImage}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.featuredInfo}>
                                        <Text style={styles.featuredName} numberOfLines={1}>{item.name}</Text>
                                        <View style={styles.featuredPriceRow}>
                                            <Text style={styles.featuredPrice}>₱{item.price}</Text>
                                            <TouchableOpacity
                                                style={styles.featuredAddBtn}
                                                onPress={() => {
                                                    dispatch(addToCart(item));
                                                    Toast.show({ topOffset: 60, type: 'success', text1: `${item.name} added` });
                                                }}
                                                activeOpacity={0.7}
                                            >
                                                <Ionicons name="add" size={18} color={COLORS.white} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    )}
                </View>

                {/* Promo Banner */}
                <View style={styles.promoBanner}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.promoTitle}>Level Up Your Setup</Text>
                        <Text style={styles.promoSubtitle}>Browse our latest gaming gear collection</Text>
                        <TouchableOpacity
                            style={styles.promoButton}
                            onPress={() => props.navigation.getParent()?.navigate('Shop')}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.promoButtonText}>Shop Now</Text>
                            <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
                        </TouchableOpacity>
                    </View>
                    <Ionicons name="game-controller" size={64} color={COLORS.white} style={{ opacity: 0.3 }} />
                </View>

                <View style={{ height: 30 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.base,
        paddingBottom: SPACING.md,
    },
    greeting: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.text,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textMuted,
        marginTop: 2,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    avatarPlaceholder: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quickActions: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        gap: 16,
    },
    quickAction: {
        alignItems: 'center',
        gap: 6,
    },
    quickIcon: {
        width: 52,
        height: 52,
        borderRadius: RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quickLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textMuted,
    },
    section: {
        paddingHorizontal: SPACING.lg,
        marginTop: SPACING.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.sm,
    },
    seeAll: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primary,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: SPACING.base,
        paddingVertical: SPACING.sm,
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.xl,
        borderWidth: 1,
        borderColor: COLORS.border,
        ...SHADOWS.small,
    },
    categoryText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.text,
    },
    featuredCard: {
        width: FEATURED_CARD_WIDTH,
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
        ...SHADOWS.medium,
    },
    featuredImage: {
        width: '100%',
        height: FEATURED_CARD_WIDTH * 0.7,
        backgroundColor: COLORS.surfaceAlt,
    },
    featuredInfo: {
        padding: SPACING.md,
    },
    featuredName: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 6,
    },
    featuredPriceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    featuredPrice: {
        fontSize: 17,
        fontWeight: '800',
        color: COLORS.primary,
    },
    featuredAddBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    promoBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: SPACING.lg,
        marginTop: SPACING.xl,
        backgroundColor: COLORS.primary,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        overflow: 'hidden',
    },
    promoTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.white,
        marginBottom: 4,
    },
    promoSubtitle: {
        fontSize: 13,
        color: COLORS.white,
        opacity: 0.8,
        marginBottom: SPACING.md,
    },
    promoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 8,
        paddingHorizontal: SPACING.base,
        borderRadius: RADIUS.sm,
    },
    promoButtonText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '700',
    },
});

export default HomeScreen;
