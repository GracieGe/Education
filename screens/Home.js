import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { COLORS, SIZES, icons, images } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import SubHeaderItem from '../components/SubHeaderItem';
import VerticalCourseCard from '../components/VerticalCourseCard';
import HorizontalTeacherProfile from '../components/HorizontalTeacherProfile';
import axios from 'axios';
import config from '../config';

const Home = ({ navigation }) => {
  const [courses, setCourses] = useState([]);
  const [teacherProfiles, setTeacherProfiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseCategory, setSelectedCourseCategory] = useState('all');
  const [selectedTeacherCategory, setSelectedTeacherCategory] = useState('all');

  useEffect(() => {
    fetchCategories();
    fetchCourses();
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

  const fetchCourses = async (categoryId = 'all') => {
    try {
      const url = `${config.API_URL}/api/courses${categoryId !== 'all' ? `?categoryId=${categoryId}` : ''}`;
      console.log('Fetching courses with URL:', url);
      const response = await axios.get(url);
      console.log('Courses fetched:', response.data);
      setCourses(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setLoading(false);
    }
  };

  const fetchTeachers = async (categoryId = 'all') => {
    try {
      setLoading(true);
      const url = `${config.API_URL}/api/teachers/signed${categoryId !== 'all' ? `?categoryId=${categoryId}` : ''}`;
      const response = await axios.get(url);
      setTeacherProfiles(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setLoading(false);
    }
  };

  const handleCourseCategorySelect = (categoryId) => {
    setSelectedCourseCategory(categoryId);
    fetchCourses(categoryId);
  };

  const handleTeacherCategorySelect = (categoryId) => {
    setSelectedTeacherCategory(categoryId);
    fetchTeachers(categoryId);
  };

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.viewLeft}>
          <Image
            source={images.user1}
            resizeMode='contain'
            style={styles.userIcon}
          />
          <View style={styles.viewNameContainer}>
            <Text style={[styles.title, { color: COLORS.greyscale900 }]}>Welcome!</Text>
          </View>
        </View>
        <View style={styles.viewRight}>
          <TouchableOpacity onPress={() => navigation.navigate("Favourite")}>
            <Image
              source={icons.heartOutline}
              resizeMode='contain'
              style={[styles.bookmarkIcon, { tintColor: COLORS.greyscale900 }]}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderSearchBar = () => {
    const handleInputFocus = () => {
      navigation.navigate('Search');
    };

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("Search")}
        style={[styles.searchBarContainer, { backgroundColor: COLORS.secondaryWhite }]}>
        <TouchableOpacity>
          <Image
            source={icons.search2}
            resizeMode='contain'
            style={styles.searchIcon}
          />
        </TouchableOpacity>
        <TextInput
          placeholder='Search'
          placeholderTextColor={COLORS.gray}
          style={styles.searchInput}
          onFocus={handleInputFocus}
        />
      </TouchableOpacity>
    );
  };

  const renderCourseCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={{
        backgroundColor: selectedCourseCategory === item.categoryId ? COLORS.primary : "transparent",
        padding: 10,
        marginVertical: 5,
        borderColor: COLORS.primary,
        borderWidth: 1.3,
        borderRadius: 24,
        marginRight: 12,
        flex: 1,
        alignItems: 'center',
      }}
      onPress={() => handleCourseCategorySelect(item.categoryId)}>
      <Text style={{
        color: selectedCourseCategory === item.categoryId ? COLORS.white : COLORS.primary
      }}>{item.categoryName}</Text>
    </TouchableOpacity>
  );

  const renderTeacherCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={{
        backgroundColor: selectedTeacherCategory === item.categoryId ? COLORS.primary : "transparent",
        padding: 10,
        marginVertical: 5,
        borderColor: COLORS.primary,
        borderWidth: 1.3,
        borderRadius: 24,
        marginRight: 12,
        flex: 1,
        alignItems: 'center',
      }}
      onPress={() => handleTeacherCategorySelect(item.categoryId)}>
      <Text style={{
        color: selectedTeacherCategory === item.categoryId ? COLORS.white : COLORS.primary
      }}>{item.categoryName}</Text>
    </TouchableOpacity>
  );

  const renderCourses = () => {
    if (loading) {
      return <Text>Loading...</Text>;
    }

    const displayedCourses = courses.slice(0, 6);

    return (
      <View>
        <SubHeaderItem
          title="Courses For You"
          navTitle="See all"
          onPress={() => navigation.navigate("AllCourses")}
        />
        <FlatList
          data={categories}
          keyExtractor={item => item.categoryId.toString()}
          numColumns={3}
          renderItem={renderCourseCategoryItem}
          scrollEnabled={false}
        />
        <View style={{ backgroundColor: COLORS.secondaryWhite, marginVertical: 16 }}>
          <FlatList
            data={displayedCourses}
            keyExtractor={item => item.courseId.toString()}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
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
      </View>
    )
  };

  const renderTeacherProfiles = () => {
    if (loading) {
      return <Text>Loading...</Text>;
    }

    const displayedCourses = teacherProfiles.slice(0, 6);

    return (
      <View>
        <SubHeaderItem
          title="Teacher Profiles"
          navTitle="See all"
          onPress={() => navigation.navigate("AllTeacherProfiles")}
        />
        <FlatList
          data={categories}
          keyExtractor={item => item.categoryId.toString()}
          numColumns={3}
          renderItem={renderTeacherCategoryItem}
          scrollEnabled={false}
        />
        <View style={{ backgroundColor: COLORS.secondaryWhite, marginVertical: 16 }}>
          <FlatList
            data={displayedCourses}
            keyExtractor={item => item.teacherId.toString()}
            numColumns={1}
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
      </View>
    )
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        {renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderSearchBar()}
          {renderCourses()}
          {renderTeacherProfiles()}
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
  headerContainer: {
    flexDirection: "row",
    width: SIZES.width - 32,
    justifyContent: "space-between",
    alignItems: "center"
  },
  userIcon: {
    width: 48,
    height: 48,
    borderRadius: 32
  },
  viewLeft: {
    flexDirection: "row",
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900
  },
  viewNameContainer: {
    marginLeft: 12
  },
  viewRight: {
    flexDirection: "row",
    alignItems: 'center'
  },
  bellIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
    marginRight: 8
  },
  bookmarkIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black
  },
  searchBarContainer: {
    width: SIZES.width - 32,
    backgroundColor: COLORS.secondaryWhite,
    padding: 16,
    borderRadius: 12,
    height: 52,
    marginVertical: 16,
    flexDirection: "row",
    alignItems: 'center'
  },
  searchIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.gray
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Urbanist Regular",
    marginHorizontal: 8
  },
})

export default Home;