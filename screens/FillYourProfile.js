import { View, Text, StyleSheet, ScrollView, Alert, Image, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { COLORS, SIZES, FONTS, icons } from '../constants';
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
import config from '../config';

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
}

const FillYourProfile = ({ route, navigation }) => {
  const { userId, role } = route.params; 
  const [image, setImage] = useState(null);
  const [error, setError] = useState();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [birthday, setBirthday] = useState('');
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);

  const handleOnPressBirthday = () => {
    setOpenStartDatePicker(true);
  };

  const genderOptions = ['Male', 'Female', 'Other'];
  const gradeOptions = ['Senior One', 'Senior Two', 'Senior Three'];

  const handleGenderChange = (value) => {
    inputChangedHandler('gender', value);
    setShowGenderModal(false);
  };

  const handleGradeChange = (value) => {
    inputChangedHandler('grade', value);
    setShowGradeModal(false);
  };

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      if (inputId === 'grade' && role === 'teacher') {
        return;
      }
      const validationResult = validateInput(inputId, inputValue);
      const isValid = validationResult === null; 
      dispatchFormState({ type: 'FORM_INPUT_UPDATE', inputId, validationResult: isValid, inputValue });
    },
    [dispatchFormState, role]
  );

  useEffect(() => {
    if (!userId) {
      console.error("No userId found");
      setError("No userId found. Please try again.");
    }
  }, [userId]);

  // Image Profile handler
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

  const handleContinue = async () => {
    console.log('userId:', userId);

    const formatDate = (date) => {
      return date.replace(/\//g, '-');
    };

    const profileData = {
      userId,
      fullName: formState.inputValues.fullName,
      gender: formState.inputValues.gender,
      age: formState.inputValues.age,
      email: formState.inputValues.email,
      birthday: formatDate(formState.inputValues.birthday),
      grade: formState.inputValues.grade,
    };

    const isFormValid = formState.formIsValid && 
                      formState.inputValues.fullName &&
                      formState.inputValues.gender &&
                      formState.inputValues.age &&
                      formState.inputValues.email &&
                      formState.inputValues.birthday &&
                      (role !== 'student' || (role === 'student' && formState.inputValues.grade));

    if (!isFormValid) {
      Alert.alert('Incomplete Form', 'Please fill all the fields before continuing.');
      return;
    }

    console.log('Profile data being sent:', profileData);

    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('role', role);
      formData.append('fullName', formState.inputValues.fullName);
      formData.append('gender', formState.inputValues.gender);
      formData.append('age', formState.inputValues.age);
      formData.append('email', formState.inputValues.email);
      formData.append('birthday', formatDate(formState.inputValues.birthday));
      if (role === 'student') {
        formData.append('grade', formState.inputValues.grade);
      }
      if (image) {
        formData.append('photo', {
          uri: image.uri,
          type: image.type, 
          name: `profile.${image.type.split('/')[1]}`, 
        });
      }

      const response = await axios.post(`${config.API_URL}/api/profiles/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        Alert.alert('Congratulations!', 'Profile created successfully');
        navigation.navigate('Main'); 
      } else {
        console.error('Error creating profile:', response.status);
      }
    } catch (err) {
      console.error('Error creating profile:', err.message);
      Alert.alert('Error', 'Failed to create profile');
    }
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <Header title="Fill Your Profile" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ alignItems: "center", marginVertical: 12 }}>
            <View style={styles.avatarContainer}>
              <Image
                source={image === null ? icons.userDefault2 : image}
                resizeMode="cover"
                style={styles.avatar} />
              <TouchableOpacity
                onPress={pickImage}
                style={styles.pickImage}>
                <MaterialCommunityIcons
                  name="pencil-outline"
                  size={24}
                  color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <Text style={styles.label}>Full Name</Text>
            <Input
              value={formState.inputValues.fullName}
              onInputChanged={(id, value) => inputChangedHandler('fullName', value)}
              placeholderTextColor={COLORS.black}
            />
            <Text style={styles.label}>Age</Text>
            <Input
              value={formState.inputValues.age}
              onInputChanged={(id, value) => inputChangedHandler('age', value)}
              placeholderTextColor={COLORS.black}
            />
            <Text style={styles.label}>Email</Text>
            <Input
              value={formState.inputValues.email}
              onInputChanged={(id, value) => inputChangedHandler('email', value)}
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
                <Text style={{ ...FONTS.body4, color: COLORS.black }}>{formState.inputValues.birthday || ''}</Text>
                <Feather name="calendar" size={24} color={COLORS.grayscale400} />
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Gender</Text>
            <View>
              <TouchableOpacity
                style={[styles.inputBtn, {
                  backgroundColor: COLORS.greyscale500,
                  borderColor: COLORS.greyscale500,
                }]}
                onPress={() => setShowGenderModal(true)}
              >
                <Text style={{ ...FONTS.body4, color: COLORS.black }}>{formState.inputValues.gender || ''}</Text>
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
                    <Text style={{ ...FONTS.body4, color: COLORS.black }}>{formState.inputValues.grade || ''}</Text>
                    <Feather name="chevron-down" size={24} color={COLORS.grayscale400} />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </ScrollView>
        <View style={styles.bottomSpacing} />
        <Button
          title="Continue"
          filled
          style={styles.continueButton}
          onPress={handleContinue}
        />
      </View>
      <DatePickerModal
        open={openStartDatePicker}
        startDate={null}
        selectedDate={birthday}
        onClose={() => setOpenStartDatePicker(false)}
        onChangeStartDate={(date) => {
          setBirthday(date);
          inputChangedHandler('birthday', date.split('/').join('-'));
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
  )
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white
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
  continueButton: {
    width: SIZES.width - 32,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  label: {
    ...FONTS.body4,
    color: COLORS.black,
    marginBottom: 4,
    marginTop: 8,
    paddingLeft: 4,
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
});

export default FillYourProfile;