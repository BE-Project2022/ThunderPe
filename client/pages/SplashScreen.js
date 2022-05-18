import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import Logo from "../assets/images/Final_Logo_White.png";
import { LinearGradient } from "expo-linear-gradient";
import { getData } from "../controllers/Data";
import { StackActions } from "@react-navigation/routers";
import { light } from "../controllers/Theme";
import axios from "axios";
import jwtDecode from "jwt-decode";

const SplashScreen = ({ navigation }) => {
  var value;
  useEffect(() => {
    setTimeout(() => {
      getData().then((res) => {
        value = res;

        if (value === null)
          navigation.dispatch(StackActions.replace("Login"));
        else {
          navigation.dispatch(StackActions.replace("Pin", { token: value }))
        }
      });
    }, 1500);
  });

  return (
    <LinearGradient
      colors={[light.primary, light.secondary]}
      style={styles.linearGradient}
    >
      <Image source={Logo} style={styles.image} />
    </LinearGradient>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    justifyContent: "center",
  },
  image: {
    alignSelf: "center",
  },
});
