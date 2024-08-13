import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { COLORS, SIZES, icons } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import PaymentMethodItem from '../components/PaymentMethodItem';
import Button from '../components/Button';
import config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PaymentMethods = ({ route, navigation }) => {
  const { courseData, count, notes } = route.params; 
  const [selectedItem, setSelectedItem] = useState(null);

  const formatDate = (date) => {
    const padTo2Digits = (num) => num.toString().padStart(2, '0');
    return (
      date.getFullYear() +
      '-' +
      padTo2Digits(date.getMonth() + 1) +
      '-' +
      padTo2Digits(date.getDate()) +
      ' ' +
      padTo2Digits(date.getHours()) +
      ':' +
      padTo2Digits(date.getMinutes()) +
      ':' +
      padTo2Digits(date.getSeconds())
    );
  };

  const timeOfPurchase = formatDate(new Date());

  const handleCheckboxPress = (itemTitle) => {
    setSelectedItem(itemTitle === selectedItem ? null : itemTitle);
  };

  const handleOrderSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const orderData = {
        courseId: courseData.courseId,
        purchasedHours: count,
        amount: courseData.price * count,
        note: notes,
        timeOfPurchase,
      };

      const response = await axios.post(`${config.API_URL}/api/orders`, orderData, {
        headers: {
          'x-auth-token': token
        }
      });

      if (response.status === 201) {
        navigation.navigate("SearchingDriver");
      } else {
        console.error('Error creating order:', response.status);
      }
    } catch (error) {
      console.error('Error creating order:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <Header title="Payment Methods" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={[styles.title, { color: COLORS.greyscale900 }]}>
            Select the payment method you want to use.
          </Text>
          <PaymentMethodItem
            checked={selectedItem === 'Alipay'}
            onPress={() => handleCheckboxPress('Alipay')}
            title="Alipay"
            icon={icons.Alipay}
          />
        </ScrollView>
        <Button
          title="Continue"
          filled
          style={styles.continueBtn}
          onPress={handleOrderSubmit}
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
  title: {
    fontSize: 16,
    fontFamily: "Urbanist Medium",
    color: COLORS.greyscale900,
    marginVertical: 32
  },
  continueBtn: {
    position: "absolute",
    bottom: 16,
    right: 16,
    width: SIZES.width - 32,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
  }
})

export default PaymentMethods;