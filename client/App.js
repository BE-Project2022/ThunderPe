// import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Platform, StatusBar } from "react-native";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#ffc100"
        barStyle="light-content"
      />
      {/* <Login /> */}
      <SignUp />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
});
