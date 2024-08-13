import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { AboutUs, AddNewAddress, AddNewCard, AddPromo, Address, CancelOrder, CancelOrderPaymentMethods, Categories, CategoryBread, CategoryHamburger, CategoryMeat, CategoryPizza, ChangePhoneNumber, ChangePIN, ChangePassword, Chat, ChatWithPerson, CheckoutOrders, CheckoutOrdersAddress, CheckoutOrdersCompleted, CreateNewPIN, CreateNewPassword, CustomerService, AllCourses, TeacherDetails, BookSlots, EditProfile, EnterYourPIN, Favourite, FillYourProfile, EditAddress, CourseDetails, CourseDescription, CourseDetailsAddItem, FoodDetailsOffers, FoodReviews, ForgotPasswordEmail, ForgotPasswordMethods, ForgotPasswordPhoneNumber, GiveTipForDriver, HelpCenter, InviteFriends, Login, MyCart, Notifications, OTPVerification, Onboarding1, Onboarding2, Onboarding3, Onboarding4, PaymentMethods, RateTheDriver, RateTheRestaurant, AllTeacherProfiles, Search, SearchingDriver, SettingsLanguage, SettingsNotifications, PurchaseHistory, SettingsPrivacyPolicy, SettingsSecurity, Signup, TopupEwalletAmount, TopupEwalletMethods, TrackDriver, VideoCall, VoiceCall, Welcome, SelectTeachers } from '../screens';
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
              screenOptions={{ headerShown: false }}
              // replace the second onboaring1 with login in order to make the user not to see the onboarding 
              // when login the next time
              initialRouteName={isFirstLaunch ? 'Onboarding1' : 'Signup'}>
                <Stack.Screen name="Onboarding1" component={Onboarding1}/>
                <Stack.Screen name="Onboarding2" component={Onboarding2}/>
                <Stack.Screen name="Onboarding3" component={Onboarding3}/>
                <Stack.Screen name="Onboarding4" component={Onboarding4}/>
                <Stack.Screen name="Welcome" component={Welcome}/>
                <Stack.Screen name="Login" component={Login}/>
                <Stack.Screen name="Signup" component={Signup}/>
                <Stack.Screen name="ForgotPasswordMethods" component={ForgotPasswordMethods}/>
                <Stack.Screen name="ForgotPasswordEmail" component={ForgotPasswordEmail}/>
                <Stack.Screen name="ForgotPasswordPhoneNumber" component={ForgotPasswordPhoneNumber}/>
                <Stack.Screen name="OTPVerification" component={OTPVerification}/>
                <Stack.Screen name="CreateNewPassword" component={CreateNewPassword}/>
                <Stack.Screen name="FillYourProfile" component={FillYourProfile}/>
                <Stack.Screen name="CreateNewPIN" component={CreateNewPIN}/>
                <Stack.Screen name="EditAddress" component={EditAddress}/>
                <Stack.Screen name="Main" component={BottomTabNavigation}/>
                <Stack.Screen name="EditProfile" component={EditProfile}/>
                <Stack.Screen name="SettingsNotifications" component={SettingsNotifications}/>
                <Stack.Screen name='PurchaseHistory' component={PurchaseHistory}/>
                <Stack.Screen name="AddNewCard" component={AddNewCard}/>
                <Stack.Screen name="SettingsSecurity" component={SettingsSecurity}/>
                <Stack.Screen name="ChangePIN" component={ChangePIN}/>
                <Stack.Screen name="ChangePassword" component={ChangePassword}/>
                <Stack.Screen name="ChangePhoneNumber" component={ChangePhoneNumber}/>
                <Stack.Screen name="SettingsLanguage" component={SettingsLanguage}/>
                <Stack.Screen name="SettingsPrivacyPolicy" component={SettingsPrivacyPolicy}/>
                <Stack.Screen name="InviteFriends" component={InviteFriends}/>
                <Stack.Screen name="HelpCenter" component={HelpCenter}/>
                <Stack.Screen name="CustomerService" component={CustomerService}/>
                <Stack.Screen name="BookSlots" component={BookSlots}/>
                <Stack.Screen name="Chat" component={Chat}/>
                <Stack.Screen name="Notifications" component={Notifications}/>
                <Stack.Screen name="Search" component={Search}/>
                <Stack.Screen name="PaymentMethods" component={PaymentMethods}/>
                <Stack.Screen name="CancelOrder" component={CancelOrder}/>
                <Stack.Screen name="CancelOrderPaymentMethods" component={CancelOrderPaymentMethods}/>
                <Stack.Screen name="EnterYourPIN" component={EnterYourPIN}/>
                <Stack.Screen name="TopupEwalletAmount" component={TopupEwalletAmount}/>
                <Stack.Screen name="TopupEwalletMethods" component={TopupEwalletMethods}/>
                <Stack.Screen name="AddPromo" component={AddPromo}/>
                <Stack.Screen name="Address" component={Address}/>
                <Stack.Screen name="AddNewAddress" component={AddNewAddress}/>
                <Stack.Screen name="Categories" component={Categories}/>
                <Stack.Screen name="AllCourses" component={AllCourses}/>
                <Stack.Screen name="AllTeacherProfiles" component={AllTeacherProfiles}/>
                <Stack.Screen name="CategoryPizza" component={CategoryPizza}/>
                <Stack.Screen name="CategoryBread" component={CategoryBread}/>
                <Stack.Screen name="CategoryHamburger" component={CategoryHamburger}/>
                <Stack.Screen name="CategoryMeat" component={CategoryMeat}/>
                <Stack.Screen name="Favourite" component={Favourite}/>
                <Stack.Screen name="CourseDetails" component={CourseDetails}/>
                <Stack.Screen name="FoodReviews" component={FoodReviews}/>
                <Stack.Screen name="CourseDescription" component={CourseDescription}/>
                <Stack.Screen name="FoodDetailsOffers" component={FoodDetailsOffers}/>
                <Stack.Screen name="CourseDetailsAddItem" component={CourseDetailsAddItem}/>
                <Stack.Screen name="CheckoutOrders" component={CheckoutOrders}/>
                <Stack.Screen name="CheckoutOrdersAddress" component={CheckoutOrdersAddress}/>
                <Stack.Screen name="SearchingDriver" component={SearchingDriver}/>
                <Stack.Screen name="CheckoutOrdersCompleted" component={CheckoutOrdersCompleted}/>
                <Stack.Screen name="TrackDriver" component={TrackDriver}/>
                <Stack.Screen name="TeacherDetails" component={TeacherDetails}/>
                <Stack.Screen name="VoiceCall" component={VoiceCall}/>
                <Stack.Screen name="VideoCall" component={VideoCall}/>
                <Stack.Screen name="ChatWithPerson" component={ChatWithPerson}/>
                <Stack.Screen name="SelectTeachers" component={SelectTeachers}/>
                <Stack.Screen name="RateTheDriver" component={RateTheDriver}/>
                <Stack.Screen name="GiveTipForDriver" component={GiveTipForDriver}/>
                <Stack.Screen name="RateTheRestaurant" component={RateTheRestaurant}/>
                <Stack.Screen name="MyCart" component={MyCart}/>
                <Stack.Screen name="AboutUs" component={AboutUs}/>
              </Stack.Navigator> 
     </NavigationContainer>
  )
}

export default AppNavigation