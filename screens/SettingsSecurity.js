import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { COLORS, icons } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import Button from '../components/Button';

// settings for security
const SettingsSecurity = ({ navigation }) => {

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <Header title="Account" />
        <ScrollView style={styles.scrollView}
          showsVerticalScrollIndicator={false}>        
          <Button
            title="Change Password"
            style={{
              backgroundColor: COLORS.tansparentPrimary,
              borderRadius: 32,
              borderColor: COLORS.tansparentPrimary,
              marginTop: 22
            }}
            textColor={COLORS.black}
            onPress={() => { navigation.navigate("ChangePassword") }}
          />
          <Button
            title="Change Phone Number"
            style={{
              backgroundColor: COLORS.tansparentPrimary,
              borderRadius: 32,
              borderColor: COLORS.tansparentPrimary,
              marginTop: 22
            }}
            textColor={COLORS.black}
            onPress={() => { navigation.navigate("ChangePhoneNumber") }}
          />
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
  scrollView: {
    marginVertical: 22
  },
  arrowRight: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900
  },
  view: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16
  },
  viewLeft: {
    fontSize: 18,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.greyscale900,
    marginRight: 8
  },
  button: {
    backgroundColor: COLORS.tansparentPrimary,
    borderRadius: 32,
    borderColor: COLORS.tansparentPrimary,
    marginTop: 22
  }
})

export default SettingsSecurity