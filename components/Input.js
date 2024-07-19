import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../constants';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Input = (props) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(props.secureTextEntry);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const onChangeText = (text) => {
    props.onInputChanged(props.id, text);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={[styles.container]}>
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: isFocused ? COLORS.primary :  COLORS.greyscale500,
            backgroundColor: isFocused ? COLORS.tansparentPrimary : COLORS.greyscale500,
          },
        ]}
      >
        {props.icon && (
          <Image
            source={props.icon}
            style={[
              styles.icon,
              {
                tintColor: isFocused ? COLORS.primary : '#BCBCBC'
              }
            ]}
          />
        )}
        <TextInput
          {...props}
          secureTextEntry={isPasswordVisible && props.secureTextEntry}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[styles.input, { color: COLORS.black }]}
          placeholder={props.placeholder}
          placeholderTextColor={props.placeholderTextColor}
          autoCapitalize='none'
        />
        {props.secureTextEntry && (
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIconContainer}>
            <FontAwesome
              name={isPasswordVisible ? 'eye-slash' : 'eye'}
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        )}
      </View>
      {props.errorText && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding2,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 5,
    flexDirection: 'row',
    height: 52,
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
    height: 20,
    width: 20,
    tintColor: '#BCBCBC',
  },
  input: {
    color: COLORS.black,
    flex: 1,
    fontFamily: "Urbanist Regular",
    fontSize: 14,
    paddingTop: 0,
    paddingBottom: 0,
    textAlignVertical: 'center',
    marginVertical: Platform.OS === 'ios' ? 0 : -2,
  },
  eyeIconContainer: {
    padding: 3,
  },
  eyeIcon: {
    fontSize: 20,
    color: '#808080',
  },
  errorContainer: {
    marginVertical: 4,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});

export default Input;