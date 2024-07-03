import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import React from 'react';
import { COLORS, SIZES, icons, images } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';

const TeacherDetails = ({ navigation }) => {
  
  /**
   * Render header
   */
  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image 
              source={icons.back}
              resizeMode='contain'
              style={[styles.backIcon, {
                tintColor: COLORS.greyscale900
              }]}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {
            color: COLORS.greyscale900
          }]}>Teacher Details</Text>
        </View>
        <TouchableOpacity>
          <Image
            source={icons.moreCircle}
            resizeMode='contain'
            style={[styles.headerIcon, {
              tintColor: COLORS.greyscale900
            }]}
          />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        {renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.userInfoContainer}>
            <Image
              source={images.user3}
              resizeMode='contain'
              style={styles.avatar}
            />
            <Text style={[styles.driverName, {
              color: COLORS.greyscale900
            }]}>
              Yang Liu
            </Text>
          </View>

          <View style={[styles.driverStatsContainer, {
            backgroundColor: COLORS.white
          }]}>
            <View style={styles.driverStatsItem}>
              <View style={styles.driverStatsIconContainer}>
                <Image
                  source={icons.star}
                  resizeMode='contain'
                  style={styles.driverStatsIcon}
                />
              </View>
              <Text style={[styles.statsNum, {
                color: COLORS.greyscale900
              }]}>4.9</Text>
              <Text style={[styles.statsLabel, {
                color: COLORS.grayscale700,
              }]}>Ratings</Text>
            </View>
            <View style={styles.driverStatsItem}>
              <View style={styles.driverStatsIconContainer}>
                <Image
                  source={icons.people4}
                  resizeMode='contain'
                  style={styles.peopleIcon}
                />
              </View>
              <Text style={[styles.statsNum, {
                color: COLORS.greyscale900
              }]}>279</Text>
              <Text style={[styles.statsLabel, {
                color: COLORS.grayscale700,
              }]}>Students</Text>
            </View>
            <View style={styles.driverStatsItem}>
              <View style={styles.driverStatsIconContainer}>
                <Image
                  source={icons.clock2}
                  resizeMode='contain'
                  style={styles.driverStatsIcon}
                />
              </View>
              <Text style={[styles.statsNum, {
                color: COLORS.greyscale900
              }]}>5</Text>
              <Text style={[styles.statsLabel, {
                color: COLORS.grayscale700,
              }]}>Teaching Years</Text>
            </View>
          </View>

          <View style={[styles.descriptionContainer, {
            backgroundColor: COLORS.white,
            borderRadius: 6,
          }]}>
            <Text style={[styles.descriptionTitle, { color: COLORS.black }]}>
            Description of Teacher
            </Text>
            <Text style={[styles.descriptionText, { color: COLORS.black }]}>
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            </Text> 
          </View>
        </ScrollView>
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("VideoCall")}
            style={styles.document}>
            <Image
              source={icons.document}
              resizeMode='contain'
              style={styles.documentIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("VoiceCall")}
            style={styles.chat}>
            <Image
              source={icons.chatBubble2}
              resizeMode='contain'
              style={styles.chatIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.tertiaryWhite
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.tertiaryWhite,
    padding: 16
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  backIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900,
    marginLeft: 12
  },
  headerIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900
  },
  userInfoContainer: {
    alignItems: "center"
  },
  avatar: {
    height: 108,
    width: 108,
    borderRadius: 999,
    marginVertical: 16
  },
  driverName: {
    fontSize: 22,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900,
  },
  documentIcon: {
    height: 20,
    width: 20,
    tintColor: COLORS.primary,
    marginHorizontal: 6
  },
  driverStatsContainer: {
    width: SIZES.width - 32,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 24,
    marginVertical: 12,
    backgroundColor: COLORS.white
  },
  driverStatsItem: {
    alignItems: "center",
    width: '33%'
  },
  driverStatsIconContainer: {
    height: 52,
    width: 52,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary
  },
  driverStatsIcon: {
    height: 20,
    width: 20,
    tintColor: COLORS.white
  },
  peopleIcon: {
    height: 25,
    width: 25,
    tintColor: COLORS.white
  },
  statsNum: {
    fontFamily: "Urbanist Bold",
    fontSize: 18,
    color: COLORS.greyscale900,
    marginVertical: 6
  },
  statsLabel: {
    fontFamily: "Urbanist Regular",
    fontSize: 13,
    color: COLORS.grayscale700,
    textAlign: 'center'
  },
  descriptionContainer: {
    width: SIZES.width - 32,
    minHeight: 100,
    backgroundColor: COLORS.white,
    alignItems: "center",
    padding: 16,
    marginVertical: 8
  },
  descriptionTitle: {
    fontSize: 18,
    fontFamily: "Urbanist Bold",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    fontFamily: "Urbanist Regular",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
  chat: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    marginHorizontal: 16
  },
  document: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor: COLORS.greyscale600,
    marginHorizontal: 16
  },
  chatIcon: {
    height: 25,
    width: 25,
    tintColor: COLORS.white
  },
  documentIcon: {
    height: 25,
    width: 25,
    tintColor: COLORS.white
  }
})

export default TeacherDetails