import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import React, { useState } from 'react';
import { COLORS, icons } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import TransactionHistoryItem from '../components/TransactionHistoryItem';
import { ScrollView } from 'react-native-virtualized-view';
import axios from 'axios';
import config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const PurchaseHistory = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrderHistory = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${config.API_URL}/api/orders/user/orders`, {
        headers: {
          'x-auth-token': token,
        },
      });

      const sortedOrders = response.data.sort((a, b) => new Date(b.timeOfPurchase) - new Date(a.timeOfPurchase));

      setOrders(sortedOrders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order history:', error);
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchOrderHistory();
    }, [])
  );

  /**
   * render header
   */
  const renderHeader = () => {
    return (
      <TouchableOpacity style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image
            source={icons.arrowLeft}
            resizeMode='contain'
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <View style={styles.headerLeft}>
          <Text style={[styles.headerTitle, {
            color: COLORS.greyscale900
          }]}>Purchase History</Text>
        </View>
      </TouchableOpacity>
    )
  }

  const renderTransactionHistory = () => {
    if (loading) {
      return <Text>Loading...</Text>;
    }

    return (
      <View>
        <FlatList
          data={orders}
          keyExtractor={item => item.orderId}
          renderItem={({ item }) => (
            <TransactionHistoryItem
              image={`${config.API_URL}/${item.image}`} 
              name={item.courseName} 
              date={item.timeOfPurchase} 
              amount={item.amount} 
              grade = {item.grade}
            />
          )}
        />
      </View>
    )
  }
  
  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        {renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderTransactionHistory()}
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
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  backButton: {
    padding: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.greyscale900,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 4,
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
    marginLeft: 4
  },
  headerIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900
  },
})

export default PurchaseHistory;