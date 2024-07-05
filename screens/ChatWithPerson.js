import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS, icons, images } from '../constants';

const ChatWithPerson = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleInputText = (text) => {
    setInputMessage(text);
  };

  const renderMessage = (props) => {
    const { currentMessage } = props;

    if (currentMessage.user._id === 1) {
      return (
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor: COLORS.primary,
                marginRight: 12,
                marginVertical: 12,
              },
            }}
            textStyle={{
              right: {
                color: COLORS.white,
              },
            }}
          />
        </View>
      )
    } else {
      return (
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
          <Image
            source={images.avatar}
            style={{ width: 40, height: 40, borderRadius: 20, marginLeft: 8 }}
          />
          <Bubble
            {...props}
            wrapperStyle={{
              left: {
                backgroundColor: COLORS.secondary,
                marginLeft: 12,
              },
            }}
            textStyle={{
              left: {
                color: COLORS.white,
              },
            }}
          />
        </View>
      )
    }

    return <Bubble {...props} />
  }

  const submitHandler = () => {
    if (inputMessage.trim().length > 0) {
      const message = {
        _id: Math.random().toString(36).substring(7),
        text: inputMessage,
        createdAt: new Date(),
        user: { _id: 1 },
      };
      setMessages((previousMessage) => GiftedChat.append(previousMessage, [message]));
      setInputMessage("");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={true} />
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={icons.arrowLeft}
                resizeMode="contain"
                style={[styles.headerIcon, { tintColor: COLORS.greyscale900 }]}
              />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: COLORS.greyscale900 }]}>Yang Liu</Text>
          </View>
        </View>
        <View style={styles.chatContainer}>
          <GiftedChat
            messages={messages}
            renderInputToolbar={() => { }}
            user={{ _id: 1 }}
            minInputToolbarHeight={0}
            renderMessage={renderMessage}
          />
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.inputContainer}
        >
          <View style={[styles.inputMessageContainer, { backgroundColor: COLORS.grayscale100 }]}>
            <TextInput
              style={styles.input}
              value={inputMessage}
              onChangeText={handleInputText}
              placeholderTextColor={COLORS.grayscale700}
              placeholder="Enter your message..."
              onSubmitEditing={submitHandler}
              returnKeyType="send"
            />
            <View style={styles.attachmentIconContainer}>
              <TouchableOpacity>
                <Feather name="image" size={24} color={COLORS.gray} />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.sendContainer} onPress={submitHandler}>
            <MaterialCommunityIcons name="send" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.black,
    marginLeft: 22,
  },
  headerIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
  },
  chatContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  inputMessageContainer: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 10,
    backgroundColor: COLORS.grayscale100,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  attachmentIconContainer: {
    marginRight: 12,
  },
  input: {
    color: COLORS.blue2,
    flex: 1,
    paddingHorizontal: 10,
  },
  sendContainer: {
    height: 48,
    width: 48,
    borderRadius: 49,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
});

export default ChatWithPerson;