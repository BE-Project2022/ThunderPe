import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  LogBox
} from "react-native";
import React, { useState } from "react";
import Logo from "../assets/images/Logo_Yel.png";
import User from "../assets/images/user.png";
import Email from "../assets/images/email.png";
import Mobile from "../assets/images/mobile.png";
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
import Key from "../assets/images/key.png";
import { StackActions } from "@react-navigation/native";
import axios from "axios";
import Spinner from "react-native-loading-spinner-overlay/lib";
import Eye from "../assets/images/eye.png";
import EyeSlash from "../assets/images/eye-slash.png";
import Pin from "../assets/images/pin.png";
import * as ImagePicker from 'expo-image-picker';
import Camera from '../assets/images/camera.png'
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from "../controllers/Firebase";
import { Menu, MenuItem, MenuDivider } from "react-native-material-menu";
import { light } from "../controllers/Theme";
import { ScrollView } from "react-native-gesture-handler";

const app = getApp();
const auth = getAuth();
const SignUp = ({ navigation }) => {
  LogBox.ignoreLogs([`Setting a timer for a long period`]);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [spin, changeSpin] = useState(false);
  const [passwordVisible, showPassword] = useState(true);
  const [confirmPassVisible, confirmPassShow] = useState(true);
  const [pin, setPin] = useState("");
  const [image, setImage] = useState(null);
  const [isOnState, setIsOnState] = useState(false);
  const recaptchaVerifier = React.useRef(null);
  const [verificationId, setVerificationId] = React.useState();
  const [verificationCode, setVerificationCode] = React.useState();

  const firebaseConfig = app ? app.options : undefined;
  let url = 'https://firebasestorage.googleapis.com/v0/b/thunderpe-33b6a.appspot.com/o/files%2Fuser.png?alt=media&token=007a7e33-42d9-4848-a9ff-665b6df3bd7b'
  let savingUser
  const hideMenu = () => setIsOnState(false);

  const showMenu = () => setIsOnState(true);

  var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  var mobileFormat = /^\d{10}$/;
  var passwordFormat =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

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

  const changePin = (e) => {
    setPin(e);
  };

  const takeImage = async () => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, Camera roll permissions are required to make this work!');
        }
      }
    })
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    setImage(pickerResult.uri)
  }


  const chooseImg = async () => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, Camera roll permissions are required to make this work!');
        }
      }
    })
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
      allowsEditing: true,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };



  const handleSignUp = async (e) => {
    if (
      fullname === "" ||
      email === "" ||
      password === "" ||
      mobile === "" ||
      confirmPassword === "" ||
      pin === ""
    ) {
      alert("Please fill in all fields");
    } else if (password !== confirmPassword) {
      alert("Passwords do not match");
    } else if (!email.match(mailFormat)) {
      alert("Please check email Id");
    } else if (!mobile.match(mobileFormat))
      alert("Mobile Number must contain 10 digits");
    else if (!password.match(passwordFormat))
      alert(
        "Password must be 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character"
      );
    else {
      let mobileno = parseInt(mobile);
      let pinNum = parseInt(pin);
      const user = {
        fullname: fullname,
        email: email,
        password: password,
        mobile: mobileno,
        pin: pinNum,
        image: image
      };
      try {
        const phoneProvider = new PhoneAuthProvider(auth);
        let temp = "+91" + mobile;
        // console.log(typeof temp)
        changeSpin(true)
        const verificationId = await phoneProvider.verifyPhoneNumber(
          temp,
          recaptchaVerifier.current
        );
        setVerificationId(verificationId);
        console.log("Verification code has been sent to your mobile number.")
        let mob = parseInt(mobile)
        const user2 = { email: email, mobile: mob }
        // console.log(user2)
        await axios
          .post('https://thunderpe.herokuapp.com/auth/verifyEmail', user2)
          .then((res) => {
            console.log('Authenticated')
            changeSpin(false)
            let temp = "+91" + mobile;
            navigation.dispatch(StackActions.replace("Verification", {
              verificationId, mobile: temp, email, id: res.data.id, fullname: fullname,
              email: email,
              password: password,
              mobile: mobileno,
              pin: pinNum,
              image: image
            }))
          })
          .catch((err) => {
            console.log(err.response.data)
            alert("Invalid Mobile or Email")
            changeSpin(false)
          })
      } catch (err) {
        console.log(err)
      }
    }
  }

  return (
    <KeyboardAvoidingView behavior="position">
      <View style={{ backgroundColor: "#fff" }}>
        <View style={styles.header}>
          <Text style={styles.title}>SIGN UP</Text>
        </View>
        <View style={styles.container}>
          <View style={{ alignItems: 'center', marginTop: '10%', marginBottom: '8%' }}>
            <Image source={image ? { uri: image } : { uri: url }} style={{ width: 100, height: 100, marginTop: 18, borderRadius: 50 }} />
            <Menu
              visible={isOnState}
              anchor={<TouchableOpacity
                onPress={showMenu}
                style={{ marginTop: -10 }}

              >
                <Image source={Camera} tintColor='white' style={{ backgroundColor: 'black', height: 30, width: 30 }} />
              </TouchableOpacity>}
              onRequestClose={hideMenu}
              style={{ marginLeft: '7.4%', marginTop: '6.2%' }}
            >
              <MenuItem
                onPress={() => {
                  hideMenu();
                  takeImage()
                }}
              >
                Open Camera
              </MenuItem>
              <MenuItem
                onPress={() => {
                  hideMenu();
                  chooseImg()
                }}
              >
                Upload from gallery
              </MenuItem>

            </Menu>
          </View>
          {spin ? (
            <Spinner
              visible={spin}
              textContent={"Registering..."}
              textStyle={styles.spinnerTextStyle}
              color="#323133"
              overlayColor="rgba(255,255,255,0.8)"
            />
          ) : null}
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              onChangeText={changeFullname}
            />
            <Image source={User} style={{ position: "absolute", top: 10 }} />
          </View>
          <FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={app.options}
          // attemptInvisibleVerification
          />
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={styles.input}
              placeholder="Email Id"
              onChangeText={changeEmail}
            />
            <Image source={Email} style={{ position: "absolute", top: 10 }} />
          </View>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={styles.input}
              placeholder="Mobile"
              keyboardType="numeric"
              onChangeText={changeMobile}
              maxLength={10}
            />
            <Image source={Mobile} style={{ position: "absolute", top: 10 }} />
          </View>
          <View style={{ flexDirection: "row" }}>
            <Image source={Key} style={{ position: "absolute", top: 10 }} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={passwordVisible}
              onChangeText={changePassword}
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
                source={passwordVisible ? EyeSlash : Eye}
                style={{ position: "absolute", top: 10, right: 5 }}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry={confirmPassVisible}
              onChangeText={changeConfirmPassword}
            />
            <Image source={Key} style={{ position: "absolute", top: 10 }} />
            <TouchableOpacity
              style={{
                width: 30,
                height: 35,
                position: "absolute",
                top: 2,
                right: -3,
              }}
              onPress={() => confirmPassShow(!confirmPassVisible)}
            >
              <Image
                source={confirmPassVisible ? EyeSlash : Eye}
                style={{ position: "absolute", top: 10, right: 5 }}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={styles.input}
              placeholder="Pin (This will be used for authentication when you open the app)"
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry={true}
              onChangeText={changePin}
            />
            <Image source={Pin} style={{ position: "absolute", top: 10 }} />
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
    backgroundColor: light.primary,
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
    backgroundColor: light.primary,
    height: 49,
  },
  input: {
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    marginBottom: 25,
    height: 40,
    flex: 1,
    paddingLeft: 30,
  },
  spinnerTextStyle: {
    color: "#000",
  },
});
