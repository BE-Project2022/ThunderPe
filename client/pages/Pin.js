import {
  Image,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import Logo from "../assets/images/Logo_Yel.png";
import jwtDecode from "jwt-decode";
import { StackActions } from "@react-navigation/routers";

const Pin = ({ route, navigation }) => {
  const [pin, setPin] = useState();
  const user = jwtDecode(route.params.token)
  // console.log(typeof (user.pin))
  // console.log()
  const changePin = (e) => {
    setPin(e);
  };

  const handleBiometricAuth = async () => {
    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Login with Fingerprint",
    });
    if (biometricAuth.success) {
      navigation.dispatch(StackActions.replace("Dashboard", { user: user }));
    }
  };
  const checkPin = () => {
    if (parseInt(pin) === user.pin) handleBiometricAuth();
    else if (pin === "") alert("Please Enter Pin");
    else {
      alert("Please Enter valid Pin");
    }
  };
  return (
    <KeyboardAvoidingView behavior="position">
      <View style={{ backgroundColor: "#fff" }}>
        <View style={styles.header}>
          <Text style={styles.title}>ENTER PIN</Text>
        </View>
        <Image source={Logo} style={styles.img} />
        <Text style={{ textAlign: "center", fontSize: 24, fontWeight: "bold" }}>
          ENTER PIN
        </Text>
        <View>
          <TextInput
            style={styles.input}
            placeholder="Enter Pin"
            maxLength={4}
            keyboardType="numeric"
            secureTextEntry={true}
            onChangeText={changePin}
            onSubmitEditing={checkPin}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Pin;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    width: "80%",
    alignSelf: "center",
    // height: '100%'
  },
  button: {
    backgroundColor: "#ffc100",
    marginTop: 10,
    height: 45,
    borderRadius: 25,
    marginBottom: 10,
  },
  bottomText: {
    alignItems: "center",
  },
  img: {
    alignSelf: "center",
    width: "120%",
  },
  title: {
    fontSize: 20,
    color: "white",
    // backgroundColor: "#FFC100",
    height: 40,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 20,
  },
  header: {
    backgroundColor: "#ffc100",
    height: 49,
  },
  input: {
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    height: 40,
    marginTop: 20,
    textAlign: "center",
    alignSelf: "center",
    fontSize: 16,
    width: 110,
  },
  spinnerTextStyle: {
    color: "#000",
  },
});
