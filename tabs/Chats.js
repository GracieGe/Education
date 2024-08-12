import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS, SIZES, icons } from '../constants';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

const Chats = () => {
    const navigation = useNavigation();
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
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

                console.log('Fetched Conversations:', response.data);
                setConversations(response.data);  
            } catch (error) {
                console.error('Error fetching conversations:', error);
            }
        };

        fetchConversations();
    }, []);

    const renderItem = ({ item, index }) => {
        console.log("Rendering item:", item);  // 日志显示每个 item 的内容
    
        return (
            <TouchableOpacity
                key={index}
                onPress={() =>
                    navigation.navigate('Chat', {
                        userName: item.name,  // 使用 fullName 字段
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
                            {item.messageTime}
                        </Text>  
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
    iconBtnContainer: {
        height: 40,
        width: 40,
        borderRadius: 999,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center"
    },
    notiContainer: {
        alignItems: "center",
        justifyContent: "center",
        height: 16,
        width: 16,
        borderRadius: 999,
        backgroundColor: COLORS.red,
        position: "absolute",
        top: 1,
        right: 1,
        zIndex: 999,
    },
    notiText: {
        fontSize: 10,
        color: COLORS.white,
        fontFamily: "Urbanist Medium"
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: "Urbanist Bold",
        color: COLORS.black
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        height: 50,
        marginVertical: 22,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    searchInput: {
        width: '100%',
        height: '100%',
        marginHorizontal: 12,
    },
    flatListContainer: {
        paddingBottom: 100,
    },
    userContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: COLORS.secondaryWhite,
        borderBottomWidth: 1,
    },
    oddBackground: {
        backgroundColor: COLORS.tertiaryWhite,
    },
    userImageContainer: {
        paddingVertical: 15,
        marginRight: 22,
    },
    onlineIndicator: {
        height: 14,
        width: 14,
        borderRadius: 7,
        backgroundColor: COLORS.primary,
        borderColor: COLORS.white,
        borderWidth: 2,
        position: 'absolute',
        top: 14,
        right: 2,
        zIndex: 1000,
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
    messageInQueue: {
        fontSize: 12,
        fontFamily: "Urbanist Regular",
        color: COLORS.white
    }
});

export default Chats