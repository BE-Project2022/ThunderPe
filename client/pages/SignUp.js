import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import Logo from "../assets/images/Logo_Yel.png";
import User from "../assets/images/user.png";
import Email from "../assets/images/email.png";
import Mobile from "../assets/images/mobile.png";
import Key from "../assets/images/key.png";
import { StackActions } from "@react-navigation/native";
import axios from "axios";
import Spinner from "react-native-loading-spinner-overlay/lib";
import Eye from "../assets/images/eye.png";
import EyeSlash from "../assets/images/eye-slash.png";

const SignUp = ({ navigation }) => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [spin, changeSpin] = useState(false);
  const [passwordVisible, showPassword] = useState(true);
  const [confirmPassVisible, confirmPassShow] = useState(true);
  var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  var passwordFormat =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
  var mobileFormat = /^\d{10}$/;
  const changeEmail = (e) => {
    setEmail(e);
  };

  const changePassword = (e) => {
    setPassword(e);
  };

  const changeMobile = (e) => {
    setMobile(e);
  };

  const changeFullname = (e) => {
    setFullname(e);
  };

  const changeConfirmPassword = (e) => {
    setConfirmPassword(e);
  };

  const handleSignUp = async (e) => {
    if (
      fullname === "" ||
      email === "" ||
      password === "" ||
      mobile === "" ||
      confirmPassword === ""
    ) {
      alert("Please fill in all fields");
    } else if (password !== confirmPassword) {
      alert("Passwords do not match");
    } else if (!email.match(mailFormat)) {
      alert("Please check email Id");
    } else if (!mobile.match(mobileFormat))
      alert("Mobile Number must contain 10 digits");
    else if (!password.match(passwordFormat))
      alert(
        "Password must be 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character"
      );
    else {
      let mobileno = parseInt(mobile);
      console.log(typeof mobileno);
      const user = {
        fullname: fullname,
        email: email,
        password: password,
        mobile: mobileno,
      };
      changeSpin(true);
      axios
        .post("https://thunderpe.herokuapp.com/auth/signup", user)
        .then((res) => {
          console.log(res);
          changeSpin(false);
          navigation.dispatch(StackActions.replace("Login"));
          // setSignState(true);
        })
        .catch((err) => {
          if (err.response.status === 400) {
            alert("email id already exists");
            console.log(err);
            changeSpin(false);
          }
        });

      // console.log(user);
    }
  };

  return (
    <KeyboardAvoidingView behavior="position">
      <View style={{ backgroundColor: "#fff" }}>
        <View style={styles.header}>
          <Text style={styles.title}>SIGN UP</Text>
        </View>
        <View style={styles.container}>
          <Image source={Logo} style={styles.img} />
          {spin ? (
            <Spinner
              visible={spin}
              textContent={"Registering..."}
              textStyle={styles.spinnerTextStyle}
              color="#323133"
              overlayColor="rgba(255,255,255,0.8)"
            />
          ) : null}
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              onChangeText={changeFullname}
            />
            <Image source={User} style={{ position: "absolute", top: 10 }} />
          </View>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={styles.input}
              placeholder="Email Id"
              onChangeText={changeEmail}
            />
            <Image source={Email} style={{ position: "absolute", top: 10 }} />
          </View>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={styles.input}
              placeholder="Mobile"
              keyboardType="numeric"
              onChangeText={changeMobile}
            />
            <Image source={Mobile} style={{ position: "absolute", top: 10 }} />
          </View>
          <View style={{ flexDirection: "row" }}>
            <Image source={Key} style={{ position: "absolute", top: 10 }} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={passwordVisible}
              onChangeText={changePassword}
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
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry={confirmPassVisible}
              onChangeText={changeConfirmPassword}
            />
            <Image source={Key} style={{ position: "absolute", top: 10 }} />
            <TouchableOpacity
              style={{
                width: 30,
                height: 35,
                position: "absolute",
                top: 2,
                right: -3,
              }}
              onPress={() => confirmPassShow(!confirmPassVisible)}
            >
              <Image
                source={confirmPassVisible ? EyeSlash : Eye}
                style={{ position: "absolute", top: 10, right: 5 }}
              />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 8,
                  color: "#fff",
                  fontWeight: "bold",
                }}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bottomText}>
            <TouchableOpacity
              onPress={() => navigation.dispatch(StackActions.replace("Login"))}
            >
              <Text style={{ marginBottom: 10 }}>
                Already a user? Login here
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignUp;

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
    marginBottom: 25,
    height: 40,
    flex: 1,
    paddingLeft: 30,
  },
  spinnerTextStyle: {
    color: "#000",
  },
});
