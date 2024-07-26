import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import { SIZES, COLORS, images } from '../constants';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Course = () => {
  const [orders, setOrders] = useState([]);
  const navigation = useNavigation();

  const fetchOrders = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); 
      const response = await axios.get(`${config.API_URL}/api/orders/user/orders`, {
        headers: {
          'x-auth-token': token 
        }
      });
      console.log('Fetched orders:', response.data); 
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchOrders();
    }, [])
  );

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

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No courses found.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.area}>
      <View style={styles.container}>
        {renderHeader()}
        <FlatList
          data={orders}
          keyExtractor={item => item.orderId.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyComponent}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.cardContainer, { backgroundColor: COLORS.white }]}>
              <View style={styles.detailsContainer}>
                <View>
                  <Image
                    source={{ uri: `${config.API_URL}/${item.image}` }}
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
                  onPress={() => navigation.navigate("SelectTeachers", { courseId: item.courseId })}
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

export default Course;