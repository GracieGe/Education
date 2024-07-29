import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SIZES, COLORS } from '../constants';
import { commonStyles } from '../styles/CommonStyles';
import Input from '../components/Input';
import Button from '../components/Button';
import Header from '../components/Header';

const EditAddress = ({ navigation }) => {
  const [address, setAddress] = useState('');
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [addressError, setAddressError] = useState('');

  const handleLabelSelection = (label) => {
    setSelectedLabel(prevLabel => prevLabel === label ? null : label);
  };

  const updateLocationHandler = () => {
    if (address.trim() === '') {
      setAddressError('Address is required');
      return;
    }
    setAddressError('');
    navigation.navigate('Address');
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
            </Text>

            <View style={{ flexDirection: 'row', marginVertical: 13 }}>
              <TouchableOpacity
                style={[
                  styles.checkboxContainer,
                  selectedLabel === 'home' && styles.selectedCheckbox,
                  { borderColor: COLORS.greyscale900 }
                ]}
                onPress={() => handleLabelSelection('home')}>
                <Text
                  style={[
                    selectedLabel === 'home' && styles.checkboxText,
                    { color: selectedLabel === 'home' ? COLORS.white : COLORS.primary }
                  ]}>
                  Home
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.checkboxContainer,
                  selectedLabel === 'work' && styles.selectedCheckbox,
                  { borderColor: COLORS.greyscale900 }
                ]}
                onPress={() => handleLabelSelection('work')}>
                <Text
                  style={[
                    selectedLabel === 'work' && styles.checkboxText,
                    { color: selectedLabel === 'work' ? COLORS.white : COLORS.primary }
                  ]}
                >
                  Work
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.checkboxContainer,
                  selectedLabel === 'other' && styles.selectedCheckbox,
                  { borderColor: COLORS.greyscale900 }
                ]}
                onPress={() => handleLabelSelection('other')}
              >
                <Text
                  style={[
                    selectedLabel === 'other' && styles.checkboxText,
                    { color: selectedLabel === 'other' ? COLORS.white : COLORS.greyscale900 }
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