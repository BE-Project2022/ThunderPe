import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import Logo from "../assets/images/Logo_Yel.png";
import { light, dark } from "../controllers/Theme";
import LottieView from "lottie-react-native";
import jwtDecode from "jwt-decode";
import axios from "axios";

const Payment = ({ navigation, route }) => {
  const from = route.params.from;
  const to = route.params.to;

  const success = false;
  // setTimeout(() => {

  //   navigation.navigate("Dashboard");
  // }, 5000);
  return (
    <View>
      {success
        ? [
            <View>
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
            <View>
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
