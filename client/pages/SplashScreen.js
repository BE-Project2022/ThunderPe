import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import Logo from "../assets/images/Final_Logo_White.png";
import { LinearGradient } from "expo-linear-gradient";
import { getData } from "../controllers/Data";
import { StackActions } from "@react-navigation/routers";
import { light } from "../controllers/Theme";
import axios from "axios";
const SplashScreen = ({ navigation }) => {
  var value;
  useEffect(() => {
    setTimeout(() => {
      getData().then((res) => {
        value = res;
        // console.log('Value:', value)
        // console.log(typeof (value))
        // console.log('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InByYXRpazAzMTJAZ21haWwuY29tIiwibW9iaWxlIjo5NDA0NzgzNTE2LCJpZCI6IjYxZmEyOWQ0ZDYyMDMyMzgwYmQxYWQyZCIsInBpbiI6MTIzNCwibmFtZSI6IlByYXRpayBBZ2Fyd2FsIiwiaW1hZ2UiOiJodHRwczovL2ZpcmViYXNlc3RvcmFnZS5nb29nbGVhcGlzLmNvbS92MC9iL3RodW5kZXJwZS0zM2I2YS5hcHBzcG90LmNvbS9vL2ZpbGVzJTJGNjFmYTI5ZDRkNjIwMzIzODBiZDFhZDJkP2FsdD1tZWRpYSZ0b2tlbj00YjU5OTg5Zi01M2RjLTQyMjUtYmQ1Yy1mNjc0OGEzNzU4M2EiLCJpYXQiOjE2NDY5MjM5MDQsImV4cCI6MTY0NjkyNzUwNH0.tTbHWc9AYQdAgUkFcDsrRx6-x9P6BxmWBhBOOwqOQWw' == 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InByYXRpazAzMTJAZ21haWwuY29tIiwibW9iaWxlIjo5NDA0NzgzNTE2LCJpZCI6IjYxZmEyOWQ0ZDYyMDMyMzgwYmQxYWQyZCIsInBpbiI6MTIzNCwibmFtZSI6IlByYXRpayBBZ2Fyd2FsIiwiaW1hZ2UiOiJodHRwczovL2ZpcmViYXNlc3RvcmFnZS5nb29nbGVhcGlzLmNvbS92MC9iL3RodW5kZXJwZS0zM2I2YS5hcHBzcG90LmNvbS9vL2ZpbGVzJTJGNjFmYTI5ZDRkNjIwMzIzODBiZDFhZDJkP2FsdD1tZWRpYSZ0b2tlbj00YjU5OTg5Zi01M2RjLTQyMjUtYmQ1Yy1mNjc0OGEzNzU4M2EiLCJpYXQiOjE2NDY5MjM5MDQsImV4cCI6MTY0NjkyNzUwNH0.tTbHWc9AYQdAgUkFcDsrRx6-x9P6BxmWBhBOOwqOQWw')
        if (value === null)
          navigation.dispatch(StackActions.replace("MobileAuth"));
        else {
          const user = {
            token: value,
          };
          axios
            .post("https://thunderpe.herokuapp.com/auth/checkToken", {
              data: user,
            })
            .then((res) => {
              console.log(res.data.result);
              if (res.data.result)
                navigation.dispatch(
                  StackActions.replace("Pin", { token: value })
                );
              else {
                navigation.dispatch(StackActions.replace("Login"));
              }
              // console.log(typeof (res.data.result))
            })
            .catch((err) => {
              alert(err.response.data.error);
              // console.log(err.response.data.error)
            });
          // navigation.dispatch(StackActions.replace("Pin", { token: value }));
        }
      });
    }, 1500);
  });

  return (
    <LinearGradient
      colors={[light.primary, light.secondary]}
      style={styles.linearGradient}
    >
      <Image source={Logo} style={styles.image} />
    </LinearGradient>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    justifyContent: "center",
  },
  image: {
    alignSelf: "center",
  },
});
