import { View, Text, StyleSheet, ScrollView, Image, Alert, TouchableOpacity, Platform } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, icons, images } from '../constants';
import Header from '../components/Header';
import Input from '../components/Input';
import CheckBox from '@react-native-community/checkbox';
import Button from '../components/Button';
import axios from 'axios';
import config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const isTestMode = true;

const initialState = {
  inputValues: {
    email: isTestMode ? 'example@gmail.com' : '',
    password: isTestMode ? '**********' : '',
  },
}

const Login = ({ navigation }) => {
  const [formState, setFormState] = useState(initialState);
  const [error, setError] = useState(null);
  const [isChecked, setChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      setFormState(prevState => ({
        ...prevState,
        inputValues: {
          ...prevState.inputValues,
          [inputId]: inputValue,
        }
      }));
    },
    []
  );

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred', error);
    }
  }, [error]);


  const loginHandler = async () => {
    const { email, password } = formState.inputValues;

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      const response = await axios.post(`${config.API_URL}/api/users/login`, { email, password });

      if (response.status === 200) {
        const { token, user } = response.data;

        if (token && user) {
          await AsyncStorage.setItem('token', token);
          await AsyncStorage.setItem('user', JSON.stringify(user));
          navigation.navigate('Main');
        } else {
          setError('Invalid response from server. Please try again.');
        }
      }
    } catch (err) {

      if (err.response) {
      if (err.response.status === 400) {
        setError('Invalid email or password. Please try again.');
      } else if (err.response.status === 401 || err.response.status === 403) {
        setError('Invalid email or password');
      } else {
        setError('An error occurred during login. Please try again.');
      }
    } else {
      setError('An error occurred during login. Please try again.');
    }
  } finally {
    setIsLoading(false);
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
          <Text style={[styles.title, { color: COLORS.black }]}>Login to Your Account</Text>
          <Input
            id="email"
            onInputChanged={(id, value) => inputChangedHandler(id, value)}
            placeholder="Email"
            placeholderTextColor={COLORS.black}
            icon={icons.email}
            keyboardType="email-address"
          />
          <Input
            onInputChanged={(id, value) => inputChangedHandler(id, value)}
            autoCapitalize="none"
            id="password"
            placeholder="Password"
            placeholderTextColor={COLORS.black}
            icon={icons.padlock}
            secureTextEntry={true}
          />
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
                <Text style={[styles.privacy, { color: COLORS.black }]}>Remember me</Text>
              </View>
            </View>
          </View>
          <Button
            title="Login"
            filled
            onPress={loginHandler}
            style={styles.button}
            isLoading={isLoading}
          />
          <TouchableOpacity onPress={() => navigation.navigate("ForgotPasswordMethods")}>
            <Text style={styles.forgotPasswordBtnText}>Forgot the password?</Text>
          </TouchableOpacity>
        </ScrollView>
        <View style={styles.bottomContainer}>
          <Text style={[styles.bottomLeft, { color: COLORS.black }]}>Don't have an account ?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.bottomRight}>{"  "}Sign Up</Text>
          </TouchableOpacity>
        </View>
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
    fontFamily: "Urbanist SemiBold",
    color: COLORS.black,
    textAlign: "center",
    marginBottom: 22
  },
  checkBoxContainer: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 18,
  },
  checkbox: {
    marginRight: Platform.OS == "ios" ? 8 : 14,
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
  },
  forgotPasswordBtnText: {
    fontSize: 16,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.primary,
    textAlign: "center",
    marginTop: 12
  }
});

export default Login;