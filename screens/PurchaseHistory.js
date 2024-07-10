import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import React from 'react';
import { COLORS, SIZES, icons, images } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import SectionHeader from '../components/SectionHeader';
import { transactionHistory } from '../data';
import TransactionHistoryItem from '../components/TransactionHistoryItem';
import { ScrollView } from 'react-native-virtualized-view';

const PurchaseHistory = ({ navigation }) => {
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
    return (
      <View>
        <SectionHeader
          title="Transaction History"
          subtitle="See All"
          onPress={() => navigation.navigate("TransactionHistory")}
        />
        <FlatList
          data={transactionHistory.slice(0, 6)}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TransactionHistoryItem
              image={item.image}
              name={item.name}
              date={item.date}
              type={item.type}
              amount={item.amount}
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
    justifyContent: "space-between"
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
})

export default PurchaseHistory;