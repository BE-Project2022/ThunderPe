// import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Platform, StatusBar } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import { NavigationContainer } from "@react-navigation/native";
import ForgotPassword from "./pages/ForgotPassword";
import EnterOTP from "./pages/EnterOTP";
import Pin from "./pages/Pin";
// AsyncStorageLib
import { storeData, getData } from "./controllers/Data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import SplashScreen from "./pages/SplashScreen";

// const _removeData = async (useName) => {
//   try {
//     await AsyncStorage.removeItem("@storage_Key");
//   } catch (error) {
//     console.log("error", error);
//   }
// };

// _removeData();

export default function App() {
  const Navigate = createStackNavigator();
  // console.log('LoggedIn: ', isLoggedin)
  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#ffc100" barStyle="light-content" />
      <Navigate.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: "#fff" },
        }}
        initialRouteName={'Dashboard'}
      >
        <Navigate.Screen name="Login" component={Login} />
        <Navigate.Screen name="SplashScreen" component={SplashScreen} />
        <Navigate.Screen name="SignUp" component={SignUp} />
        <Navigate.Screen name="ForgotPassword" component={ForgotPassword} />
        <Navigate.Screen name="EnterOTP" component={EnterOTP} />
        <Navigate.Screen name="Dashboard" component={Dashboard} />
        <Navigate.Screen name="Pin" component={Pin} />
      </Navigate.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {},
});
