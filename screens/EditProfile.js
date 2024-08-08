import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { reducer } from '../utils/reducers/formReducers';
import { validateInput } from '../utils/actions/formActions';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import { launchImageLibrary } from 'react-native-image-picker';
import Input from '../components/Input';
import DatePickerModal from '../components/DatePickerModal';
import Button from '../components/Button';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';
import { COLORS, SIZES, FONTS, icons } from '../constants';

const initialState = {
  inputValues: {
    fullName: '',
    gender: '',
    age: '',
    grade: '',
    email: '',
    birthday: '',
  },
  inputValidities: {
    fullName: false,
    gender: false,
    age: false,
    grade: false,
    email: false,
    birthday: false,
  },
  formIsValid: false,
};

const EditProfile = ({ route, navigation }) => {
  const [image, setImage] = useState(null);
  const [error, setError] = useState();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [selectedGender, setSelectedGender] = useState('');
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');

  const genderOptions = ['Male', 'Female', 'Other'];
  const gradeOptions = ['Senior One', 'Senior Two', 'Senior Three'];

  const handleGenderChange = (value) => {
    setSelectedGender(value);
    inputChangedHandler('gender', value);
    setShowGenderModal(false);
  };

  const handleGradeChange = (value) => {
    setSelectedGrade(value);
    inputChangedHandler('grade', value);
    setShowGradeModal(false);
  };

  const [birthday, setBirthday] = useState('');
  const handleOnPressBirthday = () => {
    setOpenStartDatePicker(true);
  };

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue });
    },
    [dispatchFormState]
  );

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          throw new Error('No token found, please login again');
        }

        const response = await axios.get(`${config.API_URL}/api/profiles`, {
          headers: {
            'x-auth-token': token
          }
        });

        const { fullName, gender, age, grade, email, birthday, photo, role } = response.data;
        setImage(photo ? { uri: photo } : null);
        setSelectedGender(gender);
        setSelectedGrade(grade);
        setBirthday(birthday);
        setRole(role);

        dispatchFormState({
          inputValues: {
            fullName,
            gender,
            age,
            grade,
            email,
            birthday,
          },
          inputValidities: {
            fullName: true,
            gender: true,
            age: true,
            grade: role === 'student',
            email: true,
            birthday: true,
          },
          formIsValid: true,
        });

      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        let imageType = response.type || response.assets?.[0]?.type;
        setImage({ uri: imageUri, type: imageType });
      }
    });
  };

  const updateProfileHandler = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        throw new Error('No token found, please login again');
      }

      const formData = new FormData();
      formData.append('userId', route.params.userId);
      formData.append('role', role);
      formData.append('fullName', formState.inputValues.fullName);
      formData.append('gender', selectedGender);
      formData.append('age', formState.inputValues.age);
      formData.append('email', formState.inputValues.email);
      formData.append('birthday', birthday);
      if (role === 'student') {
        formData.append('grade', selectedGrade);
      }
      if (image) {
        formData.append('photo', {
          uri: image.uri,
          type: image.type,
          name: `profile.${image.type.split('/')[1]}`,
        });
      }

      const response = await axios.put(`${config.API_URL}/api/profiles`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token
        }
      });

      if (response.status === 200) {
        Alert.alert('Congratulations', 'Profile updated successfully');
        navigation.navigate('Profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <Header title="Edit Profile" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ alignItems: "center", marginVertical: 12 }}>
            <View style={styles.avatarContainer}>
              <Image
                source={image === null ? icons.userDefault2 : image}
                resizeMode="cover"
                style={styles.avatar}
              />
              <TouchableOpacity
                onPress={pickImage}
                style={styles.pickImage}
              >
                <MaterialCommunityIcons
                  name="pencil-outline"
                  size={24}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <Text style={styles.label}>Full Name</Text>
            <Input
              id="fullName"
              onInputChanged={inputChangedHandler}
              value={formState.inputValues.fullName}
              errorText={formState.inputValidities['fullName']}
              placeholderTextColor={COLORS.black}
            />
            <Text style={styles.label}>Age</Text>
            <Input
              id="age"
              onInputChanged={inputChangedHandler}
              value={formState.inputValues.age}
              errorText={formState.inputValidities['age']}
              placeholderTextColor={COLORS.black}
            />
            <Text style={styles.label}>Birthday</Text>
            <View style={{ width: SIZES.width - 32 }}>
              <TouchableOpacity
                style={[styles.inputBtn, {
                  backgroundColor: COLORS.greyscale500,
                  borderColor: COLORS.greyscale500,
                }]}
                onPress={handleOnPressBirthday}
              >
                <Text style={{ ...FONTS.body4, color: COLORS.black }}>{birthday || ''}</Text>
                <Feather name="calendar" size={24} color={COLORS.grayscale400} />
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Email</Text>
            <Input
              id="email"
              onInputChanged={inputChangedHandler}
              value={formState.inputValues.email}
              errorText={formState.inputValidities['email']}
              placeholderTextColor={COLORS.black}
              keyboardType="email-address"
            />
            <Text style={styles.label}>Gender</Text>
            <View>
              <TouchableOpacity
                style={[styles.inputBtn, {
                  backgroundColor: COLORS.greyscale500,
                  borderColor: COLORS.greyscale500,
                }]}
                onPress={() => setShowGenderModal(true)}
              >
                <Text style={{ ...FONTS.body4, color: COLORS.black }}>{selectedGender || ''}</Text>
                <Feather name="chevron-down" size={24} color={COLORS.grayscale400} />
              </TouchableOpacity>
            </View>
            {role === 'student' && (
              <>
                <Text style={styles.label}>Grade</Text>
                <View>
                  <TouchableOpacity
                    style={[styles.inputBtn, {
                      backgroundColor: COLORS.greyscale500,
                      borderColor: COLORS.greyscale500,
                    }]}
                    onPress={() => setShowGradeModal(true)}
                  >
                    <Text style={{ ...FONTS.body4, color: COLORS.black }}>{selectedGrade || ''}</Text>
                    <Feather name="chevron-down" size={24} color={COLORS.grayscale400} />
                  </TouchableOpacity>
                </View>
              </>
            )}
            <View style={styles.bottomSpacing} />
            <Button
              title="Update"
              filled
              style={styles.updateButton}
              onPress={updateProfileHandler}
            />
          </View>
        </ScrollView>
      </View>
      <DatePickerModal
        open={openStartDatePicker}
        startDate={null}
        selectedDate={birthday}
        onClose={() => setOpenStartDatePicker(false)}
        onChangeStartDate={(date) => {
          setBirthday(date);
          inputChangedHandler('birthday', date);
          setOpenStartDatePicker(false);
        }}
      />
      <Modal
        visible={showGenderModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGenderModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowGenderModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {genderOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.modalOption}
                  onPress={() => handleGenderChange(option)}
                >
                  <Text style={styles.modalOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        visible={showGradeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGradeModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowGradeModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {gradeOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.modalOption}
                  onPress={() => handleGradeChange(option)}
                >
                  <Text style={styles.modalOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  avatarContainer: {
    marginVertical: 12,
    alignItems: "center",
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  avatar: {
    height: 130,
    width: 130,
    borderRadius: 65,
  },
  pickImage: {
    height: 42,
    width: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  inputBtn: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: COLORS.greyscale500,
    height: 50,
    paddingLeft: 12,
    fontSize: 18,
    justifyContent: "space-between",
    marginVertical: 8,
    backgroundColor: COLORS.greyscale500,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 8,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 32,
    right: 16,
    left: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    width: SIZES.width - 32,
    alignItems: "center",
  },
  updateButton: {
    width: SIZES.width - 32,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  bottomSpacing: {
    height: 50,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    width: 300,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalOption: {
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  modalOptionText: {
    ...FONTS.body3,
    color: COLORS.black,
  },
  label: {
    ...FONTS.body4,
    color: COLORS.black,
    marginBottom: 4,
    marginTop: 8,
    paddingLeft: 4,
  },
});

export default EditProfile;