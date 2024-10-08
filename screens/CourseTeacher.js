import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { SIZES, COLORS, images } from '../constants';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import config from '../config'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const CourseTeacher = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get(`${config.API_URL}/api/teachers/myCourses`, {
          headers: {
            'x-auth-token': token,
          },
        });
        
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        Alert.alert('Error', 'Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const renderHeader = () => {
    return (
      <TouchableOpacity style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Image
            source={images.logo}
            resizeMode='contain'
            style={styles.logo}
          />
          <Text style={[styles.headerTitle, { color: COLORS.greyscale900 }]}>My Courses</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No courses found.</Text>
    </View>
  );

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={[styles.cardContainer, { backgroundColor: COLORS.white }]}>
        <View style={styles.detailsContainer}>
          <Image
            source={{ uri: `${config.API_URL}/${item.image}` }}
            resizeMode='cover'
            style={styles.courseImage}
          />
          <View style={styles.detailsRightContainer}>
            <Text style={[styles.name, { color: COLORS.greyscale900 }]}>{item.courseName}</Text>
            <Text style={[styles.grade, { color: COLORS.grayscale700 }]}>{item.grade}</Text>
          </View>
        </View>
        <View style={[styles.separateLine, { marginVertical: 10, backgroundColor: COLORS.grayscale200 }]} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("SubmitSlots")}
            style={styles.selectBtn}>
            <Text style={styles.selectBtnText}>Submit Slots</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("ViewSlots")}
            style={styles.bookingBtn}>
            <Text style={styles.bookingBtnText}>View Slots</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading courses...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.area}>
      <View style={styles.container}>
        {renderHeader()}
        <FlatList
          data={courses}
          keyExtractor={item => item.courseId.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyComponent}
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
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
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
  name: {
    fontSize: 17,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900,
  },
  grade: {
    fontSize: 12,
    fontFamily: "Urbanist Regular",
    color: COLORS.grayscale700,
    marginVertical: 6,
  },
  selectBtn: {
    width: (SIZES.width - 32) / 2 - 20,
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
    width: (SIZES.width - 32) / 2 - 16,
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
    justifyContent: "space-between",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CourseTeacher;