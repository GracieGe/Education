import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { COLORS } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import HorizontalTeacherProfile from '../components/HorizontalTeacherProfile';
import axios from 'axios';
import config from '../config';

const SelectTeachers = ({ navigation }) => {
  const [teachers, setTeachers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchCategories();
    fetchTeachers();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/api/categories`);
      setCategories([{ categoryId: 'all', categoryName: 'All' }, ...response.data]);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTeachers = async (categoryId = 'all') => {
    try {
      const url = `${config.API_URL}/api/teachers/signed${categoryId !== 'all' ? `?categoryId=${categoryId}` : ''}`;
      console.log('Fetching teachers with URL:', url);
      const response = await axios.get(url);
      console.log('Teachers fetched:', response.data);
      setTeachers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setLoading(false);
    }
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    fetchTeachers(categoryId);
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

  const renderTeachers = () => {
    return (
      <View style={{ backgroundColor: COLORS.secondaryWhite, marginVertical: 16 }}>
        <FlatList
          data={teachers}
          keyExtractor={item => item.teacherId.toString()}
          numColumns={1}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <HorizontalTeacherProfile
              fullName={item.fullName}
              photo={`${config.API_URL}/${item.photo}`}
              courseName={item.courseName}
              grade={item.grade}
              rating={item.rating}
              numReviews={item.numReviews}
              onPress={() => navigation.navigate("TeacherDetails", { teacherId: item.teacherId })}
            />
          )}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <Header title="All Teacher Profiles" />
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          <FlatList
            data={categories}
            keyExtractor={item => item.categoryId.toString()}
            numColumns={3}
            renderItem={renderCategoryItem}
            scrollEnabled={false}
            contentContainerStyle={{ justifyContent: 'space-between' }}
          />
          {loading ? <Text>Loading...</Text> : renderTeachers()}
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
})

export default SelectTeachers