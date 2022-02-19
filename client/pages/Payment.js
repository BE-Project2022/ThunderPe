import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import Logo from "../assets/images/Logo_Yel.png";
import { light, dark } from "../controllers/Theme";
import LottieView from "lottie-react-native";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { Audio } from "expo-av";

const Payment = ({ navigation, route }) => {
  const from = route.params.from;
  const to = route.params.to;
  var usersData = []
  const success = true
  setTimeout(() => {

    navigation.navigate("Dashboard", { user: route.params.user, users: route.params.users });
  }, 3000);

  async function playSound() {
    // console.log("Loading Sound");
    if (success) {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/thunderpayment.mp3")
      );

      await sound.playAsync();
    } else {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/fail.mp3")
      );

      await sound.playAsync();
    }
  }

  useEffect(() => {
    playSound();
  }, []);

  return (
    <View>
      {success
        ? [
          <View key={0}>
            <View style={styles.header}></View>
            <View style={{ alignItems: "center" }}>
              <Image source={Logo} style={styles.img} />
            </View>
            <LottieView
              style={styles.success}
              source={require("../assets/images/success.json")}
              autoPlay
              loop
            />
            <Text style={styles.bottom}>Payment Successful</Text>
          </View>,
        ]
        : [
          <View key={1}>
            <View style={styles.header}></View>
            <View style={{ alignItems: "center" }}>
              <Image source={Logo} style={styles.img} />
            </View>
            <LottieView
              style={styles.success}
              source={require("../assets/images/failure.json")}
              autoPlay
              loop
            />
            <Text style={styles.bottom}>Payment Failed</Text>
          </View>,
        ]}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: light.primary,
    height: 49,
    flexDirection: "row",
  },
  img: {
    alignSelf: "center",
    width: "100%",
    marginTop: -50,
  },
  success: {
    alignSelf: "center",
    width: "70%",
    height: "50%",
    marginTop: 20,
  },
  bottom: {
    alignSelf: "center",
    fontSize: 30,
    marginTop: -70,
    fontWeight: "bold",
  },
});

export default Payment;
