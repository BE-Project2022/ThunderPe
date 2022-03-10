import React, { createRef, useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Logo from "../assets/images/Final_Logo_Oran.png";
import DarkLogo from "../assets/images/Final_Logo_Dark.png";
import User from "../assets/images/user.png";
import darkUser from "../assets/images/user_white.png";
import Key from "../assets/images/key.png";
import darkKey from "../assets/images/key_white.png";
import { StackActions } from "@react-navigation/routers";
import axios from "axios";
import Back from "../assets/images/back.png";
import Spinner from "react-native-loading-spinner-overlay";
import Eye from "../assets/images/eye.png";
import EyeSlash from "../assets/images/eye-slash.png";
import darkEye from "../assets/images/eye_white.png";
import darkEyeSlash from "../assets/images/eye-slash_white.png";
import { storeData, getData } from "../controllers/Data";
import jwtDecode from "jwt-decode";
import { dark, light } from "../controllers/Theme";



const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [spin, changeSpin] = useState(false);
  const [passwordVisible, showPassword] = useState(true);
  var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  var passwordFormat =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
  var usersData = []
  const emailField = createRef();
  const passwordField = createRef();
  const mode = useColorScheme()

  const changeEmail = (e) => {
    setEmail(e);
  };
  const changePassword = (e) => {
    setPassword(e);
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
        .post("https://thunderpe.herokuapp.com/auth/isLoggedIn", user)
        .then((res) => {
          // alert("Login Successful");
          // console.log(res.data)
          if (res.data.result) {
            Alert.alert(
              'Already Logged in User',
              'You are logged in from other device also. Do you want to logout from other device?',
              [
                {
                  text: 'Yes',
                  onPress: async () => {
                    changeSpin(true)
                    await axios
                      .post("https://thunderpe.herokuapp.com/auth/login", user)
                      .then((res) => {
                        alert("Login Successful");
                        changeSpin(false);
                        storeData(res.data.token);
                        const decoded = jwtDecode(res.data.token);
                        usersData.find((item, i) => {
                          if (item.email === decoded.email) {
                            usersData.splice(i, 1)
                            return true
                          }
                        })
                        changeSpin(false)
                        navigation.dispatch(StackActions.replace("Dashboard", { user: decoded, users: usersData }));
                      })
                      .catch((err) => {
                        alert(err.response.data.error)
                      })
                  }
                },
                {
                  text: 'No',
                  style: 'cancel'
                }
              ]
            )
          }
          else {
            (async () => {
              changeSpin(true)
              await axios
                .post("https://thunderpe.herokuapp.com/auth/login", user)
                .then((res) => {
                  alert("Login Successful");
                  changeSpin(false);
                  storeData(res.data.token);
                  const decoded = jwtDecode(res.data.token);
                  usersData.find((item, i) => {
                    if (item.email === decoded.email) {
                      usersData.splice(i, 1)
                      return true
                    }
                  })
                  changeSpin(false)
                  navigation.dispatch(StackActions.replace("Dashboard", { user: decoded, users: usersData }));
                })
                .catch((err) => {
                  alert(err.response.data.error)
                })

            })

          }
          changeSpin(false);
          // storeData(res.data.token);
          // const decoded = jwtDecode(res.data.token);
          // usersData.find((item, i) => {
          //   if (item.email === decoded.email) {
          //     usersData.splice(i, 1)
          //     return true
          //   }
          // })
          // navigation.dispatch(StackActions.replace("Dashboard", { user: decoded, users: usersData }));
        })
        .catch((err) => {
          alert(err.response.data.error);
          changeSpin(false)
          // if (err.response.data.error == 'Already Logged in User') {
          //   // alert(err.response.data.error)
          //   Alert.alert(
          //     err.response.data.error,
          //     'You are logged in from other device also. Do you want to logout from other device?',
          //     [
          //       {
          //         text: 'Yes',
          //         onPress: async () => {
          //           changeSpin(true)
          //           await axios
          //             .post("https://thunderpe.herokuapp.com/auth/login", user)
          //             .then((res) => {
          //               alert("Login Successful");
          //               changeSpin(false);
          //               storeData(res.data.token);
          //               const decoded = jwtDecode(res.data.token);
          //               usersData.find((item, i) => {
          //                 if (item.email === decoded.email) {
          //                   usersData.splice(i, 1)
          //                   return true
          //                 }
          //               })
          //               changeSpin(false)
          //               navigation.dispatch(StackActions.replace("Dashboard", { user: decoded, users: usersData }));
          //             })
          //             .catch((err) => {
          //               alert(err.response.data.error)
          //             })
          //         }
          //       },
          //       {
          //         text: 'No',
          //         style: 'cancel'
          //       }
          //     ]
          //   )
          // }
          // changeSpin(false);
        });
    }
  };

  return (
    // <KeyboardAvoidingView behavior="position" style={{ flexGrow: 1, height: '100%', backgroundColor: mode === 'dark' ? dark.background : '#fff' }}>
    <View style={mode === 'dark' ? { backgroundColor: dark.background } : { backgroundColor: light.background }}>
      <View style={mode === 'dark' ? styles.darkHeader : styles.header}>
        <TouchableOpacity
          style={{ width: "12%" }}
          onPress={() => (navigation.canGoBack() ? navigation.goBack() : null)}
        >
          <Image
            source={navigation.canGoBack() ? Back : null}
            style={{ left: 12, height: 30, top: 11 }}
          />
        </TouchableOpacity>
        <Text style={mode === 'dark' ? styles.darkTitle : styles.title}>LOGIN</Text>
      </View>
      <View style={mode === 'dark' ? styles.darkContainer : styles.container}>
        <Image source={Logo} style={styles.img} />
        <View
          style={{
            flexDirection: "row",
            marginTop: '30%'
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
            style={mode === 'dark' ? styles.darkInput : styles.input}
            placeholder="Username (Email Id)"
            secureTextEntry={false}
            onChangeText={changeEmail}
            ref={emailField}
            placeholderTextColor={mode === 'dark' ? 'grey' : 'grey'}
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
            style={mode === 'dark' ? styles.darkInput : styles.input}
            placeholder="Password"
            secureTextEntry={passwordVisible}
            onChangeText={changePassword}
            ref={passwordField}
            placeholderTextColor={mode === 'dark' ? 'grey' : 'grey'}
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
              source={(passwordVisible ? EyeSlash : Eye)}
              style={{ position: "absolute", top: 10, right: 5 }}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={mode == 'dark' ? styles.darkButton : styles.button} onPress={handleLogin}>
          <Text
            style={
              mode == 'dark' ? {
                textAlign: "center",
                marginTop: 8,
                color: "black",
                fontWeight: "bold",
              } :
                {
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
            <Text style={mode === 'dark' ? { color: 'black' } : { color: 'black' }}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.dispatch(StackActions.replace("SignUp"))}
          >
            <Text style={mode === 'dark' ? { color: 'black' } : { color: 'black' }}>Not a user? Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    // </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: light.primary,
    height: 49,
    flexDirection: "row",
  },
  darkHeader: {
    backgroundColor: dark.primary,
    height: 49,
    flexDirection: "row",
  },
  container: {
    backgroundColor: light.background,
    width: "80%",
    alignSelf: "center",
  },
  darkContainer: {
    backgroundColor: dark.background,
    width: "80%",
    alignSelf: "center",
  },
  img: {
    alignSelf: "center",
    width: "70%",
    height: '18%',
    marginTop: '18%'
  },
  button: {
    backgroundColor: light.primary,
    marginTop: 10,
    height: 45,
    borderRadius: 25,
    marginBottom: 10,
  },
  darkButton: {
    backgroundColor: dark.primary,
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
  darkTitle: {
    fontSize: 20,
    color: 'black',
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
  darkInput: {
    borderBottomColor: dark.text,
    borderBottomWidth: 1,
    marginBottom: 25,
    height: 40,
    flex: 1,
    paddingLeft: 30,
    color: dark.text
  },
  spinnerTextStyle: {
    color: "#000",
  },
});

export default Login;
