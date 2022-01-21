import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import Logo from "../assets/images/Logo_Yel.png";
import User from "../assets/images/user.png";
import Key from "../assets/images/key.png";
import { StackActions } from "@react-navigation/routers";
import axios from "axios";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const changeEmail = (e) => {
    setEmail(e);
  };
  const changePassword = (e) => {
    setPassword(e);
  };

  const handleLogin = async (e) => {
    if (email === "" && password === "") {
      alert("Please fill all the fields");
    } else {
      const user = { email: email, password: password };
      console.log(user);
      // await axios.post(,user)
      // .then(res => {
      // })
      // .catch(err => {
      // });
    }
  };

  return (
    <View style={{ backgroundColor: "#fff", height: "100%" }}>
      <View style={styles.header}>
        <Text style={styles.title}>LOGIN</Text>
      </View>
      <View style={styles.container}>
        <Image source={Logo} style={styles.img} />
        <View style={{ position: "relative" }}>
          <View>
            <TextInput
              style={styles.input}
              placeholder="Username (Email Id)"
              secureTextEntry={false}
              onChangeText={changeEmail}
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
          <TouchableOpacity style={{ marginBottom: 10 }}>
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
    // backgroundColor: "#FFC100",
    height: 40,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 20,
  },
  bottomText: {
    alignItems: "center",
  },
  input: {
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    marginBottom: 25,
    height: 40,
  },
});

export default Login;
