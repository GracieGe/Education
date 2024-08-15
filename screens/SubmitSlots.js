import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, FONTS } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import Feather from "react-native-vector-icons/Feather";
import { getFormatedDate } from "react-native-modern-datepicker";
import DatePickerModal from '../components/DatePickerModal';
import Button from '../components/Button';

const SubmitSlots = ({ navigation, route }) => {
  const { teacherId, fullName } = route.params || {};
  const selectedAddress = route.params?.selectedAddress;
  const [image, setImage] = useState(null);
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [showStartTimeDropdown, setShowStartTimeDropdown] = useState(false);
  const [showEndTimeDropdown, setShowEndTimeDropdown] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [location, setLocation] = useState("");

  const today = new Date();
  const formattedToday = getFormatedDate(today, "YYYY/MM/DD");
  const [selectedDate, setSelectedDate] = useState("");

  const timeOptions = Array.from({ length: 24 }, (_, index) => {
    const hour = index.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  useEffect(() => {
    if (selectedAddress) {
      setLocation(selectedAddress);
    }
  }, [selectedAddress]);

  useEffect(() => {
    if (selectedDate) {
      setSelectedStartTime("");
      setSelectedEndTime("");
      setLocation("");
    }
  }, [selectedDate]);

  const handleOnPressStartDate = () => {
    setOpenStartDatePicker(true);
  };

  const formatTime = (time) => {
    return time.substring(0, 5); 
  };

  const renderTimeDropdown = (showDropdown, setShowDropdown, selectedTime, setSelectedTime) => (
    <View style={styles.dropdownContainer}>
      {timeOptions.map((time, index) => (
        <TouchableOpacity
          key={index}
          style={styles.dropdownItem}
          onPress={() => {
            setSelectedTime(time);
            setShowDropdown(false);
          }}
        >
          <Text style={{ color: COLORS.black }}>
            {time}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <Header title="Sumbit Slots" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ alignItems: "center", marginVertical: 12 }}>
            <View style={styles.avatarContainer}>
              {image && (
                <Image
                  // source={{ uri: image }}
                  resizeMode="cover"
                  style={styles.avatar}
                />
              )}
              <Text style={styles.teacherName}>Yang Liu</Text>
            </View>
          </View>
          <View>
            <Text style={styles.Label}>Date:</Text>
            <View style={{ width: SIZES.width - 32 }}>
              <TouchableOpacity
                style={[styles.inputBtn, {
                  backgroundColor: COLORS.greyscale500,
                  borderColor: COLORS.greyscale500,
                }]}
                onPress={handleOnPressStartDate}
              >
                <Text style={{ ...FONTS.body4, color: COLORS.grayscale400 }}>{selectedDate ? selectedDate : "Select a date"}</Text>
                <Feather name="calendar" size={24} color={COLORS.grayscale400} />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: SIZES.width - 32 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.Label}>Start time:</Text>
                <TouchableOpacity
                  style={[styles.inputBtn, {
                    backgroundColor: COLORS.greyscale500,
                    borderColor: COLORS.greyscale500,
                  }]}
                  onPress={() => setShowStartTimeDropdown(!showStartTimeDropdown)}
                >
                  <Text style={{ ...FONTS.body4, color: COLORS.grayscale400 }}>{selectedStartTime || "Select start time"}</Text>
                  <Feather name="chevron-down" size={24} color={COLORS.grayscale400} />
                </TouchableOpacity>
                {showStartTimeDropdown && renderTimeDropdown(showStartTimeDropdown, setShowStartTimeDropdown, selectedStartTime, setSelectedStartTime)}
              </View>
              <View style={{ width: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.Label}>End time:</Text>
                <TouchableOpacity
                  style={[styles.inputBtn, {
                    backgroundColor: COLORS.greyscale500,
                    borderColor: COLORS.greyscale500,
                  }]}
                  onPress={() => setShowEndTimeDropdown(!showEndTimeDropdown)}
                >
                  <Text style={{ ...FONTS.body4, color: COLORS.grayscale400 }}>{selectedEndTime || "Select end time"}</Text>
                  <Feather name="chevron-down" size={24} color={COLORS.grayscale400} />
                </TouchableOpacity>
                {showEndTimeDropdown && renderTimeDropdown(showEndTimeDropdown, setShowEndTimeDropdown, selectedEndTime, setSelectedEndTime)}
              </View>
            </View>
            <Text style={styles.Label}>Location:</Text>
            <View style={{ width: SIZES.width - 32 }}>
              <TouchableOpacity
                style={styles.inputBtn}
                onPress={() => navigation.navigate('Address', { teacherId })}
              >
                <Text style={{ ...FONTS.body4, color: COLORS.grayscale400 }}>{location || "Select the location"}</Text>
                <Feather name="chevron-right" size={24} color={COLORS.grayscale400} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
      <DatePickerModal
        open={openStartDatePicker}
        startDate={formattedToday}
        selectedDate={selectedDate}
        onClose={() => setOpenStartDatePicker(false)}
        onChangeStartDate={(date) => {
          setSelectedDate(date);
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
  );
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
    marginVertical: 15,
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
    marginTop: -25, 
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
  },
  chevronIcon: {
    marginLeft: 10,
  }
});

export default SubmitSlots;