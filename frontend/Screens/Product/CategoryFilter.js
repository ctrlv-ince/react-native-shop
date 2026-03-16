import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, Text, View } from 'react-native';

const CategoryFilter = (props) => {
    return (
        <ScrollView
            bounces={true}
            horizontal={true}
            style={{ backgroundColor: "#f2f2f2" }}
        >
            <TouchableOpacity
                key={1}
                onPress={() => {
                    props.CategoryFilter('all'), props.setActive(-1)
                }}
            >
                <View style={[styles.badge, props.active == -1 ? styles.active : styles.inactive]}>
                    <Text style={{ color: 'white' }}>All</Text>
                </View>
            </TouchableOpacity>
            {props.categories.map((item) => (
                <TouchableOpacity
                    key={item._id}
                    onPress={() => {
                        props.CategoryFilter(item._id), 
                        props.setActive(props.categories.indexOf(item))
                    }}
                >
                     <View style={[styles.badge, props.active == props.categories.indexOf(item) ? styles.active : styles.inactive]}>
                        <Text style={{ color: 'white' }}>{item.name}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    badge: {
        margin: 5,
        padding: 10,
        borderRadius: 20
    },
    active: {
        backgroundColor: '#03bafc'
    },
    inactive: {
        backgroundColor: '#a0e1eb'
    }
})

export default CategoryFilter;
