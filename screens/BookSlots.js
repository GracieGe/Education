import { View, Text, StyleSheet, ScrollView, Alert, Image, TouchableOpacity, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS, SIZES, FONTS, images } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import Feather from "react-native-vector-icons/Feather";
import Input from '../components/Input';
import { getFormatedDate } from "react-native-modern-datepicker";
import DatePickerModal from '../components/DatePickerModal';
import Button from '../components/Button';

const BookSlots = ({ navigation }) => {
  const [image, setImage] = useState(images.user1);
  const [error, setError] = useState();
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [showSlotsDropdown, setShowSlotsDropdown] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");

  const today = new Date();
  const formattedToday = getFormatedDate(today, "YYYY/MM/DD");
  const [startedDate, setStartedDate] = useState("");
  
  const handleOnPressStartDate = () => {
    setOpenStartDatePicker(!openStartDatePicker);
  };

  const slots = [
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "1:00 PM - 2:00 PM",
    "2:00 PM - 3:00 PM"
  ];

  useEffect(() => {
    if (error) {
      Alert.alert('An error occured', error)
    }
  }, [error])
               
  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <Header title="Book Slots" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ alignItems: "center", marginVertical: 12 }}>
            <View style={styles.avatarContainer}>
              <Image
                source={image}
                resizeMode="cover"
                style={styles.avatar} />
              <Text style={styles.teacherName}>Liu Yang</Text>
            </View>
          </View>
          <View>
            <Text style={styles.Label}>Date:</Text>
            <View style={{
              width: SIZES.width - 32
            }}>
              <TouchableOpacity
                style={[styles.inputBtn, {
                  backgroundColor: COLORS.greyscale500,
                  borderColor: COLORS.greyscale500,
                }]}
                onPress={handleOnPressStartDate}
              >
                <Text style={{ ...FONTS.body4, color: COLORS.grayscale400 }}>{startedDate || "Select the date"}</Text>
                <Feather name="calendar" size={24} color={COLORS.grayscale400} />
              </TouchableOpacity>
            </View>
            <Text style={styles.Label}>Available Slots:</Text>
            <View style={{ width: SIZES.width - 32 }}>
              <TouchableOpacity
                style={[styles.inputBtn, {
                  backgroundColor: COLORS.greyscale500,
                  borderColor: COLORS.greyscale500,
                }]}
                onPress={() => setShowSlotsDropdown(!showSlotsDropdown)}
              >
                <Text style={{ ...FONTS.body4, color: COLORS.grayscale400 }}>{selectedSlot || "Select a slot"}</Text>
                <Feather name="chevron-down" size={24} color={COLORS.grayscale400} />
              </TouchableOpacity>
            </View>
            {showSlotsDropdown && (
              <View style={styles.dropdownContainer}>
              {slots.map((slot, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedSlot(slot);
                    setShowSlotsDropdown(false);
                  }}
                >
                  <Text style={{ color: COLORS.black }}>{slot}</Text>
                </TouchableOpacity>
              ))}
            </View>
            )}
            <Text style={styles.Label}>Location:</Text>
            <Input
              id="location"
              onInputChanged={() => {}}
              placeholder=""
              placeholderTextColor={COLORS.black}
            />
          </View>
        </ScrollView>
      </View>
      <DatePickerModal
        open={openStartDatePicker}
        startDate={formattedToday}
        selectedDate={startedDate}
        onClose={() => setOpenStartDatePicker(false)}
        onChangeStartDate={(date) => {
          setStartedDate(date);
          setOpenStartDatePicker(false); 
        }}
      />
      <View style={styles.bottomContainer}>      
        <Button
          title="Submit"
          filled
          style={styles.button}
          onPress={() => navigation.goBack()}
        />
        <Button
          title="Cancel"
          filled
          style={styles.button}
          onPress={() => navigation.goBack()} 
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
    padding: 16,
    backgroundColor: COLORS.white
  },
  avatarContainer: {
    marginVertical: 12,
    alignItems: "center",
    width: 150,
    height: 150,
    borderRadius: 65,
  },
  avatar: {
    height: 110,
    width: 110,
    borderRadius: 65,
  },
  teacherName: {
    marginTop: 8,
    fontSize: 16,
    color: COLORS.black,
    ...FONTS.h2,
  },
  inputBtn: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: COLORS.greyscale500,
    height: 50,
    paddingLeft: 8,
    fontSize: 18,
    justifyContent: "space-between",
    marginVertical: 8,
    backgroundColor: COLORS.greyscale500,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 8
  },
  Label: {
    ...FONTS.h3,
    marginBottom: 5,
    color: COLORS.black,
    marginLeft: 5,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16, 
    marginBottom: 25
  },
  button: {
    flex: 1,
    marginHorizontal: 10, 
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dropdownContainer: {
    marginTop: -11, 
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.greyscale500,
    borderTopWidth: 0, 
    borderRadius: 12,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    backgroundColor: COLORS.greyscale500,
  },
  dropdownItem: {
    paddingVertical: 6
  }
});

export default BookSlots