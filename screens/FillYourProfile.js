import { View, Text, StyleSheet, ScrollView, Alert, Image, TouchableOpacity, Modal, TouchableWithoutFeedback, FlatList, TextInput } from 'react-native';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { COLORS, SIZES, FONTS, icons } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { reducer } from '../utils/reducers/formReducers';
import { validateInput } from '../utils/actions/formActions';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import { launchImageLibrary } from 'react-native-image-picker';
import Input from '../components/Input';
import { getFormatedDate } from "react-native-modern-datepicker";
import DatePickerModal from '../components/DatePickerModal';
import Button from '../components/Button';
import RNPickerSelect from 'react-native-picker-select';

const isTestMode = true;

const initialState = {
  inputValues: {
    fullName: '',
    gender: '',
    age: '',
    grade: '',
    phoneNumber: '',
    birthday: '',
  },
  inputValidities: {
    fullName: false,
    gender: false,
    age: false,
    grade: false,
    phoneNumber: false,
    birthday: false, 
  },
  formIsValid: false,
}

const FillYourProfile = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [error, setError] = useState();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);

  const today = new Date();
  const startDate = getFormatedDate(
    new Date(today.setDate(today.getDate() + 1)),
    "YYYY/MM/DD"
  );

  const [birthday, setBirthday] = useState('');

  const handleOnPressBirthday = () => {
    setOpenStartDatePicker(true);
  };

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue)
      dispatchFormState({ type: 'FORM_INPUT_UPDATE', inputId, validationResult: result, inputValue }) 
    },
    [dispatchFormState]
  )

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred', error)
    }
  }, [error])

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
        setImage({ uri: imageUri });
      }
    });
  };

  // fetch codes from rescountries api
  useEffect(() => {
    fetch("https://restcountries.com/v2/all")
      .then(response => response.json())
      .then(data => {
        let areaData = data.map((item) => {
          return {
            code: item.alpha2Code,
            item: item.name,
            callingCode: `+${item.callingCodes[0]}`,
            flag: `https://flagsapi.com/${item.alpha2Code}/flat/64.png`
          }
        });

        setAreas(areaData);
        if (areaData.length > 0) {
          let defaultData = areaData.filter((a) => a.code == "US");

          if (defaultData.length > 0) {
            setSelectedArea(defaultData[0])
          }
        }
      })
  }, [])

  // render countries codes modal
  function RenderAreasCodesModal() {
    const renderItem = ({ item }) => {
      return (
        <TouchableOpacity
          style={{
            padding: 10,
            flexDirection: "row"
          }}
          onPress={() => {
            setSelectedArea(item),
              setModalVisible(false)
          }}
        >
          <Image
            source={{ uri: item.flag }}
            style={{
              height: 30,
              width: 30,
              marginRight: 10
            }}
          />
          <Text style={{ fontSize: 16, color: "#fff" }}>{item.item}</Text>
        </TouchableOpacity>
      )
    }
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <TouchableWithoutFeedback
          onPress={() => setModalVisible(false)}
        >
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <View
              style={{
                height: SIZES.height,
                width: SIZES.width,
                backgroundColor: COLORS.primary,
                borderRadius: 12
              }}
            >
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeBtn}>
                <Ionicons name="close-outline" size={24} color={COLORS.primary} />
              </TouchableOpacity>
              <FlatList
                data={areas}
                renderItem={renderItem}
                horizontal={false}
                keyExtractor={(item) => item.code}
                style={{
                  padding: 20,
                  marginBottom: 20
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
              placeholderTextColor={COLORS.gray} />
            <RNPickerSelect
              onValueChange={(value) => inputChangedHandler('gender', value)}
              items={[
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' },
                { label: 'Other', value: 'other' },
              ]}
              style={pickerSelectStyles}
              placeholder={{
                label: 'Gender',
                value: null,
                color: COLORS.gray,
              }}
            />
            <TouchableOpacity
              style={[styles.inputBtn, styles.inputContainer]} 
              onPress={handleOnPressBirthday}
            >
              <Text style={{ ...FONTS.body4, color: COLORS.grayscale400 }}>
                {birthday || 'Birthday'}
              </Text>
              <Feather name="calendar" size={24} color={COLORS.grayscale400} />
            </TouchableOpacity>
            <Input
              id="age"
              onInputChanged={inputChangedHandler}
              errorText={formState.inputValidities['age']}
              placeholder="Age"
              placeholderTextColor={COLORS.gray} 
              style={styles.inputContainer}  
            /> 
            <View style={[styles.inputContainer, {
              backgroundColor: COLORS.greyscale500,
              borderColor: COLORS.greyscale500,
            }]}>
              <TouchableOpacity
                style={styles.selectFlagContainer}
                onPress={() => setModalVisible(true)}>
                <View style={{ justifyContent: "center" }}>
                  <Image
                    source={icons.down}
                    resizeMode='contain'
                    style={styles.downIcon}
                  />
                </View>
                <View style={{ justifyContent: "center", marginLeft: 5 }}>
                  <Image
                    source={{ uri: selectedArea?.flag }}
                    style={styles.flagIcon}
                  />
                </View>
                <View style={{ justifyContent: "center", marginLeft: 5 }}>
                  <Text style={{ color: "#111", fontSize: 12 }}>{selectedArea?.callingCode}</Text>
                </View>
              </TouchableOpacity>
              {/* Phone Number Text Input */}
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                placeholderTextColor={COLORS.gray}
                selectionColor="#111"
                keyboardType="numeric"
                onChangeText={(text) => inputChangedHandler('phoneNumber', text)}
              />
            </View>
            <RNPickerSelect
              onValueChange={(value) => inputChangedHandler('grade', value)}
              items={[
                { label: 'Senior One', value: 'senior one' },
                { label: 'Senior Two', value: 'senior two' },
                { label: 'Senior Three', value: 'senior three' },
              ]}
              style={pickerSelectStyles}
              placeholder={{
                label: 'Grade',
                value: null,
                color: COLORS.gray,
              }}
            />
          </View>
        </ScrollView>
      </View>
      <DatePickerModal
        open={openStartDatePicker}
        startDate={startDate}
        selectedDate={birthday}
        onClose={() => setOpenStartDatePicker(false)}
        onChangeStartDate={(date) => {
          setBirthday(date);
          inputChangedHandler('birthday', date);
        }}
      />
      {RenderAreasCodesModal()}
      <View style={styles.bottomContainer}>
        <Button
          title="Continue"
          filled
          style={styles.continueButton}
          onPress={() => navigation.navigate("Home")}
        />
      </View>
    </SafeAreaView>
  )
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
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
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    marginVertical: 12,
    backgroundColor: COLORS.greyscale500,
  },
});

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
})

export default FillYourProfile;