import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { SIZES, COLORS } from '../constants';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CancelledSessions = () => {
  const [sessions, setSessions] = useState([]);

  const fetchCancelledSessions = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${config.API_URL}/api/sessions/cancelledSessions`, {
        headers: {
          'x-auth-token': token,
        },
      });

      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching cancelled sessions:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCancelledSessions();
    }, [])
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const formatTime = (time) => {
    return time.substring(0, 5);
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No cancelled sessions currently.</Text>
    </View>
  );

  return (
    <View style={[styles.container, {
      backgroundColor: COLORS.tertiaryWhite
    }]}>
      <FlatList
        data={sessions}
        keyExtractor={item => item.sessionId.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.cardContainer, {
            backgroundColor: COLORS.white,
          }]}>
            <View style={styles.detailsContainer}>
              <View>
                <Image
                  source={{ uri: `${config.API_URL}/${item.image}` }}
                  resizeMode='cover'
                  style={styles.serviceImage}
                />
              </View>
              <View style={styles.detailsRightContainer}>
                <Text style={[styles.name, {
                  color: COLORS.greyscale900
                }]}>{item.courseName}</Text>
                <Text style={[styles.grade, {
                  color: COLORS.grayscale700,
                }]}>{item.grade}</Text>
                <View style={styles.teacherContainer}>
                  <View style={styles.teacherItemContainer}>
                    <Text style={styles.teacher}>Teacher: {item.fullName}</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.additionalContainer}>
              <Text style={[styles.grade, {
                color: COLORS.grayscale700,
              }]}>Time: {formatDate(item.date)}  {formatTime(item.startTime)} - {formatTime(item.endTime)}</Text>
              <Text style={[styles.grade, {
                color: COLORS.grayscale700,
              }]}>Location: {item.location}</Text>
            </View>
            <View style={[styles.separateLine, {
              marginVertical: 10,
              backgroundColor: COLORS.grayscale200,
            }]} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={renderEmptyComponent}
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
    fontSize: 13,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.grayscale700,
  },
})

export default CancelledSessions