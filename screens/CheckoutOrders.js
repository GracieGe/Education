import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, icons, images } from '../constants';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import OrderSummaryCard from '../components/OrderSummaryCard';
import Button from '../components/Button';

const CheckoutOrders = ({ navigation }) => {

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
              name="Chinese | Senior One."
              image={images. courses1}
              price="$12.00"
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
              <Text style={[styles.viewRight, { color: COLORS.greyscale900 }]}>$24.00</Text>
            </View>
            <View style={[styles.separateLine, {
              backgroundColor: COLORS.grayscale200
            }]} />
            <View style={styles.view}>
              <Text style={[styles.viewLeft, {
                color: COLORS.grayscale700
              }]}>Total</Text>
              <Text style={[styles.viewRight, { color: COLORS.greyscale900 }]}>$24.00</Text>
            </View>
          </View>
        </ScrollView>
        <Button
          title="Place Order - $24.00"
          filled
          onPress={() => navigation.navigate("PaymentMethods")}
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
  addressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addressLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  addressLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  view1: {
    height: 52,
    width: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.tansparentPrimary,
  },
  view2: {
    height: 38,
    width: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
  locationIcon: {
    height: 20,
    width: 20,
    tintColor: COLORS.white
  },
  viewView: {
    flexDirection: "row",
    alignItems: "center",
  },
  homeTitle: {
    fontSize: 18,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900
  },
  defaultView: {
    width: 64,
    height: 26,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.tansparentPrimary,
    marginHorizontal: 12
  },
  defaultTitle: {
    fontSize: 12,
    fontFamily: "Urbanist Medium",
    color: COLORS.primary,
  },
  addressTitle: {
    fontSize: 14,
    fontFamily: "Urbanist Medium",
    color: COLORS.grayscale700,
    marginVertical: 4
  },
  viewAddress: {
    marginHorizontal: 16
  },
  arrowRightIcon: {
    height: 16,
    width: 16,
    tintColor: COLORS.greyscale900
  },
  orderSummaryView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  addItemView: {
    width: 78,
    height: 26,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    borderColor: COLORS.primary,
    borderWidth: 1.4,
  },
  addItemText: {
    fontSize: 12,
    fontFamily: "Urbanist Medium",
    color: COLORS.primary,
  },
  viewItemTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  viewLeftItemTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  walletIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.primary,
    marginRight: 16
  },
  viewItemTypeTitle: {
    fontSize: 14,
    fontFamily: "Urbanist Medium",
    color: COLORS.grayscale700,
    marginRight: 16
  },
  placeOrderButton: {
    marginBottom: 12,
    marginTop: 6
  }
})

export default CheckoutOrders