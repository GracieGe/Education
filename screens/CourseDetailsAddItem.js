import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS, SIZES, icons, images } from '../constants';
import { ScrollView } from 'react-native-virtualized-view';
import Button from '../components/Button';
import axios from 'axios';
import config from '../config';

const CourseDetailsAddItem = ({ route, navigation }) => {
    const { courseId } = route.params; 
    const [courseData, setCourseData] = useState({ courseName: '', grade: '', description: '' });
    const [count, setCount] = useState(1);
    const [notes, setNotes] = useState('');

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
        return (
          <View>
            <Image
              source={images.courses1}
              resizeMode='cover'
              style={{ width: SIZES.width, height: 350 }} 
            />
            <View style={styles.separateLine} />
          </View>
        );
      }

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


    // render content
    const renderContent = () => {
        const [expanded, setExpanded] = useState(false);

        const description = courseData.description || "No description available.";
        const toggleExpanded = () => {
            setExpanded(!expanded);
        };

        const decreaseCount = () => {
            if (count > 1) {
                setCount(count - 1);
            }
        };

        const increaseCount = () => {
            setCount(count + 1);
        };
        return (
            <View style={styles.contentContainer}>
                <Text style={[styles.headerContentTitle, {
                    color:  COLORS.greyscale900,
                }]}>
                    {`${courseData.courseName} | ${courseData.grade}`}
                </Text>
                <View style={[styles.separateLine, {
                    marginVertical: 12,
                    backgroundColor: COLORS.grayscale200
                }]} />
                <Text style={[styles.description, {
                    color: COLORS.grayscale700,
                }]} numberOfLines={expanded ? undefined : 4}>{description}</Text>
                <TouchableOpacity onPress={toggleExpanded}>
                    <Text style={styles.viewBtn}>
                        {expanded ? 'View Less' : 'View More'}
                    </Text>
                </TouchableOpacity>
                <View style={styles.addItemContainer}>
                    <TouchableOpacity style={[styles.addItemBtn, {
                        borderColor: COLORS.grayscale200
                    }]} onPress={decreaseCount}>
                        <Text style={styles.addItemBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.addItemText}>{count}</Text>
                    <TouchableOpacity style={[styles.addItemBtn, {
                        borderColor: COLORS.grayscale200
                    }]} onPress={increaseCount}>
                        <Text style={styles.addItemBtnText}>+</Text>
                    </TouchableOpacity>
                </View>

                <TextInput
                    placeholder='Note to the order (optional)'
                    placeholderTextColor={COLORS.grayscale700}
                    style={[styles.input, {
                        backgroundColor: COLORS.tertiaryWhite,
                        borderColor: COLORS.grayscale200,
                    }]}
                    multiline={true}
                    value={notes}
                    onChangeText={setNotes}
                    blurOnSubmit={false}
                />
            </View>
        )
    }

    return (
        <View style={[styles.area, { backgroundColor: COLORS.white }]}>
            <StatusBar hidden />
            {renderHeader()}
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
                {renderImage()}
                {renderContent()}
            </ScrollView>
            <Button
                title="Add To Basket"
                filled
                style={styles.btn}
                onPress={() => navigation.navigate("CheckoutOrders", { courseData, count, notes })}
            />
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
    separateLine: {
        width: SIZES.width - 32,
        height: 1,
        backgroundColor: COLORS.grayscale200
    },
    headerContentTitle: {
        fontSize: 28,
        fontFamily: "Urbanist Bold",
        color: COLORS.black,
        marginTop: 12
    },
    description: {
        fontSize: 14,
        color: COLORS.grayscale700,
        fontFamily: "Urbanist Regular",
    },
    viewBtn: {
        color: COLORS.primary,
        marginTop: 5,
        fontSize: 14,
        fontFamily: "Urbanist SemiBold",
    },
    addItemContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 22
    },
    addItemBtn: {
        height: 52,
        width: 52,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        borderColor: COLORS.grayscale200,
        borderWidth: 1
    },
    addItemBtnText: {
        fontSize: 24,
        color: COLORS.primary,
        fontFamily: "Urbanist Medium"
    },
    addItemText: {
        fontSize: 20,
        color: COLORS.greyscale900,
        fontFamily: "Urbanist SemiBold",
        marginHorizontal: 22
    },
    input: {
        width: SIZES.width - 32,
        height: 72,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.grayscale200,
        paddingHorizontal: 10,
        fontSize: 14,
        fontFamily: "Urbanist Regular",
        color: COLORS.grayscale700,
        marginVertical: 12,
        backgroundColor: COLORS.tertiaryWhite
    },
    btn: {
        width: SIZES.width - 32,
        marginHorizontal: 16,
        marginBottom: 24
    }
})

export default CourseDetailsAddItem