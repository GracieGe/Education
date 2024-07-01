import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { COLORS, SIZES, icons } from '../constants';
import FontAwesome from "react-native-vector-icons/FontAwesome";

const HorizontalTeacherProfile = ({
    name,
    image,
    course,
    grade,
    rating,
    numReviews,
    onPress
}) => {
    const [isFavourite, setIsFavourite] = useState(false);

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
            <View style={styles.columnContainer}>
                <View style={styles.topViewContainer}>
                    <Text style={[styles.name, {
                        color: COLORS.greyscale900
                    }]}>{name}</Text>
                </View>
                <View style={styles.viewContainer}>
                    <FontAwesome name="star" size={14} color="rgb(250, 159, 28)" />
                    <Text style={[styles.grade, {
                        color: COLORS.grayscale700,
                    }]}>{" "}{rating}  ({numReviews})</Text>
                </View>
                <View style={styles.bottomViewContainer}>
                    <View style={styles.courseContainer}>
                        <Text style={styles.course}>{course}</Text>
                        <Text style={styles.grade}>{""}| {" "}</Text>
                        <Text style={styles.grade}>{grade}</Text>
                    </View>
                    <TouchableOpacity onPress={() => setIsFavourite(!isFavourite)}>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: SIZES.width - 32,
        backgroundColor: COLORS.white,
        padding: 6,
        borderRadius: 16,
        marginBottom: 12,
        height: 112,
        alignItems: "center",
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 16
    },
    columnContainer: {
        flexDirection: "column",
        marginLeft: 12,
        flex: 1
    },
    name: {
        fontSize: 17,
        fontFamily: "Urbanist Bold",
        color: COLORS.greyscale900,
        marginVertical: 4,
        marginRight: 40
    },
    grade: {
        fontSize: 14,
        fontFamily: "Urbanist Regular",
        color: COLORS.grayscale700,
        marginVertical: 4
    },
    courseContainer: {
        flexDirection: "column",
        marginVertical: 4,
    },
    duration: {
        fontSize: 12,
        fontFamily: "Urbanist SemiBold",
        color: COLORS.primary,
        marginRight: 8
    },
    reviewContainer: {
        position: "absolute",
        top: 16,
        left: 54,
        width: 46,
        height: 20,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
        zIndex: 999,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    rating: {
        fontSize: 10,
        fontFamily: "Urbanist SemiBold",
        color: COLORS.white,
        marginLeft: 4
    },
    topViewContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: SIZES.width - 164
    },
    bottomViewContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 2
    },
    viewContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 4
    },
    courseContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    course: {
        fontSize: 16,
        fontFamily: "Urbanist SemiBold",
        color: COLORS.primary,
        marginRight: 8
    },
});

export default HorizontalTeacherProfile