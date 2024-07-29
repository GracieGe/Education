import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SIZES, COLORS } from '../constants';
import { commonStyles } from '../styles/CommonStyles';
import Input from '../components/Input';
import Button from '../components/Button';
import Header from '../components/Header';

const EditAddress = ({ navigation }) => {
  const [address1, setAddress1] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [address2, setAddress2] = useState('');
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [address1Error, setAddress1Error] = useState('');

  const handleLabelSelection = (label) => {
    setSelectedLabel(prevLabel => prevLabel === label ? null : label);
  };

  const updateLocationHandler = () => {
    if (address1.trim() === '') {
      setAddress1Error('Address 1 is required');
      return;
    }
    setAddress1Error('');
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
                  Address 1
                  <Text style={styles.required}> *</Text>
                </Text>
                <Input
                  id="address1"
                  value={address1}
                  onInputChanged={(id, text) => setAddress1(text)}
                  placeholder=""
                  placeholderTextColor={COLORS.black}
                />
                {address1Error ? <Text style={styles.errorText}>{address1Error}</Text> : null}
              </View>

              <View style={styles.inputContainer}>
                <Text style={[commonStyles.inputHeader, { color: COLORS.greyscale900 }]}>
                  Address 2
                </Text>
                <Input
                  id="address2"
                  value={address2}
                  onInputChanged={(id, text) => setAddress2(text)}
                  placeholder=""
                  placeholderTextColor={COLORS.black}
                />
              </View>
              <View style={styles.rowContainer}>
                <View style={styles.halfWidthInput}>
                  <Text style={[commonStyles.inputHeader, { color: COLORS.greyscale900 }]}>
                    City
                  </Text>
                  <Input
                    id="city"
                    value={city}
                    onInputChanged={(id, text) => setCity(text)}
                    placeholder=""
                    placeholderTextColor={COLORS.black}
                  />
                </View>
                <View style={styles.halfWidthInput}>
                  <Text style={[commonStyles.inputHeader, { color: COLORS.greyscale900 }]}>
                    Post Code
                  </Text>
                  <Input
                    id="postalCode"
                    value={postalCode}
                    onInputChanged={(id, text) => setPostalCode(text)}
                    placeholder=""
                    placeholderTextColor={COLORS.black}
                  />
                </View>
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
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    width: SIZES.width - 32, 
    alignSelf: 'center',
  },
  halfWidthInput: {
    width: (SIZES.width - 32) / 2 - 10,
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