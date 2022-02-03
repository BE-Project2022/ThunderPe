import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { StackActions } from "@react-navigation/routers";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Dashboard = ({ navigation }) => {
  return (
    <View>
      <Text>Dashboard</Text>
      <TouchableOpacity
        onPress={async () => {
          try {
            await AsyncStorage.removeItem("@storage_Key");
          } catch (error) {
            console.log("error", error);
          }
          navigation.dispatch(StackActions.replace("Login"));
        }}
      >
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Dashboard;
