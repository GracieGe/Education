import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { COLORS, SIZES, icons } from '../constants';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

const Chats = () => {
    const navigation = useNavigation();
    const [conversations, setConversations] = useState([]);
    const formatDateTime = (isoString) => {
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
      };

    const fetchConversations = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await axios.get(`${config.API_URL}/api/conversations/all`, {
                headers: {
                    'x-auth-token': token,
                },
            });

            setConversations(response.data);  
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchConversations();
        }, [])
    );


    const renderItem = ({ item, index }) => {
    
        return (
            <TouchableOpacity
                key={index}
                onPress={() =>
                    navigation.navigate('ChatWithPerson', {
                        conversationId: item.conversationId,  
                        teacherId: item.teacherId,  
                        fullName: item.name,  
                    })
                }
                style={[
                    styles.userContainer, {
                        borderBottomWidth: 1,
                    },
                    index % 2 !== 0 ? {
                        backgroundColor: COLORS.tertiaryWhite,
                        borderBottomWidth: 1,
                        borderTopWidth: 0
                    } : null,
                ]}>
                <View style={styles.userImageContainer}>
                    <Image
                        source={item.photo ? { uri: `${config.API_URL}${item.photo}` } : icons.userDefault2}
                        resizeMode="contain"
                        style={styles.userImage}
                    />
                </View>
                <View style={{ flexDirection: "row", width: SIZES.width - 104 }}>
                    <View style={styles.userInfoContainer}>
                        <Text style={[styles.userName, {
                            color: COLORS.black
                        }]}>{item.name || "No Name"}</Text>  
                        <Text style={styles.lastSeen}>{item.latestMessage || "No Message"}</Text>  
                    </View>
                    <View style={{
                        position: "absolute",
                        right: 4,
                        alignItems: "center"
                    }}>
                        <Text style={[styles.lastMessageTime, {
                            color: COLORS.black
                        }]}>
                            {formatDateTime(item.messageTime)}
                        </Text>
                        {item.unreadCount > 0 && (
                          <View style={styles.unreadCountContainer}>
                            <Text style={styles.unreadCountText}>{item.unreadCount}</Text>
                          </View>
                        )}  
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View>
            <FlatList
                data={conversations}
                showsVerticalScrollIndicator={false}
                renderItem={renderItem}
                keyExtractor={(item) => item.conversationId.toString()} 
            />
        </View>
    )
}

const styles = StyleSheet.create({
    userContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: COLORS.secondaryWhite,
        borderBottomWidth: 1,
    },
    userImageContainer: {
        paddingVertical: 15,
        marginRight: 22,
    },
    userImage: {
        height: 50,
        width: 50,
        borderRadius: 25,
    },
    userInfoContainer: {
        flexDirection: 'column',
    },
    userName: {
        fontSize: 14,
        color: COLORS.black,
        fontFamily: "Urbanist Bold",
        marginBottom: 4,
    },
    lastSeen: {
        fontSize: 14,
        color: "gray",
    },
    lastMessageTime: {
        fontSize: 12,
        fontFamily: "Urbanist Regular"
    },
    unreadCountContainer: {
        backgroundColor: COLORS.primary,  
        borderRadius: 12,  
        width: 20,  
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,  
    },
    unreadCountText: {
        color: COLORS.white,  
        fontSize: 12,
        fontFamily: "Urbanist Bold",
    },
});

export default Chats