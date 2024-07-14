import { View, StyleSheet, FlatList, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import { COLORS } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import VerticalCourseCard from '../components/VerticalCourseCard';
import axios from 'axios';

const AllCourses = ({ navigation }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:5001/api/courses');
      setCourses(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setLoading(false);
    }
  };

  const renderCourses = () => {
    return (
      <View style={{ backgroundColor: COLORS.secondaryWhite, marginVertical: 16 }}>
        <FlatList
          data={courses}
          keyExtractor={item => item.courseId.toString()}
          numColumns={2}
          columnWrapperStyle={{ gap: 16 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <VerticalCourseCard
              courseName={item.courseName}
              grade={item.grade}
              price={item.price}
              rating={item.rating}
              numReviews={item.numReviews}
              onPress={() => navigation.navigate("CourseDetails")}
            />
          )}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <Header title="All Courses" />
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          {loading ? <Text>Loading...</Text> : renderCourses()}
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
    marginVertical: 16
  }
});

export default AllCourses;