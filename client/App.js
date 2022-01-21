// import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Platform, StatusBar } from "react-native";
import { createStackNavigator } from '@react-navigation/stack'
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { NavigationContainer } from "@react-navigation/native";

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
      </Navigate.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
  },
});
