import { View, Text, StyleSheet, ScrollView, Alert, Image, TouchableOpacity, Modal, TouchableWithoutFeedback, FlatList, TextInput } from 'react-native';
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
import RNPickerSelect from 'react-native-picker-select';
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

  const handleOnPressBirthday = () => {
    setOpenStartDatePicker(true);
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
            <Input
              id="fullName"
              onInputChanged={inputChangedHandler}
              errorText={formState.inputValidities['fullName']}
              placeholder="Full Name"
              placeholderTextColor={styles.placeholderStyle.color}
              style={[styles.inputText, styles.inputPadding]}
            />
            <RNPickerSelect
              onValueChange={(value) => inputChangedHandler('gender', value)}
              items={[
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' },
                { label: 'Other', value: 'other' },
              ]}
              style={{
                inputIOS: [styles.pickerInput, styles.inputPadding],
                inputAndroid: [styles.pickerInput, styles.inputPadding],
                placeholder: styles.placeholderStyle,
              }}
              placeholder={{
                label: 'Gender',
                value: null,
                color: styles.placeholderStyle.color,
                fontSize: styles.placeholderStyle.fontSize,
                fontFamily: styles.placeholderStyle.fontFamily
              }}
            />
            <TouchableOpacity
              style={[styles.inputBtn, styles.inputContainer]}
              onPress={handleOnPressBirthday}
            >
              <Text style={[{ color: birthday ? '#111' : styles.placeholderStyle.color, fontSize: styles.placeholderStyle.fontSize, fontFamily: styles.placeholderStyle.fontFamily }, styles.inputPadding]}>
                {birthday || 'Birthday'}
              </Text>
              <Feather name="calendar" size={24} color={COLORS.grayscale400} />
            </TouchableOpacity>
            <Input
              id="age"
              onInputChanged={inputChangedHandler}
              errorText={formState.inputValidities['age']}
              placeholder="Age"
              placeholderTextColor={styles.placeholderStyle.color}
              style={[styles.inputText, { fontSize: styles.placeholderStyle.fontSize }]}
            />
            <Input
              id="email"
              onInputChanged={inputChangedHandler}
              errorText={formState.inputValidities['email']}
              placeholder="Email"
              placeholderTextColor={styles.placeholderStyle.color}
              keyboardType="email-address"
              style={[styles.inputText, { fontSize: styles.placeholderStyle.fontSize }]}
            />
            {role === 'student' && (
              <RNPickerSelect
                onValueChange={(value) => inputChangedHandler('grade', value)}
                items={[
                  { label: 'Senior One', value: 'Senior One' },
                  { label: 'Senior Two', value: 'Senior Two' },
                  { label: 'Senior Three', value: 'Senior Three' },
                ]}
                style={{
                  inputIOS: styles.pickerInput,
                  inputAndroid: styles.pickerInput,
                  placeholder: styles.placeholderStyle
                }}
                placeholder={{
                  label: 'Grade',
                  value: null,
                  color: styles.placeholderStyle.color,
                }}
              />
            )}
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
          inputChangedHandler('birthday', date.split('/').join('-'));
          setOpenStartDatePicker(false);
        }}
      />
      <View style={styles.bottomContainer}>
        <Button
          title="Continue"
          filled
          style={styles.continueButton}
          onPress={handleContinue}
        />
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
  inputText: {
    color: '#111',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    borderColor: COLORS.greyscale500,
    borderWidth: .4,
    borderRadius: 12,
    height: 52,
    width: SIZES.width - 32,
    alignItems: 'center',
    marginVertical: 12,
    backgroundColor: COLORS.greyscale500,
  },
  downIcon: {
    width: 10,
    height: 10,
    tintColor: "#111"
  },
  selectFlagContainer: {
    width: 90,
    height: 50,
    marginHorizontal: 5,
    flexDirection: "row",
  },
  flagIcon: {
    width: 30,
    height: 30
  },
  input: {
    flex: 1,
    marginVertical: 10,
    height: 40,
    fontSize: 14,
    color: "#111"
  },
  inputBtn: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: COLORS.greyscale500,
    height: 52,
    paddingLeft: 8,
    fontSize: 18,
    justifyContent: "space-between",
    marginTop: 4,
    backgroundColor: COLORS.greyscale500,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 8
  },
  pickerInput: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    marginVertical: 12,
    backgroundColor: COLORS.greyscale500,
  },
  placeholderStyle: {
    color: COLORS.gray,
    fontSize: 15,
    fontFamily: 'System',
  },
  inputPadding: {
    paddingLeft: 8,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 22,
    right: 16,
    left: 16,
    flexDirection: "row",
    justifyContent: "center",
    width: SIZES.width - 32,
    alignItems: "center"
  },
  continueButton: {
    width: (SIZES.width - 32) / 2 - 8,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  closeBtn: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: COLORS.white,
    position: "absolute",
    right: 16,
    top: 32,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999
  }
});

export default FillYourProfile;