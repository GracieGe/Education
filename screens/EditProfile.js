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

const EditProfile = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [error, setError] = useState();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [selectedGender, setSelectedGender] = useState('');
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [showGradeModal, setShowGradeModal] = useState(false);

  const genderOptions = [
    'Male',
    'Female',
    'Other'
  ];

  const gradeOptions = [
    'Senior One',
    'Senior Two',
    'Senior Three'
  ];

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
    if (error) {
      Alert.alert('An error occurred', error);
    }
  }, [error]);

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
        setImage({ uri: imageUri });
      }
    });
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
            <Input
              id="fullName"
              onInputChanged={inputChangedHandler}
              errorText={formState.inputValidities['fullName']}
              placeholder="Full Name"
              placeholderTextColor={COLORS.black}
            />
            <Input
              id="age"
              onInputChanged={inputChangedHandler}
              errorText={formState.inputValidities['age']}
              placeholder="Age"
              placeholderTextColor={COLORS.black}
            />
            <View style={{ width: SIZES.width - 32 }}>
              <TouchableOpacity
                style={[styles.inputBtn, {
                  backgroundColor: COLORS.greyscale500,
                  borderColor: COLORS.greyscale500,
                }]}
                onPress={handleOnPressBirthday}
              >
                <Text style={{ ...FONTS.body4, color: COLORS.black }}>{birthday || 'Birthday'}</Text>
                <Feather name="calendar" size={24} color={COLORS.grayscale400} />
              </TouchableOpacity>
            </View>
            <Input
              id="email"
              onInputChanged={inputChangedHandler}
              errorText={formState.inputValidities['email']}
              placeholder="Email"
              placeholderTextColor={COLORS.black}
              keyboardType="email-address"
            />
            <View>
              <TouchableOpacity
                style={[styles.inputBtn, {
                  backgroundColor: COLORS.greyscale500,
                  borderColor: COLORS.greyscale500,
                }]}
                onPress={() => setShowGenderModal(true)}
              >
                <Text style={{ ...FONTS.body4, color: COLORS.black }}>{selectedGender || 'Gender'}</Text>
                <Feather name="chevron-down" size={24} color={COLORS.grayscale400} />
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                style={[styles.inputBtn, {
                  backgroundColor: COLORS.greyscale500,
                  borderColor: COLORS.greyscale500,
                }]}
                onPress={() => setShowGradeModal(true)}
              >
                <Text style={{ ...FONTS.body4, color: COLORS.black }}>{selectedGrade || 'Grade'}</Text>
                <Feather name="chevron-down" size={24} color={COLORS.grayscale400} />
              </TouchableOpacity>
            </View>
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
      <View style={styles.bottomContainer}>
        <Button
          title="Update"
          filled
          style={styles.updateButton}
          onPress={() => navigation.goBack()}
        />
      </View>
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

export default EditProfile;