import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, FlatList } from 'react-native'
import React, { useState } from 'react'
import { COLORS, SIZES, icons, images } from '../constants';
import { banners, categories, allCourses, teacherProfiles } from '../data';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import SubHeaderItem from '../components/SubHeaderItem';
import VerticalCourseCard from '../components/VerticalCourseCard';
import HorizontalTeacherProfile from '../components/HorizontalTeacherProfile';

const Home = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  /**
  * render header
  */
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
            <Text style={[styles.title, {
              color: COLORS.greyscale900
            }]}>Andrew Ainsley</Text>
          </View>
        </View>
        <View style={styles.viewRight}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Notifications")}>
            <Image
              source={icons.notificationBell2}
              resizeMode='contain'
              style={[styles.bellIcon, { tintColor: COLORS.greyscale900 }]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Favourite")}>
            <Image
              source={icons.heartOutline}
              resizeMode='contain'
              style={[styles.bookmarkIcon, { tintColor: COLORS.greyscale900 }]}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  /**
  * Render search bar
  */
  const renderSearchBar = () => {

    const handleInputFocus = () => {
      // Redirect to another screen
      navigation.navigate('Search');
    };

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("Search")}
        style={[styles.searchBarContainer, {
          backgroundColor: COLORS.secondaryWhite
        }]}>
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
    )
  }

  const renderBannerItem = ({ item }) => (
    <View style={styles.bannerContainer}>
      <View style={styles.bannerTopContainer}>
        <View>
          <Text style={styles.bannerCompanyName}>{item.companyName}</Text>
          <Text ></Text>
        </View>

      </View>
      <View style={styles.bannerBottomContainer}>
        <Text style={styles.bannerEmail}>{item.email}</Text>
        <Text style={styles.bannerAddress}>{item.address}</Text>
      </View>
    </View>
  );

  const keyExtractor = (item) => item.id.toString();

  const handleEndReached = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const renderDot = (index) => {
    return (
      <View
        style={[styles.dot, index === currentIndex ? styles.activeDot : null]}
        key={index}
      />
    );
  };

  /**
* Render banner
*/
  const renderBanner = () => {
    return (
      <View style={styles.bannerItemContainer}>
        <FlatList
          data={banners}
          renderItem={renderBannerItem}
          keyExtractor={keyExtractor}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.round(
              event.nativeEvent.contentOffset.x / SIZES.width
            );
            setCurrentIndex(newIndex);
          }}
        />
        <View style={styles.dotContainer}>
          {banners.map((_, index) => renderDot(index))}
        </View>
      </View>
    )
  }

  /**
   * render courses
   */
  const renderCourses = () => {
    const [selectedCategories, setSelectedCategories] = useState(["1"]);

    // only show 6 results
    const filteredCourses = allCourses.filter(courses => selectedCategories.includes("1") || selectedCategories.includes(courses.categoryId)).slice(0, 6);

    // Category item
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
        <Text style={{
          color: selectedCategories.includes(item.id) ? COLORS.white : COLORS.primary
        }}>{item.name}</Text>
      </TouchableOpacity>
    );

    // Toggle category selection
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

    return (
      <View>
        <SubHeaderItem
          title="Courses For You"
          navTitle="See all"
          onPress={() => navigation.navigate("AllCourses")}
        />
        <FlatList
        data={categories}
        keyExtractor={item => item.id}
        numColumns={3} 
        renderItem={renderCategoryItem}
        scrollEnabled={false} 
        contentContainerStyle={{ justifyContent: 'space-between' }} 
      />
        <View style={{
          backgroundColor: COLORS.secondaryWhite,
          marginVertical: 16
        }}>
          <FlatList
            data={filteredCourses}
            keyExtractor={item => item.id}
            numColumns={2}
            renderItem={({ item }) => {
              return (
                <VerticalCourseCard
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
      </View>
    )
  }

  /**
   * render teacher profiles
   */
  const renderTeacherProfiles = () => {
    const [selectedCategories, setSelectedCategories] = useState(["1"]);

    // only show 6 results
    const filteredTeachers = teacherProfiles.filter(teachers => selectedCategories.includes("1") || selectedCategories.includes(teachers.categoryId)).slice(0, 6);

    // Category item
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
        <Text style={{
          color: selectedCategories.includes(item.id) ? COLORS.white : COLORS.primary
        }}>{item.name}</Text>
      </TouchableOpacity>
    );

    // Toggle category selection
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

    return (
      <View>
        <SubHeaderItem
          title="Teacher Profiles"
          navTitle="See all"
          onPress={() => navigation.navigate("AllTeacherProfiles")}
        />
        <FlatList
        data={categories}
        keyExtractor={item => item.id}
        numColumns={3} 
        renderItem={renderCategoryItem}
        scrollEnabled={false} 
        contentContainerStyle={{ justifyContent: 'space-between' }} 
      />
        <View style={{
          backgroundColor: COLORS.secondaryWhite,
          marginVertical: 16
        }}>
          <FlatList
            data={filteredTeachers}
            keyExtractor={item => item.id}
            numColumns={1} 
            renderItem={({ item }) => {
              return (
                <HorizontalTeacherProfile
                  key={item.id}
                  name={item.name}
                  image={item.image}
                  course={item.course}
                  grade={item.grade}
                  rating={item.rating}
                  numReviews={item.numReviews}
                  onPress={() => navigation.navigate("DriverDetails")}
                />
              )
            }}
          />  
        </View>
      </View>
    )
  }
  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        {renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderSearchBar()}
          {renderBanner()}
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
    alignItems: "center"
  },
  greeeting: {
    fontSize: 12,
    fontFamily: "Urbanist Regular",
    color: "gray",
    marginBottom: 4
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
    alignItems: "center"
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
    alignItems: "center"
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
  bannerContainer: {
    width: SIZES.width - 32,
    height: 154,
    paddingHorizontal: 28,
    paddingTop: 28,
    borderRadius: 32,
    backgroundColor: COLORS.primary
  },
  bannerTopContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  bannerCompanyName: {
    fontSize: 16,
    fontFamily: "Urbanist Bold",
    color: COLORS.white
  },
  bannerBottomContainer: {
    marginTop: 8
  },
  bannerEmail: {
    fontSize: 14,
    fontFamily: "Urbanist Medium",
    color: COLORS.white
  },
  bannerAddress: {
    fontSize: 14,
    fontFamily: "Urbanist Medium",
    color: COLORS.white,
    marginTop: 4
  },
  userAvatar: {
    width: 64,
    height: 64,
    borderRadius: 999
  },
  firstName: {
    fontSize: 16,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.dark2,
    marginTop: 6
  },
  bannerItemContainer: {
    width: "100%",
    paddingBottom: 10,
    backgroundColor: COLORS.primary,
    height: 170,
    borderRadius: 32,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: COLORS.white,
  }
})

export default Home