import { View, StyleSheet, FlatList, Alert } from 'react-native';
import React, {useState, useEffect} from 'react';
import { COLORS, SIZES } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import UserAddressItem from '../components/UserAddressItem';
import Button from '../components/Button';
import axios from 'axios';
import config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useRoute } from '@react-navigation/native';

// user address location
const Address = ({ navigation }) => {
    const route = useRoute();
    const { teacherId } = route.params || {};
    const [userAddresses, setUserAddresses] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        const fetchUserAddresses = async () => {
            try {
                const token = await AsyncStorage.getItem('token'); 
                if (!token) {
                    throw new Error('No token found, please login again');
                }

                const response = await axios.get(`${config.API_URL}/api/addresses`, {
                    headers: {
                        'x-auth-token': token
                    }
                });

                const sortedAddresses = response.data.sort((a, b) => a.addressId - b.addressId);
                setUserAddresses(sortedAddresses);
            } catch (error) {
                // Alert.alert('Error', 'Failed to load user addresses');
            }
        };

        if (isFocused) {
            fetchUserAddresses(); 
        }
    }, [isFocused]); 

    const handleSelectAddress = (address) => {
        navigation.navigate('BookSlots', {
            teacherId,
            selectedAddress: address,
        });
    };

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <View style={[styles.container, { backgroundColor: COLORS.white }]}>
                <Header title="Address" />
                <ScrollView
                    contentContainerStyle={{ marginVertical: 12 }}
                    showsVerticalScrollIndicator={false}>
                    <FlatList
                        data={userAddresses}
                        keyExtractor={item => item.addressId.toString()}
                        renderItem={({ item }) => (
                            <UserAddressItem
                                name={item.label}
                                address={item.address}
                                addressId={item.addressId}
                                navigation={navigation}
                                onPress={() => handleSelectAddress(`(${item.label}) ${item.address}`)}
                            />
                        )}
                    />
                </ScrollView>
            </View>
            <View style={styles.btnContainer}>
                <Button
                    title="Add New Address"
                    onPress={() => navigation.navigate("AddNewAddress")}
                    filled
                    style={styles.btn}
                />
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
    btnContainer: {
        alignItems: "center"
    },
    btn: {
        width: SIZES.width - 32,
        paddingHorizontal: 16,
        marginBottom: 12
    }
})

export default Address