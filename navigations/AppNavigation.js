import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { AboutUs, AddNewAddress, Address, AddressForTeacher, ViewSlots, SubmitSlots, ChangePhoneNumber, ChangePassword, ChatWithPerson, CheckoutOrders, CustomerService, AllCourses, TeacherDetails, BookSlots, EditProfile, FillYourProfile, EditAddress, CourseDetails, CourseDescription, CourseDetailsAddItem, Login, PaymentMethods, AllTeacherProfiles, Search, CompletePayment, SettingsLanguage, PurchaseHistory, SettingsPrivacyPolicy, SettingsSecurity, Signup, SelectTeachers } from '../screens';
import BottomTabNavigation from './BottomTabNavigation';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkIfFirstLaunch = async () => {
            try {
                const value = await AsyncStorage.getItem('alreadyLaunched')
                if (value === null) {
                    await AsyncStorage.setItem('alreadyLaunched', 'true')
                    setIsFirstLaunch(true)
                } else {
                    setIsFirstLaunch(false)
                }
            } catch (error) {
                setIsFirstLaunch(false)
            }
            setIsLoading(false) // Set loading state to false once the check is complete
        }

        checkIfFirstLaunch()
    }, [])

    if (isLoading) {
        return null // Render a loader or any other loading state component
    }

  return (
    <NavigationContainer>
            <Stack.Navigator 
              initialRouteName={isFirstLaunch ? 'Signup' : 'Login'}
              screenOptions={{ headerShown: false }}
              // replace the second onboaring1 with login in order to make the user not to see the onboarding 
              // when login the next time
            >
                <Stack.Screen name="Login" component={Login}/>
                <Stack.Screen name="Signup" component={Signup}/>
                <Stack.Screen name="FillYourProfile" component={FillYourProfile}/>
                <Stack.Screen name="EditAddress" component={EditAddress}/>
                <Stack.Screen name="Main" component={BottomTabNavigation}/>
                <Stack.Screen name="EditProfile" component={EditProfile}/>
                <Stack.Screen name='PurchaseHistory' component={PurchaseHistory}/>
                <Stack.Screen name="SettingsSecurity" component={SettingsSecurity}/>
                <Stack.Screen name="ChangePassword" component={ChangePassword}/>
                <Stack.Screen name="ChangePhoneNumber" component={ChangePhoneNumber}/>
                <Stack.Screen name="SettingsLanguage" component={SettingsLanguage}/>
                <Stack.Screen name="SettingsPrivacyPolicy" component={SettingsPrivacyPolicy}/>
                <Stack.Screen name="CustomerService" component={CustomerService}/>
                <Stack.Screen name="BookSlots" component={BookSlots}/>
                <Stack.Screen name="Search" component={Search}/>
                <Stack.Screen name="PaymentMethods" component={PaymentMethods}/>
                <Stack.Screen name="Address" component={Address}/>
                <Stack.Screen name="AddNewAddress" component={AddNewAddress}/>
                <Stack.Screen name="AllCourses" component={AllCourses}/>
                <Stack.Screen name="AllTeacherProfiles" component={AllTeacherProfiles}/>
                <Stack.Screen name="AddressForTeacher" component={AddressForTeacher}/>
                <Stack.Screen name="ViewSlots" component={ViewSlots}/>
                <Stack.Screen name="SubmitSlots" component={SubmitSlots}/>
                <Stack.Screen name="CourseDetails" component={CourseDetails}/>
                <Stack.Screen name="CourseDescription" component={CourseDescription}/>
                <Stack.Screen name="CourseDetailsAddItem" component={CourseDetailsAddItem}/>
                <Stack.Screen name="CheckoutOrders" component={CheckoutOrders}/>
                <Stack.Screen name="CompletePayment" component={CompletePayment}/>
                <Stack.Screen name="TeacherDetails" component={TeacherDetails}/>
                <Stack.Screen name="ChatWithPerson" component={ChatWithPerson}/>
                <Stack.Screen name="SelectTeachers" component={SelectTeachers}/>
                <Stack.Screen name="AboutUs" component={AboutUs}/>
              </Stack.Navigator> 
     </NavigationContainer>
  )
}

export default AppNavigation