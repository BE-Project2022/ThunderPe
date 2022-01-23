import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import Logo from "../assets/images/Logo_Yel.png";
import User from "../assets/images/user.png";
import Email from "../assets/images/email.png";
import Mobile from "../assets/images/mobile.png";
import Key from "../assets/images/key.png";
import Back from "../assets/images/back.png";
import { getStateFromPath } from "@react-navigation/core";
import axios from "axios";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import Spinner from "react-native-loading-spinner-overlay/lib";

const CELL_COUNT = 4;
const EnterOTP = ({ route, navigation }) => {
  let email = route.params.email;

  const [value, setValue] = useState("");
  const [spin, changeSpin] = useState(false)

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const changeValue = (e) => {
    setValue(e);
    // console.log(e)
  };
  const getOTP = async () => {
    console.log(value, route.params.id);
    if (value === "") {
      alert("Please Enter OTP");
    } else {
      const user = { id: route.params.id, otp: value };
      changeSpin(true)
      await axios
        .post("https://thunderpe.herokuapp.com/auth/verifyOTP", user)
        .then((res) => {
          console.log(res);
          changeSpin(false)
        })
        .catch((err) => {
          console.log(err);
          alert("Invalid OTP. Try again");
          changeSpin(false)
        });
    }
  };
  return (
    <View style={{ backgroundColor: "#fff", height: "100%" }}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => (navigation.canGoBack() ? navigation.goBack() : null)}
          style={{ width: "12%" }}
        >
          <Image
            source={navigation.canGoBack() ? Back : null}
            style={{ left: 12, height: 30, top: 11 }}
          />
        </TouchableOpacity>
        <Text style={styles.title}>FORGOT PASSWORD?</Text>
      </View>
      <View style={styles.container}>
        <Image source={Logo} style={styles.img} />
        <Text
          style={{
            fontSize: 20,
            color: "black",
            height: 40,
            textAlign: "center",
            fontWeight: "bold",
            marginTop: 8,
          }}
        >
          ENTER OTP
        </Text>
        {spin ? (<Spinner
          visible={spin}
          textContent={'Logging In...'}
          textStyle={styles.spinnerTextStyle}
          color='#323133'
          overlayColor='rgba(255,255,255,0.8)'

        />) : null}
        <Text style={styles.info}>
          We have sent an OTP on your registered email id {email}
        </Text>
        <CodeField
          ref={ref}
          value={value}
          onChangeText={changeValue}
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
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />
        <Text style={{ marginTop: 10, textAlign: "center" }}>Resend OTP</Text>
        <TouchableOpacity style={styles.button} onPress={() => getOTP()}>
          <Text
            style={{
              textAlign: "center",
              marginTop: 8,
              color: "#fff",
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, padding: 20 },
  title: { textAlign: "center", fontSize: 30 },
  codeFieldRoot: { marginTop: 20 },
  cell: {
    width: 60,
    height: 60,
    lineHeight: 44,
    color: "#3b3c3d",
    fontSize: 32,
    borderWidth: 2,
    borderColor: "#00000030",
    textAlign: "center",
  },
  focusCell: {
    borderColor: "#282829",
    color: "#282829",
  },
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
    marginTop: 25,
    height: 45,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    color: "white",
    // backgroundColor: "#FFC100",
    height: 40,
    alignSelf: "center",
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 20,
    marginLeft: "12%",
    top: 9,
  },
  input: {
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    marginBottom: 25,
    height: 40,
  },
  info: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default EnterOTP;
