import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, StatusBar } from 'react-native';
import React, { useRef, useState } from 'react';
import { COLORS, SIZES, icons, images, socials } from '../constants';
import AutoSlider from '../components/AutoSlider';
import { ScrollView } from 'react-native-virtualized-view';
import Fontisto from "react-native-vector-icons/Fontisto";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Button from '../components/Button';
import SocialIcon from '../components/SocialIcon';
import RBSheet from "react-native-raw-bottom-sheet";

const CourseDetails = ({ navigation }) => {
  const refRBSheet = useRef();

  // Slider images
  const sliderImages = [
    images.courses1,
  ];

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
          <TouchableOpacity
            style={styles.sendIconContainer}
            onPress={() => refRBSheet.current.open()}>
            <Image
              source={icons.send2}
              resizeMode='contain'
              style={styles.sendIcon}
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
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [selectedFoodMenu, setSelectedFoodMenu] = useState(null);
    const [selectedDrinkMenu, setSelectedDrinkMenu] = useState(null);


    return (
      <View style={styles.contentContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("FoodDetailsAbout")}
          style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, {
            color: COLORS.greyscale900
          }]}>Chinese | Senior One</Text>
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
          onPress={() => navigation.navigate("FoodReviews")}
          style={styles.reviewContainer}>
          <View style={styles.reviewLeftContainer}>
            <Fontisto name="star" size={20} color="orange" />
            <Text style={[styles.avgRating, {
              color: COLORS.greyscale900
            }]}>4.8</Text>
            <Text style={[styles.numReview, {
              color: COLORS.grayscale700
            }]}>(1.2k reviews)</Text>
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
          style={styles.locationContainer}>
          <View style={styles.locationLeftContainer}>
            <MaterialIcons name="location-on" size={20} color={COLORS.primary} />
            <Text style={[styles.locationDistance, {
              color: COLORS.greyscale900
            }]}>¥200/h</Text>
          </View>
        </TouchableOpacity>
        <View style={[styles.separateLine, {
          backgroundColor: COLORS.grayscale200
        }]} />
        <TouchableOpacity
          onPress={() => navigation.navigate("AllTeacherProfiles")}
          style={styles.offerContainer}>
          <View style={styles.offerLeftContainer}>
            <Image
              source={icons.discount}
              resizeMode='contain'
              style={styles.discountIcon}
            />
            <Text style={[styles.discountText, {
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
      <AutoSlider images={sliderImages} />
      {renderHeader()}
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderContent()}
      </ScrollView>
      <View style={[styles.bookBottomContainer, {
        backgroundColor: COLORS.white,
        borderTopColor: COLORS.white,
      }]}>
        <Button
          title="Buy Now"
          filled
          style={styles.bookingBtn}
          onPress={() => navigation.navigate("FoodDetailsAddItem")}
        />
      </View>

      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={360}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
          draggableIcon: {
            backgroundColor: COLORS.grayscale200,
          },
          container: {
            borderTopRightRadius: 32,
            borderTopLeftRadius: 32,
            height: 360,
            backgroundColor: COLORS.white,
            alignItems: "center",
          }
        }}
      >
        <Text style={[styles.bottomTitle, {
          color: COLORS.greyscale900
        }]}>Share</Text>
        <View style={[styles.separateLine, {
          backgroundColor: COLORS.grayscale200,
          marginVertical: 12
        }]} />
        <View style={styles.socialContainer}>
          <SocialIcon
            icon={socials.whatsapp}
            name="WhatsApp"
            onPress={() => refRBSheet.current.close()}
          />
          <SocialIcon
            icon={socials.twitter}
            name="X"
            onPress={() => refRBSheet.current.close()}
          />
          <SocialIcon
            icon={socials.facebook}
            name="Facebook"
            onPress={() => refRBSheet.current.close()}
          />
          <SocialIcon
            icon={socials.instagram}
            name="Instagram"
            onPress={() => refRBSheet.current.close()}
          />
        </View>
        <View style={styles.socialContainer}>
          <SocialIcon
            icon={socials.yahoo}
            name="Yahoo"
            onPress={() => refRBSheet.current.close()}
          />
          <SocialIcon
            icon={socials.titktok}
            name="Tiktok"
            onPress={() => refRBSheet.current.close()}
          />
          <SocialIcon
            icon={socials.messenger}
            name="Chat"
            onPress={() => refRBSheet.current.close()}
          />
          <SocialIcon
            icon={socials.wechat}
            name="Wechat"
            onPress={() => refRBSheet.current.close()}
          />
        </View>
      </RBSheet>
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
  sendIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.white
  },
  sendIconContainer: {
    marginLeft: 8
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
  separateLine: {
    width: "100%",
    height: 1,
    backgroundColor: COLORS.grayscale200
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
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between"
  },
  locationLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationDistance: {
    fontSize: 16,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900,
    marginHorizontal: 8,
    marginBottom: 15,
    marginVertical: 16
  },
  deliverContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12
  },
  deliverText: {
    fontSize: 16,
    fontFamily: "Urbanist Medium",
    color: COLORS.grayscale700,
    marginHorizontal: 8
  },
  motoIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.primary
  },
  offerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 2
  },
  offerLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  discountIcon: {
    height: 20,
    width: 20,
    tintColor: COLORS.primary
  },
  discountText: {
    fontSize: 18,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.greyscale900,
    marginHorizontal: 16
  },
  subtitle: {
    fontSize: 22,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900,
    marginVertical: 12
  },
  bookBottomContainer: {
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
  bookingBtn: {
    width: SIZES.width - 32
  },
  separateLine: {
    width: SIZES.width - 32,
    height: 1,
    backgroundColor: COLORS.grayscale200
  },
  bottomTitle: {
    fontSize: 24,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.black,
    textAlign: "center",
    marginTop: 12
  },
  socialContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
    width: SIZES.width - 32
  },
})

export default CourseDetails