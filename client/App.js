// import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
  LogBox,
  Appearance,
  useColorScheme,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import userContacts from "./pages/userContacts";
import { NavigationContainer } from "@react-navigation/native";
import ForgotPassword from "./pages/ForgotPassword";
import Payment from "./pages/Payment";
import EnterOTP from "./pages/EnterOTP";
import Pin from "./pages/Pin";
import MobileAuth from "./pages/MobileAuth";
// AsyncStorageLib
import { storeData, getData } from "./controllers/Data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import SplashScreen from "./pages/SplashScreen";
import EnterAmount from "./pages/EnterAmount";
import SendMoneyToNumber from "./pages/SendMoneyToNumber";
import { dark, light } from "./controllers/Theme";
import ResetPassword from "./pages/ResetPassword";
import BarCodeScan from "./pages/BarCodeScan";
import UserProfile from "./pages/UserProfile";
import Verification from "./pages/Verification";
import TransactionHistory from "./pages/TransactionHistory";
import AddMoney from "./pages/AddMoney";

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
  // console.log(useColorScheme())
  const mode = useColorScheme();
  LogBox.ignoreLogs([
    "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
    "Warning: Can't perform a React state update on an unmounted component",
    "AsyncStorage has been extracted from react-native core and will be removed in a future release"
  ]);
  // console.log('LoggedIn: ', isLoggedin)
  return (
    <NavigationContainer>
      <StatusBar
        backgroundColor={mode === "dark" ? dark.primary : light.primary}
        barStyle="light-content"
      />
      <Navigate.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: "#fff" },
        }}
        initialRouteName={"SplashScreen"}
      >
        <Navigate.Screen name="Login" component={Login} />
        <Navigate.Screen name="SplashScreen" component={SplashScreen} />
        <Navigate.Screen name="SignUp" component={SignUp} />
        <Navigate.Screen name="ForgotPassword" component={ForgotPassword} />
        <Navigate.Screen name="EnterOTP" component={EnterOTP} />
        <Navigate.Screen name="Dashboard" component={Dashboard} />
        <Navigate.Screen name="Pin" component={Pin} />
        <Navigate.Screen name="userContacts" component={userContacts} />
        <Navigate.Screen name="EnterAmount" component={EnterAmount} />
        <Navigate.Screen name="SendToNumber" component={SendMoneyToNumber} />
        <Navigate.Screen name="ResetPassword" component={ResetPassword} />
        <Navigate.Screen name="BarCodeScan" component={BarCodeScan} />
        <Navigate.Screen name="UserProfile" component={UserProfile} />
        <Navigate.Screen name="Payment" component={Payment} />
        <Navigate.Screen name="MobileAuth" component={MobileAuth} />
        <Navigate.Screen name="Verification" component={Verification} />
        <Navigate.Screen name="TransactionHistory" component={TransactionHistory} />
        <Navigate.Screen name="AddMoney" component={AddMoney} />
      </Navigate.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {},
});
