import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  Image,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Logo from "../assets/images/Final_Logo_Oran.png";
import User from "../assets/images/user.png";
import Email from "../assets/images/email.png";
import Mobile from "../assets/images/mobile.png";
import Key from "../assets/images/key.png";
import Back from "../assets/images/back.png";
import {
  FirebaseRecaptchaVerifierModal,
  FirebaseRecaptchaBanner,
} from "expo-firebase-recaptcha";
import { initializeApp, getApp } from "firebase/app";
import {
  getAuth,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { light, dark } from "../controllers/Theme";

const CELL_COUNT_MOBILE = 6;

const app = getApp();
const auth = getAuth();

const MobileAuth = ({ navigation }) => {
  const recaptchaVerifier = React.useRef(null);
  const [phoneNumber, setPhoneNumber] = React.useState();
  const [verificationId, setVerificationId] = React.useState();
  const [verificationCode, setVerificationCode] = React.useState();

  const firebaseConfig = app ? app.options : undefined;
  const [message, showMessage] = React.useState();
  const attemptInvisibleVerification = false;

  const [value, setValue] = useState("");
  const [spin, changeSpin] = useState(false)

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT_MOBILE });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const changeValue = (e) => {
    setValue(e);
    // console.log(e)
  };
  return (
    <View >
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
        <Text style={styles.title}>VERIFICATION</Text>
      </View>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={app.options}
      // attemptInvisibleVerification
      />
      <Text style={{ marginTop: 20 }}>Enter phone number</Text>
      <TextInput
        style={{ marginVertical: 10, fontSize: 17 }}
        placeholder="+1 999 999 9999"
        autoFocus
        autoCompleteType="tel"
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
      />
      <Button
        title="Send Verification Code"
        disabled={!phoneNumber}
        onPress={async () => {
          try {
            const phoneProvider = new PhoneAuthProvider(auth);
            let temp = "+91" + phoneNumber;
            // let abc = parseInt(temp);
            console.log(typeof phoneNumber);
            const verificationId = await phoneProvider.verifyPhoneNumber(
              temp,
              recaptchaVerifier.current
            );
            setVerificationId(verificationId);
            showMessage({
              text: "Verification code has been sent to your mobile number.",
            });
          } catch (err) {
            showMessage({ text: `Error: ${err.message}`, color: "red" });
          }
        }}
      />
      <Text style={{ marginTop: 20 }}>Enter Verification code</Text>
      <CodeField
        ref={ref}
        value={verificationCode}
        onChangeText={setVerificationCode}
        cellCount={CELL_COUNT_MOBILE}
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
      <Button
        title="Confirm Verification Code"
        disabled={!verificationId}
        onPress={async () => {
          try {
            const credential = PhoneAuthProvider.credential(
              verificationId,
              verificationCode
            );
            await signInWithCredential(auth, credential);
            showMessage({ text: "Phone authentication successful 👍" });
            alert("Phone authentication successful 👍")
          } catch (err) {
            showMessage({ text: `Error: ${err.message}`, color: "red" });
          }
        }}
      />
      {message ? (
        <TouchableOpacity
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 0xffffffee, justifyContent: "center", marginTop: 85 },
          ]}
          onPress={() => showMessage(undefined)}
        >
          <Text
            style={{

              color: message.color || "blue",
              fontSize: 17,
              textAlign: "center",
              margin: 20,
            }}
          >
            {message.text}
          </Text>
        </TouchableOpacity>
      ) : undefined}
      {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
    </View>
  );
};

export default MobileAuth;
const styles = StyleSheet.create({
  root: { flex: 1, padding: 20 },
  title: { textAlign: "center", fontSize: 30 },
  codeFieldRoot: { marginTop: 20, justifyContent: 'space-evenly' },
  cell: {
    width: 40,
    height: 40,
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
    backgroundColor: light.primary,
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
    marginTop: '25%',
    width: "95%",
    height: '20%'
  },
  button: {
    backgroundColor: light.primary,
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
    marginLeft: "20%",
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
})
