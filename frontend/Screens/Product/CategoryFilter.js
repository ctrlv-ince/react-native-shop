import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, Text, View } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../assets/common/theme';

const CategoryFilter = (props) => {
    return (
        <ScrollView
            bounces={true}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainer}
        >
            <TouchableOpacity
                key={1}
                onPress={() => {
                    props.CategoryFilter('all'), props.setActive(-1)
                }}
                activeOpacity={0.7}
            >
                <View style={[styles.badge, props.active == -1 ? styles.active : styles.inactive]}>
                    <Text style={[styles.badgeText, props.active == -1 ? styles.activeText : styles.inactiveText]}>All</Text>
                </View>
            </TouchableOpacity>
            {props.categories.map((item) => (
                <TouchableOpacity
                    key={item._id}
                    onPress={() => {
                        props.CategoryFilter(item._id), 
                        props.setActive(props.categories.indexOf(item))
                    }}
                    activeOpacity={0.7}
                >
                     <View style={[styles.badge, props.active == props.categories.indexOf(item) ? styles.active : styles.inactive]}>
                        <Text style={[styles.badgeText, props.active == props.categories.indexOf(item) ? styles.activeText : styles.inactiveText]}>
                            {item.name}
                        </Text>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: COLORS.white,
        maxHeight: 56,
    },
    contentContainer: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        gap: 8,
    },
    badge: {
        paddingHorizontal: SPACING.base,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.xl,
        borderWidth: 1.5,
    },
    active: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    inactive: {
        backgroundColor: COLORS.primaryLight,
        borderColor: COLORS.border,
    },
    badgeText: {
        fontSize: 13,
        fontWeight: '600',
    },
    activeText: {
        color: COLORS.white,
    },
    inactiveText: {
        color: COLORS.primary,
    },
})

export default CategoryFilter;
