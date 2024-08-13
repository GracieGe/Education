import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { COLORS, SIZES, icons } from '../constants';

const TransactionHistoryItem = ({
    image,
    name,
    date,
    grade,
    amount,
    onPress
}) => {

    const formatDateTime = (isoString) => {
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
      };

    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.container}>
            <View style={styles.viewLeftContainer}>               
                <Image
                    source={{ uri: image }}
                    resizeMode='contain'
                    style={styles.avatar}
                />
                <View>
                    <Text style={[styles.name, {
                        color: COLORS.greyscale900
                    }]}>{name}</Text>
                    <Text style={[styles.date, {
                        color: COLORS.grayscale700
                    }]}>{formatDateTime(date)}</Text>
                </View>
            </View>
            <View style={styles.viewRightContainer}>
                <Text style={[styles.amount, {
                    color: COLORS.greyscale900
                }]}>¥ {amount}</Text>
                <View style={styles.typeContainer}>
                    <Text style={[styles.type, {
                        color: COLORS.grayscale700
                    }]}>{grade}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    container: {
        width: SIZES.width - 32,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 6
    },
    viewLeftContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 0,
        marginRight: 12
    },
    name: {
        fontFamily: "Urbanist Bold",
        fontSize: 16,
        color: COLORS.black,
        marginBottom: 6
    },
    date: {
        fontFamily: "Urbanist Regular",
        fontSize: 12,
        color: COLORS.grayscale700
    },
    viewRightContainer: {
        flexDirection: "column",
    },
    amount: {
        fontFamily: "Urbanist Bold",
        fontSize: 16,
        color: COLORS.black,
        marginBottom: 6,
        textAlign: "right",
        marginBottom: 4
    },
    typeContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    type: {
        fontFamily: "Urbanist Regular",
        fontSize: 14,
        color: COLORS.grayscale700,
        textAlign: "right",
    },
    typeIcon: {
        width: 16,
        height: 16,
        tintColor: COLORS.red
    },
    topUpView1: {
        width: 54,
        height: 54,
        borderRadius: 999,
        marginRight: 12,
        backgroundColor: COLORS.tansparentPrimary,
        alignItems: "center",
        justifyContent: "center"
    },
    topUpView2: {
        width: 42,
        height: 42,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.primary
    },
    walletIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.white
    }
})

export default TransactionHistoryItem