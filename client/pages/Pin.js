import {
  Image,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  useColorScheme,
  TouchableOpacity,
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

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import Spinner from "react-native-loading-spinner-overlay";
const CELL_COUNT = 4;
const Pin = ({ route, navigation }) => {
  const [pin, setPin] = useState();
  let user;
  let payer, payee, amount;
  if (!navigation.canGoBack()) {
    user = jwtDecode(route.params.token);
    // console.log(user)
    const { id, email, mobile, name, image, key, address } = user;
  } else {
    payer = route.params.from;
    payee = route.params.to;
    amount = route.params.amount;
    // console.log(payer)
  }
  // console.log(email)
  var usersData = [];
  const mode = useColorScheme();
  const [value, setValue] = useState("");
  const [spin, changeSpin] = useState(false);
  // console.log(route.params)
  // const payee = route.params.to
  // if (payee) {
  //   console.log(payee)
  // }
  // const amount = route.params.amount
  // console.log(navigation.canGoBack())
  // console.log(payee)
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const changeValue = (e) => {
    setValue(e);
    // console.log(e)
  };
  // console.log('User: ', user)
  // console.log(typeof (user.pin))
  // console.log()
  const changePin = (e) => {
    setPin(e);
  };
  useEffect(() => {
    if (!navigation.canGoBack()) {
      axios
        .get("https://thunderpe.herokuapp.com/auth/getallusers")
        .then((res) => {
          // console.log(user.id)
          res.data.forEach(item => {
            // console.log(user.id !== item._id)
            // console.log(item.fullname)
            if (user.id !== item._id && item.fullname !== 'ThunderPe') {
              usersData.push(item)
              // console.log(item)
            }
            // console.log(text)
          })
        })
        .catch((err) => {
          alert(err.response.data.error);
          // console.log(err.response);
          changeSpin(false);
        });
    }
  })

  const handleBiometricAuth = async () => {
    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Login with Fingerprint",
    });
    if (biometricAuth.success) {
      // console.log(usersData.length)

      if (!navigation.canGoBack()) {
        changeSpin(true);
        setTimeout(() => {
          changeSpin(false);
          navigation.dispatch(
            StackActions.replace("Dashboard", { user: user, users: usersData })
          );
        }, 3000);

      }
      else {
        let k = payer.key
        if (k[0] == '0' && k[1] == 'x') {
          // console.log('YES')
          k = k.slice(2)
          // console.log(k)
        }
        const data = {
          key: k,
          to: payee.address,
          from: payer.address,
          amount
        }
        console.log(data)
        changeSpin(true)
        axios.post('https://thunderpe.herokuapp.com/auth/transaction', data)
          .then((res) => {
            // console.log(res.data.result.status)
            if (res.data.result.status)
              navigation.dispatch(StackActions.replace("Payment", { user: payer, payee, amount, users: route.params.users, result: res.data.result.status }));
          })
          .catch((err) => {
            // console.log(err.response.data)
            if (!err.response.data.error.receipt.status)
              navigation.dispatch(StackActions.replace("Payment", { user: payer, payee, amount, users: route.params.users, result: false }));
          })
        // console.log(result)
        // changeSpin(false)
        // navigation.dispatch(StackActions.replace("Payment", { user: payer, payee, amount, users: route.params.users, result: result.data.result }));
      }
    }
  };
  const checkPin = () => {
    if (!navigation.canGoBack()) {
      if (parseInt(value) === user.pin) handleBiometricAuth();
      else if (pin === "") alert("Please Enter Pin");
      else {
        alert("Please Enter valid Pin");
      }
    } else {
      if (parseInt(value) === payer.pin) handleBiometricAuth();
      else if (pin === "") alert("Please Enter Pin");
      else {
        alert("Please Enter valid Pin");
      }
    }
  };
  let base64Logo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAA..";
  return (
    <View
      style={
        mode == "dark"
          ? { backgroundColor: dark.background }
          : { backgroundColor: "#fff", height: "100%" }
      }
    >
      <View style={mode === "dark" ? styles.darkHeader : styles.header}>
        {!navigation.canGoBack() && (
          <Text style={mode === "dark" ? styles.darkTitle : styles.title}>
            ENTER PIN
          </Text>
        )}
      </View>
      <Image source={Logo} style={styles.img} />
      <Text
        style={
          mode === "dark"
            ? {
              textAlign: "center",
              fontSize: 24,
              fontWeight: "bold",
              color: "black",
              marginTop: "20%",
            }
            : {
              textAlign: "center",
              fontSize: 24,
              fontWeight: "bold",
              marginTop: "20%",
            }
        }
      >
        ENTER PIN
      </Text>
      {spin ? (
        <Spinner
          visible={spin}
          textContent={"Working on it..."}
          textStyle={styles.spinnerTextStyle}
          color="#323133"
          overlayColor="rgba(255,255,255,0.8)"
        />
      ) : null}
      <View style={{ width: "80%", alignSelf: "center" }}>
        <CodeField
          ref={ref}
          value={value}
          onChangeText={changeValue}
          autoFocus={true}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <Text
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}
            >
              {symbol ? "*" : null || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />
        <TouchableOpacity style={styles.button} onPress={checkPin}>
          <Text style={{ textAlign: "center", color: "white", fontSize: 18 }}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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
    backgroundColor: dark.primary,
    marginTop: "15%",
    height: 45,
    borderRadius: 25,
    marginBottom: 10,
    justifyContent: "center",
  },
  bottomText: {
    alignItems: "center",
  },
  img: {
    alignSelf: "center",
    marginTop: "15%",
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
    borderBottomColor: dark.text,
    borderBottomWidth: 1,
    height: 40,
    marginTop: 20,
    textAlign: "center",
    alignSelf: "center",
    fontSize: 16,
    width: 110,
    color: dark.text,
  },
  spinnerTextStyle: {
    color: "#000",
  },
  root: { flex: 1, padding: 20 },
  title: { textAlign: "center", fontSize: 30 },
  codeFieldRoot: { marginTop: 20 },
  cell: {
    width: 30,
    height: 30,
    // lineHeight: 44,
    color: "#3b3c3d",
    fontSize: 24,
    borderWidth: 2,
    borderColor: "#00000030",
    textAlign: "center",
    borderRadius: 30,
  },
  focusCell: {
    borderColor: "#282829",
    color: "#282829",
  },
});
