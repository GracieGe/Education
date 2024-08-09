import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import Input from '../components/Input'; 
import Button from '../components/Button'; 
import DatePickerModal from '../components/DatePickerModal';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';
import { COLORS, SIZES, FONTS, icons } from '../constants';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import { launchImageLibrary } from 'react-native-image-picker';

const EditProfile = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [error, setError] = useState();
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          throw new Error('No token found, please login again');
        }

        const response = await axios.get(`${config.API_URL}/api/profiles`, {
          headers: {
            'x-auth-token': token
          }
        });

        const { fullName, gender, age, grade, email, birthday, photo, role } = response.data;
        const imageUri = photo ? { uri: `${config.API_URL}/${photo}` } : icons.userDefault2;
        setImage(imageUri);
        setFullName(fullName);
        setGender(gender);
        setAge(age.toString());
        setGrade(grade);
        setEmail(email);
        const formattedBirthday = birthday.split('T')[0]; 
        setBirthday(formattedBirthday.replace(/-/g, '/')); 
        setRole(role);

      } catch (error) {
        console.error('Error fetching profile data:', error.message);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

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

  const updateProfileHandler = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        throw new Error('No token found, please login again');
      }

      const formattedBirthday = birthday.replace(/\//g, '-');

      const formData = new FormData();
      formData.append('role', role);
      formData.append('fullName', fullName);
      formData.append('gender', gender);
      formData.append('age', age);
      formData.append('email', email);
      formData.append('birthday', formattedBirthday);
      if (role === 'student') {
        formData.append('grade', grade);
      }
      if (image && image.uri && image.type) {
        console.log('Image type:', image.type); 
        formData.append('photo', {
          uri: image.uri,
          type: image.type,
          name: `profile.${image.type.split('/')[1]}`, 
        });
      }

      const response = await axios.put(`${config.API_URL}/api/profiles`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token
        }
      });

      if (response.status === 200) {
        Alert.alert('Congratulations', 'Profile updated successfully');
        navigation.navigate('Profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  const handleOnPressBirthday = () => {
    setOpenStartDatePicker(true);
  };

  const handleDateChange = (date) => {
    setBirthday(date);
    setOpenStartDatePicker(false); 
  };

  const genderOptions = ['Male', 'Female', 'Other'];
  const gradeOptions = ['Senior One', 'Senior Two', 'Senior Three'];

  const handleGenderChange = (value) => {
    setGender(value);
    setShowGenderModal(false);
  };

  const handleGradeChange = (value) => {
    setGrade(value);
    setShowGradeModal(false);
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <Header title="Edit Profile" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ alignItems: "center", marginVertical: 12 }}>
            <View style={styles.avatarContainer}>
              <Image
                source={image}
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
            <Text style={styles.label}>Full Name</Text>
            <Input
              value={fullName}
              onInputChanged={(id, value) => setFullName(value)}
              placeholderTextColor={COLORS.black}
            />
            <Text style={styles.label}>Age</Text>
            <Input
              value={age}
              onInputChanged={(id, value) => setAge(value)}
              placeholderTextColor={COLORS.black}
            />
            <Text style={styles.label}>Email</Text>
            <Input
              value={email}
              onInputChanged={(id, value) => setEmail(value)}
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
                <Text style={{ ...FONTS.body4, color: COLORS.black }}>{birthday || ''}</Text>
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
                <Text style={{ ...FONTS.body4, color: COLORS.black }}>{gender || ''}</Text>
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
                    <Text style={{ ...FONTS.body4, color: COLORS.black }}>{grade || ''}</Text>
                    <Feather name="chevron-down" size={24} color={COLORS.grayscale400} />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </ScrollView>
        <View style={styles.bottomSpacing} />
        <Button
          title="Update"
          filled
          style={styles.updateButton}
          onPress={updateProfileHandler}
        />
      </View>
      <DatePickerModal
        open={openStartDatePicker} 
        selectedDate={birthday}
        onClose={() => setOpenStartDatePicker(false)} 
        onChangeStartDate={handleDateChange} 
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
  label: {
    ...FONTS.body4,
    color: COLORS.black,
    marginBottom: 4,
    marginTop: 8,
    paddingLeft: 4,
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
  updateButton: {
    width: SIZES.width - 32,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
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

export default EditProfile;