import { View, Text, StyleSheet, ScrollView, Image, Alert, TouchableOpacity, Platform } from 'react-native';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, icons, images } from '../constants';
import Header from '../components/Header';
import { reducer } from '../utils/reducers/formReducers';
import { validateInput } from '../utils/actions/formActions';
import Input from '../components/Input';
import CheckBox from '@react-native-community/checkbox';
import Button from '../components/Button';
import axios from 'axios';
import config from '../config';

const isTestMode = true;

const initialState = {
  inputValues: {
    email: isTestMode ? 'example@gmail.com' : '',
    password: isTestMode ? '**********' : '',
  },
  inputValidities: {
    email: false,
    password: false
  },
  formIsValid: false,
}

const Signup = ({ navigation, route }) => {
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isChecked, setChecked] = useState(false);
  const [userType, setUserType] = useState(null);

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ type: 'FORM_INPUT_UPDATE', inputId, validationResult: result, inputValue });
    },
    [dispatchFormState]
  );

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred', error);
    }
  }, [error]);

  const toggleUserType = (type) => {
    setUserType((prevType) => (prevType === type ? null : type));
  };

  const formatDate = (date) => {
    const padTo2Digits = (num) => num.toString().padStart(2, '0');
    return (
      date.getFullYear() +
      '-' +
      padTo2Digits(date.getMonth() + 1) +
      '-' +
      padTo2Digits(date.getDate()) +
      ' ' +
      padTo2Digits(date.getHours()) +
      ':' +
      padTo2Digits(date.getMinutes()) +
      ':' +
      padTo2Digits(date.getSeconds())
    );
  };

  const signupHandler = async () => {
    const emailValid = formState.inputValidities.email === null; 
    const passwordValid = formState.inputValidities.password === null; 
    const isFormValid = emailValid && passwordValid && userType && isChecked;

    if (!isFormValid) {
      Alert.alert('Invalid input', 'Please fill out all fields correctly.');
      return;
    }

    const userData = {
      email: formState.inputValues.email,
      password: formState.inputValues.password,
      role: userType,
      timeOfCreation: formatDate(new Date()),
    };

    console.log('User data being sent:', userData);

    try {
      setIsLoading(true);
      const response = await axios.post(`${config.API_URL}/api/users/signup`, userData);
      setIsLoading(false);
      if (response.status === 201) {
        const { userId, role } = response.data;
        navigation.navigate("FillYourProfile", { userId, role });
      } else {
        console.error('Error creating user:', response.status);
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
    }
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <Header />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}>
            <Image
              source={images.logo}
              resizeMode='contain'
              style={styles.logo}
            />
          </View>
          <Text style={[styles.title, { color: COLORS.black }]}>Create Your Account</Text>
          <Input
            id="email"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities['email']}
            placeholder="Email"
            placeholderTextColor={COLORS.black}
            icon={icons.email}
            keyboardType="email-address"
          />
          <Input
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities['password']}
            autoCapitalize="none"
            id="password"
            placeholder="Password"
            placeholderTextColor={COLORS.black}
            icon={icons.padlock}
            secureTextEntry={true}
          />
          <Text style={styles.label}>I am a:</Text>
          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => toggleUserType('student')}
            >
              <CheckBox
                value={userType === 'student'}
                onValueChange={() => toggleUserType('student')}
                tintColors={{ true: COLORS.primary, false: 'gray' }}
              />
              <Text style={styles.radioText}>Student</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => toggleUserType('teacher')}
            >
              <CheckBox
                value={userType === 'teacher'}
                onValueChange={() => toggleUserType('teacher')}
                tintColors={{ true: COLORS.primary, false: 'gray' }}
              />
              <Text style={styles.radioText}>Teacher</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.checkBoxContainer}>
            <View style={{ flexDirection: 'row' }}>
              <CheckBox
                style={styles.checkbox}
                value={isChecked}
                boxType="square"
                onTintColor={isChecked ? COLORS.primary : "gray"}
                onFillColor={isChecked ? COLORS.primary : "gray"}
                onCheckColor={COLORS.white}
                onValueChange={setChecked}
                tintColors={{ true: COLORS.primary, false: "gray" }}
              />
              <View style={{ flex: 1 }}>
                <Text style={[styles.privacy, { color: COLORS.black }]}>By continuing you accept our Privacy Policy</Text>
              </View>
            </View>
          </View>
          <Button
            title="Sign Up"
            filled
            onPress={signupHandler}
            style={styles.button}
            isLoading={isLoading}
          />
        </ScrollView>
        <View style={styles.bottomContainer}>
          <Text style={[styles.bottomLeft, { color: COLORS.black }]}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.bottomRight}> Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
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
  logo: {
    width: 100,
    height: 100,
    tintColor: COLORS.primary
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 32
  },
  title: {
    fontSize: 26,
    fontFamily: "Urbanist Bold",
    color: COLORS.black,
    textAlign: "center",
    marginBottom: 22
  },
  label: {
    fontSize: 16,
    fontFamily: "Urbanist-Regular",
    color: COLORS.black,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  radioText: {
    fontSize: 16,
    fontFamily: "Urbanist-Regular",
    color: COLORS.black,
    marginLeft: 3,
  },
  checkBoxContainer: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 18,
  },
  checkbox: {
    marginRight: Platform.OS === "ios" ? 8 : 14,
    marginLeft: 4,
    height: 16,
    width: 16,
    borderColor: COLORS.primary,
  },
  privacy: {
    fontSize: 12,
    fontFamily: "Urbanist Regular",
    color: COLORS.black,
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 18,
    position: "absolute",
    bottom: 12,
    right: 0,
    left: 0,
  },
  bottomLeft: {
    fontSize: 14,
    fontFamily: "Urbanist Regular",
    color: "black"
  },
  bottomRight: {
    fontSize: 16,
    fontFamily: "Urbanist Medium",
    color: COLORS.primary
  },
  button: {
    marginVertical: 6,
    width: SIZES.width - 32,
    borderRadius: 30
  }
})

export default Signup;