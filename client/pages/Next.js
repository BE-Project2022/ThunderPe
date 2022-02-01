import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { StackActions } from "@react-navigation/routers";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Next = ({ navigation }) => {
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("@storage_Key");
      if (value !== null) {
        // value previously stored
        // console.log("value=", value);
      } else navigation.dispatch(StackActions.replace("Login"));
    } catch (e) {
      // error reading value
      console.log("error", e);
    }
  };
  getData();
  return (
    <View>
      <Text>Next</Text>
      <TouchableOpacity
        onPress={() => navigation.dispatch(StackActions.replace("SignUp"))}
      >
        <Text>Not a user? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Next;
