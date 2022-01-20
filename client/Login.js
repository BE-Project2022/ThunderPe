import React from "react";
import { View, TextInput, Button, StyleSheet, Image, Text } from "react-native";
import Input from "./components/Input";
import Logo from "./assets/Logo_Yel.png";

const Login = () => {
  return (
    <View>
      <View>
        <Text style={styles.title}>Login</Text>
      </View>
      <View style={styles.container}>
        <Image source={Logo} style={styles.img} />
        <Input name="Username" val="false" />
        <Input name="Password" val="true" />
        <View style={styles.button}>
          <Button title="Login" color="#FFC100" style={{ marginBottom: 10 }} />
        </View>
        <View style={styles.bottomText}>
          <Text style={{ marginBottom: 10 }}>Forgot Password?</Text>
          <Text>Not a user? Register</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    marginTop: 10,
    marginBottom: 10,
    height: 40,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  title: {
    fontSize: 20,
    color: "white",
    backgroundColor: "#FFC100",
    height: 40,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 20,
  },
  bottomText: {
    alignItems: "center",
  },
});

export default Login;
