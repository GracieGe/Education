import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { COLORS, SIZES, icons } from '../constants';
import FontAwesome from "react-native-vector-icons/FontAwesome";

const VerticalFoodCardFavourite = ({
    name,
    image,
    distance,
    price,
    fee,
    rating,
    numReviews,
    onPress
}) => {

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.container, {
                backgroundColor: COLORS.white
            }]}>
            <Image
                source={image}
                resizeMode='cover'
                style={styles.image}
            />
            <View style={styles.reviewContainer}>
                <Text style={styles.rating}>PROMO</Text>
            </View>
            <Text style={[styles.name, {
                color: COLORS.greyscale900,
            }]}>{name}</Text>
            <View style={styles.viewContainer}>
                <Text style={[styles.location, {
                    color: COLORS.grayscale700,
                }]}>{distance}  | {" "}</Text>
                <FontAwesome name="star" size={14} color="rgb(250, 159, 28)" />
                <Text style={[styles.location, {
                    color: COLORS.grayscale700,
                }]}>{" "}{rating}  ({numReviews})</Text>
            </View>
            <View style={styles.bottomPriceContainer}>
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>{price}</Text>
                    <Text style={styles.location}>{""}| {" "}</Text>
                    <Image
                        source={icons.moto}
                        resizeMode='contain'
                        style={styles.motoIcon}
                    />
                    <Text style={styles.location}>{fee}</Text>
                </View>
                <TouchableOpacity
                    onPress={onPress}>
                    <Image
                        source={icons.heart2}
                        resizeMode='contain'
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
    image: {
        width: "100%",
        height: 140,
        borderRadius: 16
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
    duration: {
        fontSize: 10,
        fontFamily: "Urbanist SemiBold",
        color: COLORS.primary,
        marginRight: 8
    },
    durationText: {
        fontSize: 14,
        fontFamily: "Urbanist Regular",
        color: COLORS.grayscale700
    },
    heartIcon: {
        width: 16,
        height: 16,
        tintColor: COLORS.red,
        marginLeft: 6
    },
    reviewContainer: {
        position: "absolute",
        top: 16,
        left: 16,
        width: 56,
        height: 20,
        borderRadius: 6,
        backgroundColor: COLORS.primary,
        zIndex: 999,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    rating: {
        fontSize: 12,
        fontFamily: "Urbanist SemiBold",
        color: COLORS.white,
        marginLeft: 4
    },
    viewContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    motoIcon: {
        height: 18,
        width: 18,
        tintColor: COLORS.primary,
        marginRight: 4
    }
})

export default VerticalFoodCardFavourite