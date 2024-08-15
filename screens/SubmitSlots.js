import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image, TouchableOpacity, Modal } from 'react-native';
import { COLORS, SIZES, FONTS } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import Feather from "react-native-vector-icons/Feather";
import { getFormatedDate } from "react-native-modern-datepicker";
import DatePickerModal from '../components/DatePickerModal';
import Button from '../components/Button';
import { Picker } from '@react-native-picker/picker';

const SubmitSlots = ({ navigation, route }) => {
  const { teacherId, fullName } = route.params || {};
  const selectedAddress = route.params?.selectedAddress;
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [selectedStartHour, setSelectedStartHour] = useState("00");
  const [selectedStartMinute, setSelectedStartMinute] = useState("00");
  const [selectedEndHour, setSelectedEndHour] = useState("00");
  const [selectedEndMinute, setSelectedEndMinute] = useState("00");
  const [location, setLocation] = useState("");

  const today = new Date();
  const formattedToday = getFormatedDate(today, "YYYY/MM/DD");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    if (selectedAddress) {
      setLocation(selectedAddress);
    }
  }, [selectedAddress]);

  useEffect(() => {
    if (selectedDate) {
      setSelectedStartHour("");
      setSelectedStartMinute("");
      setSelectedEndHour("");
      setSelectedEndMinute("");
      setLocation("");
    }
  }, [selectedDate]);

  const handleOnPressStartDate = () => {
    setOpenStartDatePicker(true);
  };

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const handleConfirmStartTime = () => {
    setShowStartTimePicker(false);
  };

  const handleConfirmEndTime = () => {
    setShowEndTimePicker(false);
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <Header title="Submit Slots" />
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
                  onPress={() => setShowStartTimePicker(true)}
                >
                  <Text style={{ ...FONTS.body4, color: COLORS.grayscale400 }}>
                    {`${selectedStartHour}:${selectedStartMinute}`}
                  </Text>
                  <Feather name="clock" size={24} color={COLORS.grayscale400} />
                </TouchableOpacity>
              </View>
              <View style={{ width: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.Label}>End time:</Text>
                <TouchableOpacity
                  style={[styles.inputBtn, {
                    backgroundColor: COLORS.greyscale500,
                    borderColor: COLORS.greyscale500,
                  }]}
                  onPress={() => setShowEndTimePicker(true)}
                >
                  <Text style={{ ...FONTS.body4, color: COLORS.grayscale400 }}>
                    {`${selectedEndHour}:${selectedEndMinute}`}
                  </Text>
                  <Feather name="clock" size={24} color={COLORS.grayscale400} />
                </TouchableOpacity>
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
      {/* Start Time Picker Modal */}
      <Modal
        visible={showStartTimePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowStartTimePicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedStartHour}
              onValueChange={(itemValue) => setSelectedStartHour(itemValue)}
              style={styles.picker}
            >
              {hours.map((hour) => (
                <Picker.Item key={hour} label={hour} value={hour} />
              ))}
            </Picker>
            <Text style={styles.colon}>:</Text>
            <Picker
              selectedValue={selectedStartMinute}
              onValueChange={(itemValue) => setSelectedStartMinute(itemValue)}
              style={styles.picker}
            >
              {minutes.map((minute) => (
                <Picker.Item key={minute} label={minute} value={minute} />
              ))}
            </Picker>
            <Button title="Confirm" onPress={handleConfirmStartTime} />
          </View>
        </View>
      </Modal>
      {/* End Time Picker Modal */}
      <Modal
        visible={showEndTimePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEndTimePicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedEndHour}
              onValueChange={(itemValue) => setSelectedEndHour(itemValue)}
              style={styles.picker}
            >
              {hours.map((hour) => (
                <Picker.Item key={hour} label={hour} value={hour} />
              ))}
            </Picker>
            <Text style={styles.colon}>:</Text>
            <Picker
              selectedValue={selectedEndMinute}
              onValueChange={(itemValue) => setSelectedEndMinute(itemValue)}
              style={styles.picker}
            >
              {minutes.map((minute) => (
                <Picker.Item key={minute} label={minute} value={minute} />
              ))}
            </Picker>
            <Button title="Confirm" onPress={handleConfirmEndTime} />
          </View>
        </View>
      </Modal>
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
    marginVertical: 10,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  picker: {
    width: 100,
    height: 50,
  },
  colon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SubmitSlots;