import { View, Platform, Image, Text } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS, FONTS, icons } from '../constants';
import { Home, Inbox, Orders, Profile, Course } from '../screens';
import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator()

const BottomTabNavigation = () => {
    const { t } = useTranslation();

    return (
        <Tab.Navigator screenOptions={{
            tabBarShowLabel: false,
            headerShown: false,
            tabBarStyle: {
                position: 'absolute',
                justifyContent: "center",
                bottom: 0,
                right: 0,
                left: 0,
                elevation: 0,
                height: Platform.OS === 'ios' ? 90 : 60,
                backgroundColor: COLORS.white,
                borderTopColor: "transparent",
            },
        }}>
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: "center" }}>
                                <Image
                                    source={focused ? icons.home : icons.home2Outline}
                                    resizeMode='contain'
                                    style={{
                                        height: 24,
                                        width: 24,
                                        tintColor: focused ? COLORS.primary : COLORS.gray3,
                                    }}
                                />
                                <Text style={{
                                    ...FONTS.body4,
                                    color: focused ? COLORS.primary : COLORS.gray3,
                                }}>{t('home')}</Text>
                            </View>
                        )
                    },
                }}
            />

            <Tab.Screen
                name="Course"
                component={Course}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: "center" }}>
                                <Image
                                    source={focused ? icons.wallet2 : icons.wallet2Outline}
                                    resizeMode='contain'
                                    style={{
                                        height: 24,
                                        width: 24,
                                        tintColor: focused ? COLORS.primary : COLORS.gray3,
                                    }}
                                />
                                <Text style={{
                                    ...FONTS.body4,
                                    color: focused ? COLORS.primary : COLORS.gray3,
                                }}>{t('course')}</Text>
                            </View>
                        )
                    },
                }}
            />
            <Tab.Screen
                name="Orders"
                component={Orders}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: "center" }}>
                                <Image
                                    source={focused ? icons.document : icons.documentOutline}
                                    resizeMode='contain'
                                    style={{
                                        height: 24,
                                        width: 24,
                                        tintColor: focused ? COLORS.primary : COLORS.gray3,
                                    }}
                                />
                                <Text style={{
                                    ...FONTS.body4,
                                    color: focused ? COLORS.primary : COLORS.gray3,
                                }}>{t('session')}</Text>
                            </View>
                        )
                    },
                }}
            />

            <Tab.Screen
                name="Inbox"
                component={Inbox}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: "center" }}>
                                <Image
                                    source={focused ? icons.chatBubble2 : icons.chatBubble2Outline}
                                    resizeMode='contain'
                                    style={{
                                        height: 24,
                                        width: 24,
                                        tintColor: focused ? COLORS.primary : COLORS.gray3,
                                    }}
                                />
                                <Text style={{
                                    ...FONTS.body4,
                                    color: focused ? COLORS.primary : COLORS.gray3,
                                }}>{t('chat')}</Text>
                            </View>
                        )
                    },
                }}
            />

            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: "center" }}>
                                <Image
                                    source={focused ? icons.user : icons.userOutline}
                                    resizeMode='contain'
                                    style={{
                                        height: 24,
                                        width: 24,
                                        tintColor: focused ? COLORS.primary : COLORS.gray3,
                                    }}
                                />
                                <Text style={{
                                    ...FONTS.body4,
                                    color: focused ? COLORS.primary :  COLORS.gray3,
                                }}>{t('profile')}</Text>
                            </View>
                        )
                    },
                }}
            />
        </Tab.Navigator>
    )
}

export default BottomTabNavigation