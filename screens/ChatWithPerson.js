import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GiftedChat, Bubble, Time } from 'react-native-gifted-chat';
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS, icons } from '../constants';
import axios from 'axios';
import config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatWithPerson = ({ navigation, route }) => {
  const { conversationId, teacherId, fullName } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentConversationId, setCurrentConversationId] = useState(conversationId);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${config.API_URL}/api/users/me`, {
        headers: {
          'x-auth-token': token,
        },
      });

      setUserId(response.data.id);  
    };
  
    fetchUserId();
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

      const response = await axios.get(`${config.API_URL}/api/conversations/${convId}/messages`, {
        headers: {
          'x-auth-token': token,
        },
      });

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
    if (!userId) {
      console.error('User ID not set, cannot send message');
      return;
    }

    if (inputMessage.trim().length > 0) {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        // If there is no conversation, create a conversation first
        if (!currentConversationId) {
          const createConversationResponse = await axios.post(`${config.API_URL}/api/conversations`, { teacherId }, {
            headers: {
              'x-auth-token': token,
            },
          });
          const newConversationId = createConversationResponse.data.conversationId;
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

        const message = {
          _id: response.data.messageId,
          text: inputMessage,
          createdAt: new Date(),
          user: { _id: userId }, 
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
      <View style={{ flex: 1, flexDirection: currentMessage.user._id === userId ? 'row-reverse' : 'row', alignItems: 'flex-start', marginBottom: 10, }}>
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: COLORS.primary,
              marginRight: 12,
            },
            left: {
              backgroundColor: COLORS.blue,
              marginLeft: 12,
            },
          }}
          textStyle={{
            right: {
              color: COLORS.white,
            },
            left: {
              color: COLORS.white,
            },
          }}
          timeTextStyle={{
            right: {
              color: COLORS.white,
            },
            left: {
              color: COLORS.white,
            },
          }}
          renderTime={renderTime}
        />
      </View>
    );
  };

  const renderTime = (timeProps) => {
    return (
        <Time
            {...timeProps}
            timeTextStyle={{
                right: { color: COLORS.white },
                left: { color: COLORS.white },
            }}
            timeFormat="YYYY-MM-DD HH:mm" 
        />
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
            user={{ _id: userId }}
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
    color: COLORS.blue,
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