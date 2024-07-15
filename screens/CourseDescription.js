import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { COLORS, SIZES } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import axios from 'axios';
import config from '../config';

const CourseDescription = ({ route }) => {
  const { courseId } = route.params; 
  const [expanded, setExpanded] = useState(false);
  const [courseData, setCourseData] = useState({ courseName: '', grade: '', description: '' });

  useEffect(() => {
    const fetchCourseDescription = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/api/courses/${courseId}`);
        setCourseData(response.data);
      } catch (error) {
        console.error('Error fetching course description:', error);
      }
    };

    fetchCourseDescription();
  }, [courseId]);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <Header title={`${courseData.courseName} | ${courseData.grade}`} />
        <ScrollView
          contentContainerStyle={{ marginVertical: 16 }}
          showsVerticalScrollIndicator={false}>
          <Text style={[styles.viewSubtitle, {
            color: COLORS.greyscale900,
          }]}>Overview</Text>
          <Text style={[styles.description, {
            color: COLORS.grayscale700,
          }]}> 
          {courseData.description ? 
              (expanded ? courseData.description : `${courseData.description.slice(0, 100)}...`) : 
              "No description available."
            }
          </Text>
          <TouchableOpacity onPress={toggleExpanded}>
            <Text style={styles.viewBtn}>
              {expanded ? 'View Less' : 'View More'}
            </Text>
          </TouchableOpacity>
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
  viewSubtitle: {
    fontSize: 22,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900,
    marginVertical: 12
  },
  description: {
    fontSize: 14, 
    color: COLORS.grayscale700,
    fontFamily: "Urbanist Regular",
    lineHeight: 20, 
    width: SIZES.width - 32
  },
  viewBtn: {
    color: COLORS.primary,
    marginTop: 5,
    fontSize: 14,
    fontFamily: "Urbanist SemiBold",
  },
})

export default CourseDescription