import React, { createRef, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Logo from "../assets/images/Logo_Yel.png";
import User from "../assets/images/user.png";
import Key from "../assets/images/key.png";
import { StackActions } from "@react-navigation/routers";
import axios from "axios";
import Back from "../assets/images/back.png";
import Spinner from "react-native-loading-spinner-overlay";
import Eye from "../assets/images/eye.png";
import EyeSlash from "../assets/images/eye-slash.png";
import { storeData, getData } from "../controllers/Data";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [spin, changeSpin] = useState(false);
  const [passwordVisible, showPassword] = useState(true);
  var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  var passwordFormat =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

  const emailField = createRef();
  const passwordField = createRef();
  const changeEmail = (e) => {
    setEmail(e);
  };
  const changePassword = (e) => {
    setPassword(e);
  };

  const handleLogin = async (e) => {
    if (email === "" && password === "") {
      alert("Please fill all the fields");
    } else if (!email.match(mailFormat)) alert("Please check username");
    else if (!password.match(passwordFormat))
      alert(
        "Password must be 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character"
      );
    else {
      const user = { email: email, password: password };
      changeSpin(true);
      await axios
        .post("https://thunderpe.herokuapp.com/auth/login", user)
        .then((res) => {
          alert("Login Successful");
          changeSpin(false);
          storeData(res.data.token);
          navigation.dispatch(StackActions.replace("Next"));
        })
        .catch((err) => {
          alert(err.response.data.error);
          changeSpin(false);
        });
    }
  };

  return (
    <View style={{ backgroundColor: "#fff", height: "100%" }}>
      <View style={styles.header}>
        <TouchableOpacity
          style={{ width: "12%" }}
          onPress={() => (navigation.canGoBack() ? navigation.goBack() : null)}
        >
          <Image
            source={navigation.canGoBack() ? Back : null}
            style={{ left: 12, height: 30, top: 11 }}
          />
        </TouchableOpacity>
        <Text style={styles.title}>LOGIN</Text>
      </View>
      <View style={styles.container}>
        <Image source={Logo} style={styles.img} />
        <View
          style={{
            flexDirection: "row",
          }}
        >
          {spin ? (
            <Spinner
              visible={spin}
              textContent={"Logging In..."}
              textStyle={styles.spinnerTextStyle}
              color="#323133"
              overlayColor="rgba(255,255,255,0.8)"
            />
          ) : null}
          <TextInput
            style={styles.input}
            placeholder="Username (Email Id)"
            secureTextEntry={false}
            onChangeText={changeEmail}
            ref={emailField}
          />
          <Image source={User} style={{ position: "absolute", top: 10 }} />
        </View>

        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Image source={Key} style={{ position: "absolute", top: 10 }} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={passwordVisible}
            onChangeText={changePassword}
            ref={passwordField}
          />
          <TouchableOpacity
            style={{
              width: 30,
              height: 35,
              position: "absolute",
              top: 2,
              right: -3,
            }}
            onPress={() => showPassword(!passwordVisible)}
          >
            <Image
              source={passwordVisible ? EyeSlash : Eye}
              style={{ position: "absolute", top: 10, right: 5 }}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text
            style={{
              textAlign: "center",
              marginTop: 8,
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            Login
          </Text>
        </TouchableOpacity>
        <View style={styles.bottomText}>
          <TouchableOpacity
            style={{ marginBottom: 10 }}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.dispatch(StackActions.replace("SignUp"))}
          >
            <Text>Not a user? Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#ffc100",
    height: 49,
    flexDirection: "row",
  },
  container: {
    backgroundColor: "#fff",
    width: "80%",
    alignSelf: "center",
  },
  img: {
    alignSelf: "center",
    width: "120%",
  },
  button: {
    backgroundColor: "#ffc100",
    marginTop: 10,
    height: 45,
    borderRadius: 25,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    color: "white",
    height: 40,
    alignSelf: "center",
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 20,
    marginLeft: "30%",
    top: 9,
  },
  bottomText: {
    alignItems: "center",
  },
  input: {
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    marginBottom: 25,
    height: 40,
    flex: 1,
    paddingLeft: 30,
  },
  spinnerTextStyle: {
    color: "#000",
  },
});

export default Login;
