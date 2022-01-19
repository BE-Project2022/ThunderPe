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
        <Input name="Username" />
        <Input name="Password" />
        <View style={styles.button}>
          <Button title="Login" color="#FFC100" />
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
    height: 40,
  },
  title: {
    fontSize: 20,
    backgroundColor: "#FFC100",
    height: 40,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 20,
  },
});

export default Login;
