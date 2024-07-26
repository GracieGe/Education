import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS, SIZES, icons } from '../constants';
import { ScrollView } from 'react-native-virtualized-view';
import Fontisto from "react-native-vector-icons/Fontisto";
import Button from '../components/Button';
import axios from 'axios';
import config from '../config';

const CourseDetails = ({ route, navigation }) => {
  const { courseId } = route.params; 
  const [courseData, setCourseData] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/api/courses/${courseId}`);
        setCourseData(response.data);
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const renderImage = () => {
    if (!courseData) {
      return <Text>Loading...</Text>;
    }

    return (
      <View>
        <Image
          source={{ uri: `${config.API_URL}/${courseData.image}` }}
          resizeMode='cover'
          style={{ width: SIZES.width, height: 380 }} 
        />
        <View style={styles.separateLine} />
      </View>
    );
  };

  // render header
  const renderHeader = () => {
    const [isFavorite, setIsFavorite] = useState(false);

    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}>
          <Image
            source={icons.back}
            resizeMode='contain'
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <View style={styles.iconContainer}>
          <TouchableOpacity
            onPress={() => setIsFavorite(!isFavorite)}>
            <Image
              source={isFavorite ? icons.heart2 : icons.heart2Outline}
              resizeMode='contain'
              style={styles.bookmarkIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  /**
   * render content
   */
  const renderContent = () => {
    if (!courseData) {
      return <Text>Loading...</Text>;
    }

    return (
      <View style={styles.contentContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("CourseDescription", { courseId: courseData.courseId })}
          style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, {
            color: COLORS.greyscale900
          }]}>{`${courseData.courseName} | ${courseData.grade}`}</Text>
          <Image
            source={icons.arrowRight}
            resizeMode='contain'
            style={[styles.arrowRightIcon, {
              tintColor: COLORS.greyscale900
            }]}
          />
        </TouchableOpacity>
        <View style={[styles.separateLine, {
          backgroundColor: COLORS.grayscale200
        }]} />
        <TouchableOpacity
          style={styles.priceContainer}>
          <View style={styles.priceLeftContainer}>
            <Image
              source={icons.wallet}
              resizeMode='contain'
              style={styles.walletIcon}
            />
            <Text style={[styles.priceNumber, {
              color: COLORS.greyscale900
            }]}>{`¥${courseData.price}/h`}</Text>
          </View>
        </TouchableOpacity>
        <View style={[styles.separateLine, {
          backgroundColor: COLORS.grayscale200
        }]} />
        <TouchableOpacity
          onPress={() => navigation.navigate("FoodReviews")}
          style={styles.reviewContainer}>
          <View style={styles.reviewLeftContainer}>
            <Fontisto name="star" size={20} color="orange" />
            <Text style={[styles.avgRating, {
              color: COLORS.greyscale900
            }]}>{courseData.rating}</Text>
            <Text style={[styles.numReview, {
              color: COLORS.grayscale700
            }]}>{`(${courseData.numReviews} reviews)`}</Text>
          </View>
          <Image
            source={icons.arrowRight}
            resizeMode='contain'
            style={[styles.arrowRightIcon, {
              tintColor: COLORS.greyscale900,
            }]}
          />
        </TouchableOpacity>
        <View style={[styles.separateLine, {
          backgroundColor: COLORS.grayscale200
        }]} />
        <TouchableOpacity
          onPress={() => navigation.navigate("AllTeacherProfiles")}
          style={styles.teacherContainer}>
          <View style={styles.teacherLeftContainer}>
            <Image
              source={icons.users}
              resizeMode='contain'
              style={styles.teacherIcon}
            />
            <Text style={[styles.teacherText, {
              color: COLORS.greyscale900,
            }]}>Teaching Staff</Text>
          </View>
          <Image
            source={icons.arrowRight}
            resizeMode='contain'
            style={[styles.arrowRightIcon, {
              tintColor: COLORS.greyscale900
            }]}
          />
        </TouchableOpacity>
        <View style={[styles.separateLine, {
          backgroundColor: COLORS.grayscale200
        }]} />
      </View>
    )
  }

  return (
    <View style={[styles.area,
    { backgroundColor:COLORS.white }]}>
      <StatusBar hidden />
      {renderHeader()}
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderImage()}
        {renderContent()}
      </ScrollView>
      <View style={[styles.buyBottomContainer, {
        backgroundColor: COLORS.white,
        borderTopColor: COLORS.white,
      }]}>
        <Button
          title="Buy Now"
          filled
          style={styles.buyBtn}
          onPress={() => navigation.navigate("CourseDetailsAddItem", { courseId: courseData.courseId })}
        />
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  headerContainer: {
    width: SIZES.width - 32,
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    top: 32,
    zIndex: 999,
    left: 16,
    right: 16
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.white
  },
  bookmarkIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.white
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  contentContainer: {
    marginHorizontal: 12
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%"
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900
  },
  arrowRightIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900,
    marginVertical: 12
  },
  reviewContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 2
  },
  reviewLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avgRating: {
    fontSize: 16,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900,
    marginHorizontal: 8
  },
  numReview: {
    fontSize: 16,
    fontFamily: "Urbanist Medium",
    color: COLORS.grayscale700
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between"
  },
  priceLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceNumber: {
    fontSize: 16,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900,
    marginHorizontal: 8,
    marginBottom: 15,
    marginVertical: 16
  },
  walletIcon: {
    height: 16,
    width: 16,
    tintColor: COLORS.primary
  },
  teacherContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 2
  },
  teacherLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  teacherIcon: {
    height: 20,
    width: 20,
    tintColor: COLORS.primary
  },
  teacherText: {
    fontSize: 16,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.greyscale900,
    marginHorizontal: 16
  },
  buyBottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: SIZES.width,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 104,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
    borderTopColor: COLORS.white,
    borderTopWidth: 1,
  },
  buyBtn: {
    width: SIZES.width - 32
  },
  separateLine: {
    width: SIZES.width - 32,
    height: 1,
    backgroundColor: COLORS.grayscale200,
  },
})

export default CourseDetails