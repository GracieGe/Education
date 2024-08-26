import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, FlatList, ScrollView } from 'react-native';
import { COLORS, icons } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import NotFoundCard from '../components/NotFoundCard';
import VerticalCourseCard from '../components/VerticalCourseCard';
import HorizontalTeacherProfile from '../components/HorizontalTeacherProfile';
import axios from 'axios';
import config from '../config';

const Search = ({ navigation }) => {
    const [searchType, setSearchType] = useState('courses');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [resultsCount, setResultsCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleSearch = useCallback(async () => {
        setLoading(true);
        try {
            let dataToFilter = [];
            if (searchType === 'courses') {
                const response = await axios.get(`${config.API_URL}/api/courses`);
                dataToFilter = response.data;
            } else {
                const response = await axios.get(`${config.API_URL}/api/teachers/signed`);
                dataToFilter = response.data;
            }
            
            const filteredResults = dataToFilter.filter((item) =>
                searchType === 'courses' 
                    ? item.courseName.toLowerCase().includes(searchQuery.toLowerCase()) 
                    : item.fullName.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredData(filteredResults);
            setResultsCount(filteredResults.length);
        } catch (error) {
            console.error('Error fetching search data:', error);
        }
        setLoading(false);
    }, [searchQuery, searchType]);

    useEffect(() => {
        handleSearch();
    }, [searchType, handleSearch]);

    const handleSearchQueryChange = (text) => {
        setSearchQuery(text);
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.headerLeft}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        source={icons.back}
                        resizeMode='contain'
                        style={styles.backIcon}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Search</Text>
            </View>
        </View>
    );

    const renderSearchTypeToggle = () => (
        <View style={styles.toggleContainer}>
            <TouchableOpacity
                style={[
                    styles.toggleButton,
                    searchType === 'courses' && styles.activeToggleButton,
                ]}
                onPress={() => setSearchType('courses')}
            >
                <Text
                    style={[
                        styles.toggleButtonText,
                        searchType === 'courses' && styles.activeToggleButtonText,
                    ]}
                >
                    Courses
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.toggleButton,
                    searchType === 'teachers' && styles.activeToggleButton,
                ]}
                onPress={() => setSearchType('teachers')}
            >
                <Text
                    style={[
                        styles.toggleButtonText,
                        searchType === 'teachers' && styles.activeToggleButtonText,
                    ]}
                >
                    Teachers
                </Text>
            </TouchableOpacity>
        </View>
    );

    const renderContent = () => (
        <View>
            {/* Search bar */}
            <View style={styles.searchBarContainer}>
                <TouchableOpacity onPress={handleSearch}>
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
                    value={searchQuery}
                    onChangeText={handleSearchQueryChange}
                    onSubmitEditing={handleSearch}
                />
            </View>

            {loading ? (
                <Text>Loading...</Text>
            ) : resultsCount > 0 ? (
                <FlatList
                    key={searchType}
                    data={filteredData}
                    keyExtractor={(item) => 
                        searchType === 'courses' ? item.courseId?.toString() : item.teacherId?.toString()
                    }
                    numColumns={searchType === 'courses' ? 2 : 1}
                    columnWrapperStyle={searchType === 'courses' ? { justifyContent: 'space-between', marginBottom: 16 } : null}
                    renderItem={({ item }) => (
                        searchType === 'courses' ? (
                            <VerticalCourseCard
                                courseName={item.courseName}
                                grade={item.grade}
                                price={item.price}
                                rating={item.rating}
                                numReviews={item.numReviews}
                                image={`${config.API_URL}/${item.image}`}
                                onPress={() => navigation.navigate("CourseDetails", { courseId: item.courseId })}
                            />
                        ) : (
                            <HorizontalTeacherProfile
                                fullName={item.fullName}
                                photo={`${config.API_URL}/${item.photo}`}
                                courseName={item.courseName}
                                grade={item.grade}
                                rating={item.rating}
                                numReviews={item.numReviews}
                                onPress={() => navigation.navigate("TeacherDetails", { teacherId: item.teacherId })}
                            />
                        )
                    )}
                />
            ) : (
                <NotFoundCard />
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.area}>
            <View style={styles.container}>
                {renderHeader()}
                <ScrollView keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>
                    {renderSearchTypeToggle()}
                    {renderContent()}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: COLORS.white,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black,
    },
    headerTitle: {
        fontSize: 20,
        marginLeft: 16,
        color: COLORS.black,
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.secondaryWhite,
        padding: 16,
        borderRadius: 12,
        height: 50,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
    },
    searchIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.gray,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        marginHorizontal: 8,
        color: COLORS.black,
        paddingVertical: 0,  
        textAlignVertical: 'center',
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    toggleButton: {
        width: '48%',
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1.3,
        borderColor: COLORS.primary,
    },
    activeToggleButton: {
        backgroundColor: COLORS.primary,
    },
    toggleButtonText: {
        fontSize: 16,
        color: COLORS.primary,
    },
    activeToggleButtonText: {
        color: COLORS.white,
    },
});

export default Search;