import React, { useEffect, useState } from "react";
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
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from "../controllers/Firebase";
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from "react-native-confirmation-code-field";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { light, dark } from "../controllers/Theme";
import axios from "axios";
import { StackActions } from "@react-navigation/routers";
import { storeData } from "../controllers/Data";
import jwtDecode from "jwt-decode";

const CELL_COUNT_MOBILE = 6;

const app = getApp();
const auth = getAuth();

const Verification = ({ route, navigation }) => {
    const recaptchaVerifier = React.useRef(null);
    const verificationId = route.params.verificationId
    let mobile = route.params.mobile
    let email = route.params.email
    let length = email.length
    email = email.slice(0, 4)
    for (var i = 0; i < length - 5; i++) {
        email = email + '*'
    }
    var usersData = []

    // mobile = mobile.slice(0, 7) + "******"
    const [phoneNumber, setPhoneNumber] = React.useState();
    const [mobileVerificationCode, setMobileVerificationCode] = React.useState();
    const [emailVerificationCode, setEmailVerificationCode] = React.useState();
    let url = 'https://firebasestorage.googleapis.com/v0/b/thunderpe-33b6a.appspot.com/o/files%2Fuser.png?alt=media&token=007a7e33-42d9-4848-a9ff-665b6df3bd7b'
    const firebaseConfig = app ? app.options : undefined;
    const [message, showMessage] = React.useState();
    const attemptInvisibleVerification = false;
    let user = {
        fullname: route.params.fullname,
        email: route.params.email,
        password: route.params.password,
        mobile: route.params.mobile,
        pin: route.params.pin,
        image: url
    }
    const checkImage = route.params.image
    console.log("USER: ", user)
    console.log('CHECKIM: ', checkImage)
    const [value, setValue] = useState("");
    const [spin, changeSpin] = useState(false)

    const refer = useBlurOnFulfill({ value, cellCount: CELL_COUNT_MOBILE });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });
    const changeValue = (e) => {
        setValue(e);
        // console.log(e)
    };

    useEffect(() => {
        axios
            .get("https://thunderpe.herokuapp.com/auth/getallusers")
            .then((res) => {
                res.data.forEach(item => {
                    // console.log(item.fullname)
                    if (item.fullname !== 'ThunderPe')
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

    const uploadImage = async (user) => {
        console.log('HERERERERER')
        if (checkImage != null) {
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    resolve(xhr.response);
                };
                xhr.onerror = function () {
                    reject(new TypeError("Network request failed"));
                };
                xhr.responseType = "blob";
                xhr.open("GET", checkImage, true);
                xhr.send(null);
            });

            const fileRef = ref(storage, `files/${user.user._id}`);
            console.log('Hi')

            const result = await uploadBytes(fileRef, blob)
            console.log('Hello')


            // We're done with the blob, close and release it
            blob.close(); await getDownloadURL(fileRef).then((res) => url = res);
            let temp = {
                email: user.user.email,
                fullname: user.user.fullname,
                pin: user.user.pin,
                image: url
            }
            console.log(temp)
            console.log(user)
            axios
                .post('https://thunderpe.herokuapp.com/auth/updateUser', temp)
                .then((res) => {
                    console.log("DATA: ", res.data)
                    storeData(res.data.user.token)
                    const decoded = jwtDecode(res.data.user.token)
                    usersData.find((item, i) => {
                        if (item.email === decoded.email) {
                            usersData.splice(i, 1)
                            return true
                        }
                    })
                    changeSpin(false)
                    navigation.dispatch(StackActions.replace("Dashboard", { user: decoded, users: usersData }));
                })
                .catch((e) => console.log(e.response))
            // changeSpin(false);
            console.log(url)
        }
        // handleSignUp()
    }

    const signUp = async () => {
        changeSpin(true);

        await axios
            .post("https://thunderpe.herokuapp.com/auth/signup", user)
            .then((res) => {
                let savingUser = res.data
                console.log(savingUser)
                if (checkImage != null) {
                    uploadImage(savingUser)
                }
                else {
                    storeData(res.data.user.token)
                    const decoded = jwtDecode(res.data.user.token)
                    usersData.find((item, i) => {
                        if (item.email === decoded.email) {
                            usersData.splice(i, 1)
                            return true
                        }
                    })
                    changeSpin(false)
                    navigation.dispatch(StackActions.replace("Dashboard", { user: decoded, users: usersData }));
                }
            })
            .catch((err) => {
                alert(err.response.data.error)
            })

    }
    const verify = async () => {
        try {
            changeSpin(true)
            const credential = PhoneAuthProvider.credential(
                verificationId,
                mobileVerificationCode
            );
            await signInWithCredential(auth, credential);
            let user2 = { id: route.params.id, otp: emailVerificationCode }
            let result
            await axios
                .post('https://thunderpe.herokuapp.com/auth/verifyOTP', user2)
                .then((res) => {
                    result = res.data.isValid
                    console.log(res.data)
                    if (result) {
                        signUp()
                    }
                    else {
                        changeSpin(false)
                        alert(`Invalid OTP`)
                    }
                })
                .catch((err) => {
                    changeSpin(false)
                    alert(err.response.data.error)
                })
        }
        catch (err) {
            changeSpin(false)
            showMessage({ text: `Error: ${err.message}`, color: "red" });
            alert(`ERROR: ${err.message}`)
        }

    }

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

            {spin ? (
                <Spinner
                    visible={spin}
                    textContent={"Registering..."}
                    textStyle={styles.spinnerTextStyle}
                    color="#323133"
                    overlayColor="rgba(255,255,255,0.8)"
                />
            ) : null}
            <Text style={{ marginTop: 30, textAlign: 'center', fontSize: 16 }}>We have send an OTP to your mobile and email</Text>
            <Text style={{ marginTop: 30, textAlign: 'center', fontSize: 22, fontWeight: 'bold' }}>Enter OTP send to your number {mobile} </Text>


            <CodeField
                ref={refer}
                value={mobileVerificationCode}
                onChangeText={setMobileVerificationCode}
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
            <Text style={{ marginTop: 30, textAlign: 'center', fontSize: 22, fontWeight: 'bold' }}>Enter OTP send to your email {email} </Text>


            <CodeField
                ref={refer}
                value={emailVerificationCode}
                onChangeText={setEmailVerificationCode}
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
            <TouchableOpacity style={styles.button} onPress={verify}>
                <Text
                    style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}

                >Confirm Verification Code</Text>
            </TouchableOpacity>
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

export default Verification;
const styles = StyleSheet.create({
    root: { flex: 1, padding: 20 },
    title: { textAlign: "center", fontSize: 30 },
    codeFieldRoot: { marginTop: 20, justifyContent: 'space-evenly' },
    cell: {
        width: 40,
        height: 50,
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
        marginTop: 45,
        height: 45,
        marginBottom: 10,
        width: '80%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25
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