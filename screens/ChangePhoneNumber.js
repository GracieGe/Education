import { View, Text, StyleSheet, ScrollView, Image, Alert, TouchableWithoutFeedback, Modal } from 'react-native';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, icons, illustrations } from '../constants';
import Header from '../components/Header';
import { reducer } from '../utils/reducers/formReducers';
import { validateInput } from '../utils/actions/formActions';
import Input from '../components/Input';
import Button from '../components/Button';
import axios from 'axios';
import config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const isTestMode = true;

const initialState = {
  inputValues: {
    phoneNumber: isTestMode ? '1234567890' : '',
    newPhoneNumber: isTestMode ? '1234567890' : '',
  },
  inputValidities: {
    phoneNumber: false,
    newPhoneNumber: false,
  },
  formIsValid: false,
};

const ChangePhoneNumber = ({ navigation }) => {
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async () => {
    const phoneNumberValid = formState.inputValidities.phoneNumber === null;
    const newPhoneNumberValid = formState.inputValidities.newPhoneNumber === null;
    const isFormValid = phoneNumberValid && newPhoneNumberValid;

    if (!isFormValid) {
      Alert.alert('Invalid input', 'Please fill out all fields correctly.');
      return;
    }

    const userData = {
      newPhoneNumber: formState.inputValues.newPhoneNumber,
    };

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      setIsLoading(true);
      const response = await axios.put(`${config.API_URL}/api/users/update-phone`, userData, {
        headers: {
          'x-auth-token': token,
        },
      });

      setIsLoading(false);
      if (response.status === 200) {
        setModalVisible(true);
      } else {
        throw new Error('Failed to update phone number');
      }
    } catch (err) {
      setIsLoading(false); 
      if (err.response) {
      }
    
      if (err.response && err.response.status === 400 && err.response.data.msg === 'Phone number already exists') {
        Alert.alert('Update Error', 'The new phone number already exists. Please use a different phone number.');
      } else {
        setError(err.message);
        Alert.alert('An error occurred', err.message);
      }
    }
  };

  // Render modal
  const renderModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}>
        <TouchableWithoutFeedback
          onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={[styles.modalSubContainer, { backgroundColor: COLORS.white }]}>
              <Image
                source={illustrations.passwordSuccess}
                resizeMode='contain'
                style={styles.modalIllustration}
              />
              <Text style={[styles.modalTitle, {
                color: COLORS.black
              }]}>Congratulations!</Text>
              <Text style={styles.modalSubtitle}>Your have successfully changed your phone number.</Text>
              <Button
                title="Continue"
                filled
                onPress={() => {
                  setModalVisible(false)
                  navigation.goBack()
                }}
                style={{
                  width: "100%",
                  marginTop: 12
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <Header title="Change Phone Number" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}>
            <Image
              source={illustrations.newPassword}
              resizeMode='contain'
              style={styles.success}
            />
          </View>
          <Text style={[styles.title, { color: COLORS.black }]}>Reset Phone Number</Text>
          <Input
            id="phoneNumber"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities['phoneNumber']}
            placeholder="Old Phone Number"
            placeholderTextColor={COLORS.black}
            icon={icons.telephone}
            keyboardType="phone-pad"
          />
          <Input
            id="newPhoneNumber"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities['newPhoneNumber']}
            placeholder="New Phone Number"
            placeholderTextColor={COLORS.black}
            icon={icons.telephone}
            keyboardType="phone-pad"
          />
          <View>
          </View>
        </ScrollView>
        <Button
          title="Continue"
          filled
          onPress={handleSubmit}
          style={styles.button}
          isLoading={isLoading}
        />
        {renderModal()}
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
  success: {
    width: SIZES.width * 0.8,
    height: 250
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 52
  },
  title: {
    fontSize: 18,
    fontFamily: "Urbanist Medium",
    color: COLORS.black,
    marginVertical: 12
  },
  button: {
    marginVertical: 6,
    width: SIZES.width - 32,
    borderRadius: 30
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "Urbanist Bold",
    color: COLORS.primary,
    textAlign: "center",
    marginVertical: 12
  },
  modalSubtitle: {
    fontSize: 16,
    fontFamily: "Urbanist Regular",
    color: COLORS.greyscale600,
    textAlign: "center",
    marginVertical: 12
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.2)"
  },
  modalSubContainer: {
    height: 494,
    width: SIZES.width * 0.9,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 16
  },
  modalIllustration: {
    height: 180,
    width: 180,
    marginVertical: 22
  }
})

export default ChangePhoneNumber