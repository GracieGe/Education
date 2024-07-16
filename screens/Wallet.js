import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import { SIZES, COLORS, images } from '../constants';
import RBSheet from "react-native-raw-bottom-sheet";
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import config from '../config';

const Wallet = () => {
  const [orders, setOrders] = useState([]);
  const refRBSheet = useRef();
  const navigation = useNavigation();
  const userId = 1; 

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/api/orders/user/${userId}/orders`);
        console.log('Fetched orders:', response.data); 
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
  
    fetchOrders();
  }, []);

  const renderHeader = () => {
    return (
      <TouchableOpacity style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Image
            source={images.logo}
            resizeMode='contain'
            style={styles.logo}
          />
          <Text style={[styles.headerTitle, { color: COLORS.greyscale900 }]}>My Courses</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.area}>
      <View style={styles.container}>
        {renderHeader()}
        <FlatList
          data={orders}
          keyExtractor={item => item.orderId.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.cardContainer, { backgroundColor: COLORS.white }]}>
              <View style={styles.detailsContainer}>
                <View>
                  <Image
                    source={images.courses1} 
                    resizeMode='cover'
                    style={styles.serviceImage}
                  />
                </View>
                <View style={styles.detailsRightContainer}>
                  <Text style={[styles.name, { color: COLORS.greyscale900 }]}>{item.courseName}</Text>
                  <Text style={[styles.grade, { color: COLORS.grayscale700 }]}>{item.grade}</Text>
                  <View style={styles.teacherContainer}>
                    <View style={styles.teacherItemContainer}>
                      <Text style={styles.teacher}>Selected Teacher: N/A</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.additionalContainer}>
                <Text style={[styles.grade, { color: COLORS.grayscale700 }]}>Purchased Hours: {item.purchasedHours}</Text>
                <Text style={[styles.grade, { color: COLORS.grayscale700 }]}>Used Hours: {item.usedHours}</Text>
                <Text style={[styles.grade, { color: COLORS.grayscale700 }]}>Remaining Hours: {item.remainingHours}</Text>
              </View>
              <View style={[styles.separateLine, { marginVertical: 10, backgroundColor: COLORS.grayscale200 }]} />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => refRBSheet.current.open()}
                  style={styles.cancelBtn}>
                  <Text style={styles.cancelBtnText}>Select Teacher</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("EReceipt")}
                  style={styles.completionBtn}>
                  <Text style={styles.completionBtnText}>Book Slots</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={false}
          height={332}
          customStyles={{
            wrapper: {
              backgroundColor: "rgba(0,0,0,0.5)",
            },
            draggableIcon: {
              backgroundColor: COLORS.greyscale300,
            },
            container: {
              borderTopRightRadius: 32,
              borderTopLeftRadius: 32,
              height: 332,
              backgroundColor: COLORS.white,
              alignItems: "center",
              width: "100%"
            }
          }}>
          <Text style={[styles.bottomSubtitle, { color: COLORS.red }]}>Cancel Order</Text>
          <View style={[styles.separateLine, { backgroundColor: COLORS.grayscale200 }]} />
          <View style={styles.selectedCancelContainer}>
            <Text style={[styles.cancelTitle, { color: COLORS.greyscale900 }]}>
              Are you sure you want to cancel your order?
            </Text>
            <Text style={[styles.cancelSubtitle, { color: COLORS.grayscale700 }]}>
              Only 80% of the money you can refund from your payment according to our policy.
            </Text>
          </View>
          <View style={styles.bottomContainer}>
            <Button
              title="Cancel"
              style={{
                width: (SIZES.width - 32) / 2 - 8,
                backgroundColor: COLORS.tansparentPrimary,
                borderRadius: 32,
                borderColor: COLORS.tansparentPrimary
              }}
              textColor={COLORS.primary}
              onPress={() => refRBSheet.current.close()}
            />
            <Button
              title="Yes, Cancel"
              filled
              style={styles.removeButton}
              onPress={() => {
                refRBSheet.current.close();
                navigation.navigate("CancelOrder");
              }}
            />
          </View>
        </RBSheet>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.tertiaryWhite,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.tertiaryWhite,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  logo: {
    height: 32,
    width: 32,
    tintColor: COLORS.primary
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900,
    marginLeft: 12
  },
  headerIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900
  },
  cardContainer: {
    width: SIZES.width - 32,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginBottom: 16,
  },
  separateLine: {
    width: "100%",
    height: 0.7,
    backgroundColor: COLORS.greyScale800,
    marginVertical: 12,
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceImage: {
    width: 88,
    height: 88,
    borderRadius: 16,
    marginHorizontal: 12,
  },
  detailsRightContainer: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 17,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900,
  },
  grade: {
    fontSize: 12,
    fontFamily: "Urbanist Regular",
    color: COLORS.grayscale700,
    marginVertical: 6,
  },
  cancelBtn: {
    width: (SIZES.width - 32) / 2 - 20,
    height: 36,
    borderRadius: 24,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    borderColor: COLORS.primary,
    borderWidth: 1.4,
    marginBottom: 12,
  },
  cancelBtnText: {
    fontSize: 16,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.primary,
  },
  completionBtn: {
    width: (SIZES.width - 32) / 2 - 16,
    height: 36,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    borderColor: COLORS.primary,
    borderWidth: 1.4,
    marginBottom: 12,
  },
  completionBtnText: {
    fontSize: 16,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.white,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
    paddingHorizontal: 16,
    width: "100%",
  },
  removeButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.primary,
    borderRadius: 32,
  },
  bottomSubtitle: {
    fontSize: 22,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900,
    textAlign: "center",
    marginVertical: 12,
  },
  selectedCancelContainer: {
    marginVertical: 24,
    paddingHorizontal: 36,
    width: "100%",
  },
  cancelTitle: {
    fontSize: 18,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.greyscale900,
    textAlign: "center",
  },
  cancelSubtitle: {
    fontSize: 14,
    fontFamily: "Urbanist Regular",
    color: COLORS.grayscale700,
    textAlign: "center",
    marginVertical: 8,
    marginTop: 16,
  },
  teacherContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  teacher: {
    fontSize: 17,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.primary,
    textAlign: "center",
  },
  teacherItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  additionalContainer: {
    marginLeft: 12, 
  },
});

export default Wallet;