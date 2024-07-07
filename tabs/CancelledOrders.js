import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SIZES, COLORS } from '../constants';
import { useNavigation } from '@react-navigation/native';
import { cancelledOrders } from '../data';

const CancelledOrders = () => {
  const [orders, setOrders] = useState(cancelledOrders);
  const navigation = useNavigation();

  useEffect(() => {
    setOrders(cancelledOrders);
  }, [cancelledOrders]);

  return (
    <View style={[styles.container, {
      backgroundColor: COLORS.tertiaryWhite
    }]}>
      <FlatList
        data={orders} 
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.cardContainer, {
            backgroundColor: COLORS.white,
          }]}>
            <View style={styles.detailsContainer}>
              <View>
                <Image
                  source={item.image}
                  resizeMode='cover'
                  style={styles.serviceImage}
                />
              </View>
              <View style={styles.detailsRightContainer}>
                <Text style={[styles.name, {
                  color: COLORS.greyscale900
                }]}>{item.name}</Text>
                <Text style={[styles.grade, {
                  color: COLORS.grayscale700,
                }]}>{item.grade}</Text>
                <View style={styles.teacherContainer}>
                  <View style={styles.teacherItemContainer}>
                    <Text style={styles.teacher}>Teacher: {item.teacher}</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.separateLine, {
              marginVertical: 10,
              backgroundColor: COLORS.grayscale200,
            }]} />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate("FoodDetails")}
                style={styles.viewBtn}>
                <Text style={styles.viewBtnText}>View</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.tertiaryWhite,
    marginVertical: 22
  },
  cardContainer: {
    width: SIZES.width - 32,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginBottom: 16
  },
  separateLine: {
    width: "100%",
    height: .7,
    backgroundColor: COLORS.greyScale800,
    marginVertical: 12
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceImage: {
    width: 88,
    height: 88,
    borderRadius: 16,
    marginHorizontal: 12
  },
  detailsRightContainer: {
    flex: 1,
    marginLeft: 12
  },
  name: {
    fontSize: 17,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900
  },
  grade: {
    fontSize: 12,
    fontFamily: "Urbanist Regular",
    color: COLORS.grayscale700,
    marginVertical: 6
  },
  viewBtn: {
    width: (SIZES.width - 32) - 12,
    height: 36,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    borderColor: COLORS.primary,
    borderWidth: 1.4,
    marginBottom: 12
  },
  viewBtnText: {
    fontSize: 16,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.white,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  teacherContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6
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
})

export default CancelledOrders