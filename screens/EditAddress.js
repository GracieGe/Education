import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SIZES, COLORS } from '../constants';
import { commonStyles } from '../styles/CommonStyles';
import Input from '../components/Input';
import Button from '../components/Button';
import Header from '../components/Header';
import axios from 'axios';
import config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditAddress = ({ route, navigation }) => {
  const { addressId, teacherId, fullName } = route.params;
  const [address, setAddress] = useState('');
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [addressError, setAddressError] = useState('');
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAddressData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          throw new Error('No token found, please login again');
        }

        const response = await axios.get(`${config.API_URL}/api/addresses/${addressId}`, {
          headers: {
            'x-auth-token': token
          }
        });

        const { address, label } = response.data;
        setAddress(address);
        setSelectedLabel(label);
      } catch (error) {
        console.error('Error fetching address data:', error);
        setError('Failed to load address data');
      } finally {
        setLoading(false);
      }
    };

    fetchAddressData();
  }, [addressId]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  const handleLabelSelection = (label) => {
    setSelectedLabel(prevLabel => prevLabel === label ? null : label);
  };

  const updateLocationHandler = async () => {
    if (address.trim() === '') {
      setAddressError('Address is required');
      return;
    }

    if (!selectedLabel) {
      Alert.alert('Incomplete Form', 'Please select a label for the address');
      return;
    }

    setAddressError('');

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found, please login again');
      }

      const response = await axios.put(`${config.API_URL}/api/addresses/${addressId}`, {
        address,
        label: selectedLabel
      }, {
        headers: {
          'x-auth-token': token
        }
      });

      if (response.status === 200) {
        Alert.alert('Congratulations', 'Address updated successfully');
        navigation.navigate('Address', {teacherId, fullName});
      }
    } catch (error) {
      console.error('Error updating address:', error);
      Alert.alert('Error', 'Failed to update address');
    }
  };

  return (
    <SafeAreaView style={styles.area}>
      <StatusBar hidden={false} />
      <View style={styles.container}>
        <Header title="Edit Address" />
        <View style={styles.contentContainer}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ marginVertical: 0 }}>
              <View style={styles.inputContainer}>
                <Text style={[commonStyles.inputHeader, { color: COLORS.greyscale900 }]}>
                  Address
                  <Text style={styles.required}> *</Text>
                </Text>
                <Input
                  id="address1"
                  value={address}
                  onInputChanged={(id, text) => setAddress(text)}
                  placeholder=""
                  placeholderTextColor={COLORS.black}
                />
                {addressError ? <Text style={styles.errorText}>{addressError}</Text> : null}
              </View>
            </View>
          </View>
          <View>
            <Text style={[commonStyles.inputHeader, { color: COLORS.greyscale900 }]}>
              Label
              <Text style={styles.required}> *</Text>
            </Text>

            <View style={{ flexDirection: 'row', marginVertical: 13 }}>
              <TouchableOpacity
                style={[
                  styles.checkboxContainer,
                  selectedLabel === 'Home' && styles.selectedCheckbox,
                  { borderColor: COLORS.greyscale900 }
                ]}
                onPress={() => handleLabelSelection('Home')}>
                <Text
                  style={[
                    selectedLabel === 'Home' && styles.checkboxText,
                    { color: selectedLabel === 'Home' ? COLORS.white : COLORS.primary }
                  ]}>
                  Home
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.checkboxContainer,
                  selectedLabel === 'Work' && styles.selectedCheckbox,
                  { borderColor: COLORS.greyscale900 }
                ]}
                onPress={() => handleLabelSelection('Work')}>
                <Text
                  style={[
                    selectedLabel === 'Work' && styles.checkboxText,
                    { color: selectedLabel === 'Work' ? COLORS.white : COLORS.primary }
                  ]}
                >
                  Work
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.checkboxContainer,
                  selectedLabel === 'Other' && styles.selectedCheckbox,
                  { borderColor: COLORS.greyscale900 }
                ]}
                onPress={() => handleLabelSelection('Other')}
              >
                <Text
                  style={[
                    selectedLabel === 'Other' && styles.checkboxText,
                    { color: selectedLabel === 'Other' ? COLORS.white : COLORS.greyscale900 }
                  ]}
                >
                  Other
                </Text>
              </TouchableOpacity>
            </View>
            <Button
              filled
              title="UPDATE LOCATION"
              onPress={updateLocationHandler}
              style={{ borderRadius: 30 }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
  },
  contentContainer: {
    paddingHorizontal: 0,
    paddingVertical: 16,
  },
  inputContainer: {
    marginTop: 12,
    width: SIZES.width - 32,
    alignSelf: 'center',
  },
  checkboxContainer: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginBottom: 12,
  },
  selectedCheckbox: {
    backgroundColor: COLORS.primary,
  },
  checkboxText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "Urbanist Regular",
  },
  required: {
    color: 'red',
    fontSize: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
})

export default EditAddress;