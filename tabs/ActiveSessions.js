import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { SIZES, COLORS } from '../constants';
import RBSheet from "react-native-raw-bottom-sheet";
import Button from '../components/Button';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ActiveSessions = () => {
  const [sessions, setSessions] = useState([]);
  const refRBSheet = useRef();

  const fetchActiveSessions = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${config.API_URL}/api/sessions/activeSessions`, {
        headers: {
          'x-auth-token': token,
        },
      });

      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching active sessions:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchActiveSessions();
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
      <Text style={styles.emptyText}>No sessions booked.</Text>
    </View>
  );

  const [sheetContent, setSheetContent] = useState(null);

  const renderCancelContent = () => (
    <>
      <Text style={[styles.bottomSubtitle, { color: COLORS.red }]}>Cancel Session</Text>
      <View style={[styles.separateLine, { backgroundColor: COLORS.grayscale200 }]} />
      <View style={styles.selectedCancelContainer}>
        <Text style={[styles.cancelTitle, { color: COLORS.greyscale900 }]}>Are you sure you want to cancel your session?</Text>
        <Text style={[styles.cancelSubtitle, { color: COLORS.grayscale700 }]}>The cancelled hours will be returned to your remaining hours according to our policy.</Text>
      </View>
      <View style={styles.bottomContainer}>
        <Button
          title="Cancel"
          style={{
            width: (SIZES.width - 32) / 2 - 8,
            backgroundColor: COLORS.tansparentPrimary,
            borderRadius: 32,
            borderColor: COLORS.tansparentPrimary
          }}
          textColor={COLORS.primary}
          onPress={() => refRBSheet.current.close()}
        />
        <Button
          title="Yes, Cancel"
          filled
          style={styles.removeButton}
          onPress={() => {
            refRBSheet.current.close();
          }}
        />
      </View>
    </>
  );
  
  const renderCompletionContent = () => (
    <>
      <Text style={[styles.bottomSubtitle, { color: COLORS.primary }]}>Confirm Completion</Text>
      <View style={[styles.separateLine, { backgroundColor: COLORS.grayscale200 }]} />
      <View style={styles.selectedCancelContainer}>
        <Text style={[styles.cancelTitle, { color: COLORS.greyscale900 }]}>Are you sure you want to confirm completion of your session?</Text>
      </View>
      <View style={styles.bottomContainer}>
        <Button
          title="Cancel"
          style={{
            width: (SIZES.width - 32) / 2 - 8,
            backgroundColor: COLORS.tansparentPrimary,
            borderRadius: 32,
            borderColor: COLORS.tansparentPrimary
          }}
          textColor={COLORS.primary}
          onPress={() => refRBSheet.current.close()}
        />
        <Button
          title="Yes, Confirm"
          filled
          style={styles.removeButton}
          onPress={() => {
            refRBSheet.current.close();
          }}
        />
      </View>
    </>
  );

  return (
    <View style={[styles.container, {
      backgroundColor: COLORS.tertiaryWhite
    }]}>
      <FlatList
        data={sessions}
        keyExtractor={item => item.slotId.toString()} 
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
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => {
                  setSheetContent(renderCancelContent());
                  refRBSheet.current.open();
                }}
                style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {}}
                style={styles.recordBtn}>
                <Text style={styles.recordBtnText}>Record</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSheetContent(renderCompletionContent());
                  refRBSheet.current.open();
                }}
                style={styles.completionBtn}>
                <Text style={styles.completionBtnText}>Confirm Completion</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={renderEmptyComponent}
      />
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        height={332}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
          draggableIcon: {
            backgroundColor: COLORS.greyscale300,
          },
          container: {
            borderTopRightRadius: 32,
            borderTopLeftRadius: 32,
            height: 332,
            backgroundColor: COLORS.white,
            alignItems: "center",
            width: "100%"
          }
        }}>
        {sheetContent}
      </RBSheet>
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
  cancelBtn: {
    width: (SIZES.width - 32) / 2 - 100,
    height: 36,
    borderRadius: 24,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    borderColor: COLORS.primary,
    borderWidth: 1.4,
    marginBottom: 12
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
    marginBottom: 12
  },
  completionBtnText: {
    fontSize: 16,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.white,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
    paddingHorizontal: 16,
    width: "100%"
  },
  removeButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.primary,
    borderRadius: 32
  },
  bottomSubtitle: {
    fontSize: 22,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900,
    textAlign: "center",
    marginVertical: 12
  },
  selectedCancelContainer: {
    marginVertical: 24,
    paddingHorizontal: 36,
    width: "100%"
  },
  cancelTitle: {
    fontSize: 18,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.greyscale900,
    textAlign: "center",
  },
  cancelSubtitle: {
    fontSize: 14,
    fontFamily: "Urbanist Regular",
    color: COLORS.grayscale700,
    textAlign: "center",
    marginVertical: 8,
    marginTop: 16
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
  recordBtn: {
    width: (SIZES.width - 32) / 2 - 100,
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
  recordBtnText: {
    fontSize: 16,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.white,
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
});

export default ActiveSessions;