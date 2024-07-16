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

const PaymentMethods = ({ route, navigation }) => {
  const { courseData, count, notes } = route.params; 
  const [selectedItem, setSelectedItem] = useState(null);

  const userId = 1;
  const usedHours = 0;

  console.log("Received params:", { courseData, count, notes });

  const handleCheckboxPress = (itemTitle) => {
    setSelectedItem(itemTitle === selectedItem ? null : itemTitle);
  };

  const handleOrderSubmit = async () => {
    console.log("Order data being sent:", {
      userId,
      usedHours,
      courseId: courseData.courseId,
      purchasedHours: count,
      remainingHours: count,
      amount: courseData.price * count,
      note: notes,
    });

    try {
      const response = await axios.post(`${config.API_URL}/api/orders`, {
        userId,
        courseId: courseData.courseId,
        purchasedHours: count,
        amount: courseData.price * count,
        note: notes,
      });

      if (response.status === 201) {
        navigation.navigate("SearchingDriver");
      } else {
        console.error('Error creating order:', response.status);
      }
    } catch (error) {
      console.error('Error creating order:', error);
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
            checked={selectedItem === 'Paypal'}
            onPress={() => handleCheckboxPress('Paypal')}
            title="Paypal"
            icon={icons.paypal}
          />
          <PaymentMethodItem
            checked={selectedItem === 'Google Pay'}
            onPress={() => handleCheckboxPress('Google Pay')}
            title="Google Pay"
            icon={icons.google}
          />
          <PaymentMethodItem
            checked={selectedItem === 'Apple Pay'}
            onPress={() => handleCheckboxPress('Apple Pay')}
            title="Apple Pay"
            icon={icons.apple}
            tintColor={COLORS.black}
          />
          <PaymentMethodItem
            checked={selectedItem === 'Credit Card'}
            onPress={() => handleCheckboxPress('Credit Card')}
            title="•••• •••• •••• •••• 4679"
            icon={icons.creditCard}
          />
          <Button
            title="Add New Card"
            onPress={() => { navigation.navigate("AddNewCard") }}
            style={{
              width: SIZES.width - 32,
              borderRadius: 32,
              backgroundColor: COLORS.tansparentPrimary,
              borderColor: COLORS.tansparentPrimary
            }}
            textColor={COLORS.primary}
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