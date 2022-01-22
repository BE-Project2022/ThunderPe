// import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Platform, StatusBar } from "react-native";
import { createStackNavigator } from '@react-navigation/stack'
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { NavigationContainer } from "@react-navigation/native";
import ForgotPassword from "./pages/ForgotPassword";
import EnterOTP from './pages/EnterOTP'
export default function App() {
  const Navigate = createStackNavigator()
  return (
    <NavigationContainer>
      <StatusBar
        backgroundColor="#ffc100"
        barStyle="light-content"
      />
      <Navigate.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#fff' }
        }}
        initialRouteName={"Login"}
      >
        <Navigate.Screen name="Login" component={Login} />
        <Navigate.Screen name="SignUp" component={SignUp} />
        <Navigate.Screen name="ForgotPassword" component={ForgotPassword} />
        <Navigate.Screen name="EnterOTP" component={EnterOTP} />
      </Navigate.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
  },
});
