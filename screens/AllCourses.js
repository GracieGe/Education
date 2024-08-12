import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { COLORS } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import VerticalCourseCard from '../components/VerticalCourseCard';
import axios from 'axios';
import config from '../config';

const AllCourses = ({ navigation }) => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchCategories();
    fetchCourses();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/api/categories`);
      setCategories([{ categoryId: 'all', categoryName: 'All' }, ...response.data]);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchCourses = async (categoryId = 'all') => {
    try {
      const url = `${config.API_URL}/api/courses${categoryId !== 'all' ? `?categoryId=${categoryId}` : ''}`;
      const response = await axios.get(url);
      setCourses(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setLoading(false);
    }
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    fetchCourses(categoryId);
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={{
        backgroundColor: selectedCategory === item.categoryId ? COLORS.primary : "transparent",
        padding: 10,
        marginVertical: 5,
        borderColor: COLORS.primary,
        borderWidth: 1.3,
        borderRadius: 24,
        marginRight: 12,
        flex: 1,
        alignItems: 'center',
      }}
      onPress={() => handleCategorySelect(item.categoryId)}>
      <Text style={{
        color: selectedCategory === item.categoryId ? COLORS.white : COLORS.primary
      }}>{item.categoryName}</Text>
    </TouchableOpacity>
  );

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
              image={`${config.API_URL}/${item.image}`}
              onPress={() => navigation.navigate("CourseDetails", { courseId: item.courseId })}
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
          <FlatList
            data={categories}
            keyExtractor={item => item.categoryId.toString()}
            numColumns={3}
            renderItem={renderCategoryItem}
            scrollEnabled={false}
            contentContainerStyle={{ justifyContent: 'space-between' }}
          />
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