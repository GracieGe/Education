import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';

// Change the privacy data based on your data 
const AboutUs = () => {

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <View style={[styles.container, { backgroundColor: COLORS.white }]}>
                <Header title="About Us" />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View>
                        <Text style={[styles.settingsTitle, { color: COLORS.black }]}>1. Company Description</Text>
                        <Text style={[styles.body, { color: COLORS.greyscale900 }]}>Hongcai Education company.</Text>
                        <Text style={[styles.body, { color: COLORS.greyscale900 }]}>Senior high school education.</Text>
                        <Text style={[styles.body, { color: COLORS.greyscale900 }]}>A great number of teachers.</Text>
                        <Text style={[styles.body, { color: COLORS.greyscale900 }]}>Qualified teaching level.</Text>
                    </View>
                    <View>
                        <Text style={[styles.settingsTitle, { color: COLORS.black }]}>2. Address</Text>
                        <Text style={[styles.body, { color: COLORS.greyscale900 }]}>112 Miaopu Road, Shanghai</Text>
                    </View>
                    <View>
                        <Text style={[styles.settingsTitle, { color: COLORS.black }]}>3. Contact Email</Text>
                        <Text style={[styles.body, { color: COLORS.greyscale900 }]}>fysphy@sina.cn</Text>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16
    },
    settingsTitle: {
        fontSize: 18,
        fontFamily: "Urbanist Bold",
        color: COLORS.black,
        marginVertical: 26
    },
    body: {
        fontSize: 14,
        fontFamily: "Urbanist Regular",
        color: COLORS.black,
        marginTop: 4
    }
})

export default AboutUs