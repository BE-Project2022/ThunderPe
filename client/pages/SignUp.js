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
const SignUp = ({ navigation }) => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [spin, changeSpin] = useState(false)

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
    if (fullname === "" || email === "" || password === "" || mobile === "") {
      alert("Please fill in all fields");
    } else if (password !== confirmPassword) {
      alert("Passwords do not match");
    } else {
      const user = {
        fullname: fullname,
        email: email,
        password: password,
        mobile: mobile,
      };
      changeSpin(true)
      axios
        .post("https://thunderpe.herokuapp.com/auth/signup", user)
        .then((res) => {
          console.log(res);
          changeSpin(false)
          navigation.dispatch(StackActions.replace('Login'))
          // setSignState(true);
        })
        .catch((err) => {
          if (err.response.status === 400) {
            alert("email id already exists");
            console.log(err);
            changeSpin(false)
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
          {spin ? (<Spinner
            visible={spin}
            textContent={'Registering...'}
            textStyle={styles.spinnerTextStyle}
            color='#323133'
            overlayColor='rgba(255,255,255,0.8)'

          />) : null}
          <View style={{ position: "relative" }}>
            <View>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                onChangeText={changeFullname}
              />
            </View>
            <Image
              source={User}
              style={{ position: "absolute", top: 10, right: 5 }}
            />
          </View>
          <View style={{ position: "relative" }}>

            <View>
              <TextInput
                style={styles.input}
                placeholder="Email Id"
                onChangeText={changeEmail}
              />
            </View>
            <Image
              source={Email}
              style={{ position: "absolute", top: 10, right: 5 }}
            />
          </View>
          <View style={{ position: "relative" }}>
            <View>
              <TextInput
                style={styles.input}
                placeholder="Mobile"
                keyboardType='numeric'
                onChangeText={changeMobile}
              />
            </View>
            <Image
              source={Mobile}
              style={{ position: "absolute", top: 10, right: 5 }}
            />
          </View>
          <View style={{ position: "relative" }}>
            <View>
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={changePassword}
              />
            </View>
            <Image
              source={Key}
              style={{ position: "absolute", top: 10, right: 5 }}
            />
          </View>
          <View style={{ position: "relative" }}>
            <View>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry={true}
                onChangeText={changeConfirmPassword}
              />
            </View>
            <Image
              source={Key}
              style={{ position: "absolute", top: 10, right: 5 }}
            />
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
  },
  spinnerTextStyle: {
    color: '#000'
  },
});
