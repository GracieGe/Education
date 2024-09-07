import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, images } from '../constants';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import OrderSummaryCard from '../components/OrderSummaryCard';
import Button from '../components/Button';
import config from '../config';

const CheckoutOrders = ({ route, navigation }) => {
  const { courseData, count, notes } = route.params;

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <Header title="Checkout Orders" />
        <ScrollView
          contentContainerStyle={{
            backgroundColor: COLORS.tertiaryWhite,
            marginTop: 12
          }}
          showsVerticalScrollIndicator={false}>
          <View style={[styles.summaryContainer, {
            backgroundColor: COLORS.white,
          }]}>
            <View style={styles.orderSummaryView}>
              <Text style={[styles.summaryTitle, {
                color: COLORS.greyscale900
              }]}>Order Summary</Text>
            </View>
            <View style={[styles.separateLine, {
              backgroundColor:  COLORS.grayscale200
            }]} />
            <OrderSummaryCard
              name={`${courseData.courseName} | ${courseData.grade}`}
              image={`${config.API_URL}/${courseData.image}`}
              price={`¥${courseData.price}/h`}
              quantity={count}
              onPress={() => console.log("Clicked")}
            />
            <View style={[styles.separateLine, {
              backgroundColor: COLORS.grayscale200
            }]} />
          </View>
          <View style={[styles.summaryContainer, {
            backgroundColor: COLORS.white,
          }]}>
            <View style={styles.view}>
              <Text style={[styles.viewLeft, {
                color: COLORS.grayscale700
              }]}>Note</Text>
              <Text style={[styles.notesText, { color: COLORS.greyscale900 }]}>{notes}</Text>
            </View>
            <View style={[styles.separateLine, {
              backgroundColor: COLORS.grayscale200
            }]} />
            <View style={styles.view}>
              <Text style={[styles.viewLeft, {
                color: COLORS.grayscale700
              }]}>Total</Text>
              <Text style={[styles.viewRight, { color: COLORS.greyscale900 }]}>¥{courseData.price * count}</Text>
            </View>
          </View>
        </ScrollView>
        <Button
          title={`Place Order - ¥${courseData.price * count}`}
          filled
          onPress={() => navigation.navigate("PaymentMethods", { courseData, count, notes })}
          style={styles.placeOrderButton}
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
    paddingHorizontal: 16,
    paddingTop: 16
  },
  summaryContainer: {
    width: SIZES.width - 32,
    borderRadius: 16,
    padding: 16,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 0,
    marginBottom: 12,
    marginTop: 12,
  },
  view: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12
  },
  viewLeft: {
    fontSize: 14,
    fontFamily: "Urbanist Medium",
    color: COLORS.grayscale700
  },
  viewRight: {
    fontSize: 14,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.greyscale900
  },
  notesText: {
    fontSize: 14,
    fontFamily: "Urbanist Regular",
    color: COLORS.greyscale900,
    flex: 1,
    marginLeft: 10
  },
  separateLine: {
    width: "100%",
    height: 1,
    backgroundColor: COLORS.grayscale200,
    marginVertical: 12
  },
  summaryTitle: {
    fontSize: 20,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900
  },
  orderSummaryView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  placeOrderButton: {
    marginBottom: 12,
    marginTop: 6
  }
})

export default CheckoutOrders