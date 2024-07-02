import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import React, { useState } from 'react';
import { COLORS } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import { categories, allCourses } from '../data';
import VerticalFoodCard from '../components/VerticalCourseCard';

const AllCourses = ({ navigation }) => {
  const [selectedCategories, setSelectedCategories] = useState(["1"]); // Example default selected category

  const filteredCourses = allCourses.filter(courses => 
    selectedCategories.includes("1") || selectedCategories.includes(courses.categoryId)
  );

  const toggleCategory = (categoryId) => {
    const updatedCategories = [...selectedCategories];
    const index = updatedCategories.indexOf(categoryId);

    if (index === -1) {
      updatedCategories.push(categoryId);
    } else {
      updatedCategories.splice(index, 1);
    }

    setSelectedCategories(updatedCategories);
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={{
        backgroundColor: selectedCategories.includes(item.id) ? COLORS.primary : "transparent",
        padding: 10,
        marginVertical: 5,
        borderColor: COLORS.primary,
        borderWidth: 1.3,
        borderRadius: 24,
        marginRight: 12,
        flex: 1,
        alignItems: 'center',
      }}
      onPress={() => toggleCategory(item.id)}>
      <Text style={{ color: selectedCategories.includes(item.id) ? COLORS.white : COLORS.primary }}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <Header title="All courses" />
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          <FlatList
            data={categories}
            keyExtractor={item => item.id}
            numColumns={3}
            renderItem={renderCategoryItem}
            scrollEnabled={false}
            contentContainerStyle={{ justifyContent: 'space-between' }}
          />
          <View style={{ backgroundColor: COLORS.secondaryWhite, marginVertical: 16 }}>
            <FlatList
              data={filteredCourses}
              keyExtractor={item => item.id}
              numColumns={2}
              columnWrapperStyle={{ gap: 16 }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                return (
                  <VerticalFoodCard
                    name={item.name}
                    image={item.image}
                    grade={item.grade}
                    price={item.price}
                    rating={item.rating}
                    numReviews={item.numReviews}
                    onPress={() => navigation.navigate("FoodDetails")}
                  />
                )
              }}
            />
          </View>
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

export default AllCourses