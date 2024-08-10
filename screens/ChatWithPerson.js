import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS, icons, images } from '../constants';
import axios from 'axios';
import config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatWithPerson = ({ navigation, route }) => {
  const { conversationId, teacherId, fullName } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentConversationId, setCurrentConversationId] = useState(conversationId);

  useEffect(() => {
    if (currentConversationId) {
      fetchMessages(currentConversationId);
    }
  }, [currentConversationId]);

  const fetchMessages = async (convId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      console.log('Fetching messages for conversation ID:', convId);
      const response = await axios.get(`${config.API_URL}/api/conversations/${convId}/messages`, {
        headers: {
          'x-auth-token': token,
        },
      });

      console.log('Messages fetched:', response.data);
      setMessages(response.data.map(msg => ({
        _id: msg.messageId,
        text: msg.text,
        createdAt: new Date(msg.created_at),
        user: {
          _id: msg.senderId,
        },
      })));
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const submitHandler = async () => {
    if (inputMessage.trim().length > 0) {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        console.log('Sending message:', inputMessage);

        // 如果没有会话ID，先创建一个会话
        if (!currentConversationId) {
          console.log('No conversation ID, creating new conversation...');
          const createConversationResponse = await axios.post(`${config.API_URL}/api/conversations`, { teacherId }, {
            headers: {
              'x-auth-token': token,
            },
          });
          const newConversationId = createConversationResponse.data.conversationId;
          console.log('New conversation created with ID:', newConversationId);
          setCurrentConversationId(newConversationId);
          await fetchMessages(newConversationId);
        }

        const newMessage = {
          conversationId: currentConversationId || createConversationResponse.data.conversationId,
          text: inputMessage,
        };

        const response = await axios.post(`${config.API_URL}/api/conversations/${currentConversationId || createConversationResponse.data.conversationId}/messages`, newMessage, {
          headers: {
            'x-auth-token': token,
          },
        });

        console.log('Message sent:', response.data);
        const message = {
          _id: response.data.messageId,
          text: inputMessage,
          createdAt: new Date(),
          user: { _id: response.data.senderId }, // 使用后端返回的senderId
        };

        setMessages((previousMessages) => GiftedChat.append(previousMessages, [message]));
        setInputMessage("");
      } catch (err) {
        console.error('Error sending message:', err);
      }
    }
  };

  const renderMessage = (props) => {
    const { currentMessage } = props;

    return (
      <View style={{ flex: 1, flexDirection: currentMessage.user._id === currentMessage.user._id ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
        {currentMessage.user._id !== currentMessage.user._id && (
          <Image
            source={images.avatar}
            style={{ width: 40, height: 40, borderRadius: 20, marginLeft: 8 }}
          />
        )}
        <Bubble
          {...props}
          wrapperStyle={{
            left: {
              backgroundColor: COLORS.secondary,
              marginLeft: 12,
            },
            right: {
              backgroundColor: COLORS.primary,
              marginRight: 12,
            },
          }}
          textStyle={{
            left: {
              color: COLORS.white,
            },
            right: {
              color: COLORS.white,
            },
          }}
        />
      </View>
    );
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
            <Text style={[styles.headerTitle, { color: COLORS.greyscale900 }]}>{fullName}</Text>
          </View>
        </View>
        <View style={styles.chatContainer}>
          <GiftedChat
            messages={messages}
            renderInputToolbar={() => { }}
            user={{ _id: currentConversationId }} 
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
              onChangeText={setInputMessage}
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