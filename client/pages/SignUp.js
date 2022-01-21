import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import Logo from "../assets/images/Logo_Yel.png";
import Input from "../components/Input";
import User from "../assets/images/user.png";
import Email from "../assets/images/email.png";
import Mobile from "../assets/images/mobile.png";
import Key from "../assets/images/key.png";
import { StackActions } from "@react-navigation/native";
const SignUp = ({ navigation }) => {
  // navigation.dispatch(
  //     StackActions.replace('Login', { user: 'jane', })
  // );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [fullname, setFullname] = useState("");

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

  const handleSignUp = async (e) => {
    if (fullname === "" || email === "" || password === "" || mobile === "") {
      alert("Please fill in all fields");
    } else {
      const user = {
        fullname: fullname,
        email: email,
        password: password,
        mobile: mobile,
      };
      //   axios
      //     .post("http://localhost:5000/auth/signup", user)
      //     .then((res) => {
      //       console.log(res);
      //       setSignState(true);
      //     })
      //     .catch((err) => {
      //       if (err.response.status === 400) {
      //         alert("email id already exists");
      //         console.log(err);
      //       }
      //     });

      console.log(user);
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
          <View style={{ position: "relative" }}>
            <Input name="Full Name" val="false" />
            <Image
              source={User}
              style={{ position: "absolute", top: 10, right: 5 }}
            />
          </View>
          <View style={{ position: "relative" }}>
            <Input name="Email Id" val="false" />
            <Image
              source={Email}
              style={{ position: "absolute", top: 10, right: 5 }}
            />
          </View>
          <View style={{ position: "relative" }}>
            <Input name="Mobile" val="false" type="numeric" />
            <Image
              source={Mobile}
              style={{ position: "absolute", top: 10, right: 5 }}
            />
          </View>
          <View style={{ position: "relative" }}>
            <Input name="Password" val="true" />
            <Image
              source={Key}
              style={{ position: "absolute", top: 10, right: 5 }}
            />
          </View>
          <View style={{ position: "relative" }}>
            <Input name="Confirm Password" val="true" />
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
});