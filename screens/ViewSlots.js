import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { SIZES, COLORS, images } from '../constants';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import axios from 'axios';
import config from '../config'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const ViewSlots = () => {
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get(`${config.API_URL}/api/slots/teacherSlots`, {
          headers: {
            'x-auth-token': token,
          },
        });

      const sortedSlots = response.data.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        if (dateA - dateB !== 0) {
          return dateB - dateA;  
        }

        const timeA = a.startTime.split(':').join('');
        const timeB = b.startTime.split(':').join('');
        
        return timeB - timeA; 
      });

      setSlots(sortedSlots);
      } catch (error) {
        console.error('Error fetching slots:', error);
        setError('Error fetching slots');
      }
    };

    fetchSlots();
  }, []);

  const renderItem = ({ item }) => {
    const formattedDate = new Date(item.date).toISOString().split('T')[0];

    const formatTime = (time) => time.substring(0, 5);
    const formattedTime = `${formatTime(item.startTime)} - ${formatTime(item.endTime)}`;

    const buttonStyle = item.status === 'Unbooked' ? styles.selectBtn : styles.bookingBtn;
    const buttonTextStyle = item.status === 'Unbooked' ? styles.selectBtnText : styles.bookingBtnText;

    return (
      <TouchableOpacity style={[styles.cardContainer, { backgroundColor: COLORS.white }]}>
        <View style={styles.detailsContainer}>
          <Image
            source={{ uri: `${config.API_URL}/${item.image}` }}
            resizeMode='cover'
            style={styles.courseImage}
          />
          <View style={styles.detailsRightContainer}>
            <Text style={[styles.grade, { color: COLORS.greyscale900 }]}>Date: {formattedDate}</Text>
            <Text style={[styles.grade, { color: COLORS.greyscale900 }]}>Time: {formattedTime}</Text>
            <Text style={[styles.grade, { color: COLORS.greyscale900 }]}>Location: {item.location}</Text>
          </View>
        </View>
        <View style={[styles.separateLine, { marginVertical: 10, backgroundColor: COLORS.grayscale200 }]} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={buttonStyle}>
            <Text style={buttonTextStyle}>{item.status}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <Header title="View Slots" />
        <FlatList
          data={slots} 
          keyExtractor={(item) => item.slotId.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem} 
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
  courseImage: {
    width: 88,
    height: 88,
    borderRadius: 16,
    marginHorizontal: 12,
  },
  detailsRightContainer: {
    flex: 1,
    marginLeft: 12,
  },
  grade: {
    fontSize: 12,
    fontFamily: "Urbanist Regular",
    color: COLORS.grayscale700,
    marginVertical: 6,
  },
  selectBtn: {
    width: (SIZES.width - 32) / 2 - 50,
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
  selectBtnText: {
    fontSize: 16,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.primary,
  },
  bookingBtn: {
    width: (SIZES.width - 32) / 2 - 50,
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
  bookingBtnText: {
    fontSize: 16,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.white,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ViewSlots;