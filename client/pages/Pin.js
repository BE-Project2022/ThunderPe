import {
  Image,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  useColorScheme,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import Logo from "../assets/images/Final_Logo_Oran.png";
import DarkLogo from "../assets/images/Final_Logo_Dark.png";
import jwtDecode from "jwt-decode";
import { StackActions } from "@react-navigation/routers";
import axios from "axios";
import { dark, light } from "../controllers/Theme";

const Pin = ({ route, navigation }) => {
  const [pin, setPin] = useState();
  const user = jwtDecode(route.params.token)
  var usersData = []
  const mode = useColorScheme()
  // console.log('User: ', user)
  // console.log(typeof (user.pin))
  // console.log()
  const changePin = (e) => {
    setPin(e);
  };
  useEffect(() => {
    axios
      .get("https://thunderpe.herokuapp.com/auth/getallusers")
      .then((res) => {
        res.data.forEach(item => {
          // console.log(item.fullname)
          usersData.push(item)
          // console.log(text)
        })
      })
      .catch((err) => {
        alert(err.response.data.error);
        // console.log(err.response);
        changeSpin(false);
      });
  })

  const handleBiometricAuth = async () => {
    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Login with Fingerprint",
    });
    if (biometricAuth.success) {
      // console.log(usersData.length)
      navigation.dispatch(StackActions.replace("Dashboard", { user: user, users: usersData }));
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
    <KeyboardAvoidingView behavior="position" style={{ flexGrow: 1, height: '100%', backgroundColor: mode === 'dark' ? dark.background : '#fff' }}>
      <View style={mode == "dark" ? { backgroundColor: dark.background } : { backgroundColor: "#fff", height: '100%' }}>
        <View style={mode === 'dark' ? styles.darkHeader : styles.header}>
          <Text style={mode === 'dark' ? styles.darkTitle : styles.title}>ENTER PIN</Text>
        </View>
        <Image source={mode == "dark" ? DarkLogo : Logo} style={styles.img} />
        <Text style={mode === 'dark' ? { textAlign: "center", fontSize: 24, fontWeight: "bold", color: 'white', marginTop: '20%' } : { textAlign: "center", fontSize: 24, fontWeight: "bold", marginTop: '20%' }}>
          ENTER PIN
        </Text>
        <View>
          <TextInput
            style={mode === 'dark' ? styles.darkInput : styles.input}
            placeholder="Enter Pin"
            maxLength={4}
            keyboardType="numeric"
            secureTextEntry={true}
            onChangeText={changePin}
            onSubmitEditing={checkPin}
            placeholderTextColor={mode === 'dark' ? '#c4c2c2' : 'black'}
          />
        </View>
      </View >
    </KeyboardAvoidingView >
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
    marginTop: '15%'
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
  darkTitle: {
    fontSize: 20,
    color: "black",
    // backgroundColor: "#FFC100",
    height: 40,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 20,
  },
  header: {
    backgroundColor: light.primary,
    height: 54,
  },
  darkHeader: {
    backgroundColor: dark.primary,
    height: 54,
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
  darkInput: {
    borderBottomColor: "#fff",
    borderBottomWidth: 1,
    height: 40,
    marginTop: 20,
    textAlign: "center",
    alignSelf: "center",
    fontSize: 16,
    width: 110,
    color: 'white'
  },
  spinnerTextStyle: {
    color: "#000",
  },
});
