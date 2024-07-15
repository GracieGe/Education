import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { COLORS, SIZES } from '../constants';
import FontAwesome from "react-native-vector-icons/FontAwesome";

const VerticalCourseCard = ({
    courseName,
    grade,
    price,
    rating,
    numReviews,
    onPress
}) => {
    const [isFavourite, setIsFavourite] = useState(false);

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.container, { backgroundColor: COLORS.white }]}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: null }} 
                    style={styles.image}
                />
            </View>
            <Text style={styles.name}>{courseName}</Text>
            <View style={styles.viewContainer}>
                <Text style={styles.location}>{grade}  | {" "}</Text>
                <FontAwesome name="star" size={14} color="rgb(250, 159, 28)" />
                <Text style={styles.location}>{" "}{rating}  ({numReviews})</Text>
            </View>
            <View style={styles.bottomPriceContainer}>
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>¥{price}/h</Text>
                </View>
                <TouchableOpacity onPress={() => setIsFavourite(!isFavourite)}>
                    <FontAwesome
                        name={isFavourite ? "heart" : "heart-o"}
                        size={16}
                        color={COLORS.red}
                        style={styles.heartIcon}
                    />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        width: (SIZES.width - 32) / 2 - 12,
        backgroundColor: COLORS.white,
        padding: 6,
        borderRadius: 16,
        marginBottom: 12,
        marginRight: 8
    },
    imageContainer: {
        width: "100%",
        height: 140,
        borderRadius: 16,
        backgroundColor: COLORS.lightGray, 
        justifyContent: "center",
        alignItems: "center"
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 16,
        resizeMode: "cover"
    },
    name: {
        fontSize: 16,
        fontFamily: "Urbanist Bold",
        color: COLORS.greyscale900,
        marginVertical: 4
    },
    location: {
        fontSize: 12,
        fontFamily: "Urbanist Regular",
        color: COLORS.grayscale700,
        marginVertical: 4
    },
    bottomPriceContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    price: {
        fontSize: 16,
        fontFamily: "Urbanist SemiBold",
        color: COLORS.primary,
        marginRight: 8
    },
    heartIcon: {
        marginLeft: 6
    },
    viewContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
})

export default VerticalCourseCard;