import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, FONTS } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import Feather from "react-native-vector-icons/Feather";
import { getFormatedDate } from "react-native-modern-datepicker";
import DatePickerModal from '../components/DatePickerModal';
import Button from '../components/Button';
import axios from 'axios';
import config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BookSlots = ({ navigation, route }) => {
  const { teacherId, fullName } = route.params || {};
  const selectedAddress = route.params?.selectedAddress;
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [showSlotsDropdown, setShowSlotsDropdown] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [slots, setSlots] = useState([]);
  const [location, setLocation] = useState("");

  const today = new Date();
  const formattedToday = getFormatedDate(today, "YYYY/MM/DD");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    if (!teacherId) {
      setError('No teacher selected. Please select a teacher first.');
      return;
    }

    const fetchTeacherDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const response = await axios.get(`${config.API_URL}/api/teachers/${teacherId}`, {
          headers: {
            'x-auth-token': token,
          },
        });
        const teacher = response.data;
        setImage(`${config.API_URL}/${teacher.photo}`);
      } catch (error) {
        setError('Error fetching teacher details');
      }
    };

    fetchTeacherDetails();
  }, [teacherId]);

  useEffect(() => {
    if (selectedAddress) {
      setLocation(selectedAddress);
    }
  }, [selectedAddress]);

  useEffect(() => {
    if (selectedDate) {
      setSelectedSlot("");
      setLocation("");
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async (date) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${config.API_URL}/api/slots/availableSlots`, {
        headers: {
          'x-auth-token': token,
        },
        params: {
          teacherId,
          date: date.replace(/\//g, '-') 
        }
      });
      setSlots(response.data);
    } catch (error) {
      setError('Error fetching available slots');
    }
  };

  const handleOnPressStartDate = () => {
    setOpenStartDatePicker(true);
  };

  const formatTime = (time) => {
    return time.substring(0, 5); 
  };

  const renderSlotsDropdown = () => (
    <View style={styles.dropdownContainer}>
      {slots.length === 0 ? (
        <Text style={{ color: COLORS.black, padding: 10 }}>No available slots.</Text>
      ) : (
        slots.map((slot, index) => (
          <TouchableOpacity
            key={index}
            style={styles.dropdownItem}
            onPress={() => {
              setSelectedSlot(`${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`);
              setSelectedSlotId(slot.slotId);
              setLocation(slot.location);
              setShowSlotsDropdown(false);
            }}
          >
            <Text style={{ color: COLORS.black }}>
              {`${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`}
            </Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      // Update slots with new location
      const updateSlotResponse = await axios.post(`${config.API_URL}/api/slots/updateSlot`, {
        slotId: selectedSlotId,
        newLocation: location,
      }, {
        headers: {
          'x-auth-token': token,
        },
      });

      if (updateSlotResponse.status === 200) {
        // Obtain studentId
        const userResponse = await axios.get(`${config.API_URL}/api/students/studentId`, {
          headers: {
            'x-auth-token': token,
          },
        });

        if (userResponse.status === 200) {
          const { studentId } = userResponse.data;

          // Insert into sessions
          const addSessionResponse = await axios.post(`${config.API_URL}/api/sessions/addSession`, {
            slotId: selectedSlotId,
            teacherId,
            studentId,
            location,
            date: selectedDate,
            startTime: selectedSlot.split(' - ')[0],
            endTime: selectedSlot.split(' - ')[1],
          }, {
            headers: {
              'x-auth-token': token,
            },
          });

          if (addSessionResponse.status === 201) {
            Alert.alert('Congratulations', 'You booked the slot successfully!');
            navigation.goBack();
          } else {
            throw new Error('Failed to add session');
          }
        } else {
          throw new Error('Failed to get student ID');
        }
      } else {
        throw new Error('Failed to update slot');
      }
    } catch (error) {
      console.error('Error booking slot:', error);
      Alert.alert('Error', 'Failed to book slot and add session');
    }
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <Header title="Book Slots" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ alignItems: "center", marginVertical: 12 }}>
            <View style={styles.avatarContainer}>
              {image && (
                <Image
                  source={{ uri: image }}
                  resizeMode="cover"
                  style={styles.avatar}
                  testID="avatar"
                />
              )}
              <Text style={styles.teacherName}>{fullName}</Text>
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
            {showSlotsDropdown && renderSlotsDropdown()}
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
          onPress={handleSubmit}
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

export default BookSlots;