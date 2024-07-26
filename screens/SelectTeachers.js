import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import HorizontalTeacherProfileWithSelection from '../components/HorizontalTeacherProfileWithSelection';
import axios from 'axios';
import config from '../config';

const SelectTeachers = ({ navigation, route }) => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { courseId } = route.params;

  useEffect(() => {
    fetchTeachers();
  }, [courseId]);

  const fetchTeachers = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); 
      const url = `${config.API_URL}/api/teachers/byCourse?courseId=${courseId}`;
      console.log('Fetching teachers with URL:', url);
      const response = await axios.get(url, {
        headers: {
          'x-auth-token': token, 
        },
      });
      console.log('Teachers fetched:', response.data);
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const renderTeachers = () => (
    <View style={{ backgroundColor: COLORS.secondaryWhite, marginVertical: 16 }}>
      <FlatList
        data={teachers}
        keyExtractor={item => item.teacherId.toString()}
        numColumns={1}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <HorizontalTeacherProfileWithSelection
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

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <Header title="Select Teacher" />
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          {loading && <Text>Loading...</Text>}
          {error && <Text>Error fetching teachers: {error.message}</Text>}
          {!loading && !error && renderTeachers()}
        </ScrollView>
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
    backgroundColor: COLORS.white,
    padding: 16
  },
  scrollView: {
    marginVertical: 16
  }
});

export default SelectTeachers;