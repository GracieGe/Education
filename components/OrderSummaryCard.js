import { View, Text, StyleSheet, Image, TextInput } from 'react-native';
import React, { useState } from 'react'; // Import useState hook
import { COLORS } from '../constants';

const OrderSummaryCard = ({ name, image, price, quantity, onPress }) => {
    // State variable to hold the quantity value
    const [inputValue, setInputValue] = useState(`${quantity}x`);


    return (
        <View style={styles.container}>
            <View style={styles.viewLeftContainer}>
                <Image
                    source={{ uri: image }} 
                    resizeMode='contain'
                    style={styles.image}
                />
                <View>
                    <Text style={[styles.name, {
                        color: COLORS.greyscale900
                    }]}>{name}</Text>
                    <Text style={styles.price}>{price}</Text>
                </View>
            </View>
            <View style={styles.viewRightContainer}>
                <TextInput
                    placeholder='1x'
                    placeholderTextColor={COLORS.primary}
                    style={styles.input}
                    value={inputValue}
                    onChangeText={(text) => setInputValue(text)}
                />
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center"
    },
    viewLeftContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1
    },
    image: {
        width: 72,
        height: 72,
        borderRadius: 12,
        marginRight: 12
    },
    name: {
        fontSize: 16,
        fontFamily: "Urbanist Bold",
        color: COLORS.greyscale900,
        marginBottom: 12
    },
    price: {
        fontSize: 18,
        fontFamily: "Urbanist Bold",
        color: COLORS.primary
    },
    viewRightContainer: {
        flexDirection: "column",
        alignItems: "flex-end",
        flex: 1
    },
    input: {
        height: 40,
        width: 40,
        borderRadius: 6,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        paddingLeft: 6,
        borderColor: COLORS.primary,
        borderWidth: 1.4,
        marginBottom: 12,
        color: COLORS.primary
    },
})

export default OrderSummaryCard;
