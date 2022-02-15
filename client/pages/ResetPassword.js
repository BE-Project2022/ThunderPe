import { BackHandler, StyleSheet, Text, ToastAndroid, useColorScheme, View, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import Back from "../assets/images/back.png";
import Logo from "../assets/images/Final_Logo_Oran.png";
import { dark, light } from '../controllers/Theme';
import Key from "../assets/images/key.png";
import Eye from "../assets/images/eye.png";
import EyeSlash from "../assets/images/eye-slash.png";
import Spinner from "react-native-loading-spinner-overlay/lib";
import axios from "axios";
import { StackActions } from '@react-navigation/routers';
const ResetPassword = ({ route, navigation }) => {
    const mode = useColorScheme()
    const [exitApp, setExitApp] = useState(0)
    const [password, setPassword] = useState("");
    const [passwordVisible, showPassword] = useState(true);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPassVisible, confirmPassShow] = useState(true);
    const [spin, changeSpin] = useState(false);
    var passwordFormat =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

    const changeConfirmPassword = (e) => {
        setConfirmPassword(e);
    };

    const changePassword = (e) => {
        setPassword(e);
    };


    const handleSignUp = () => {
        if (password === '' || confirmPassword === '') {
            alert('Please enter all fields')
        }
        else if (password !== confirmPassword) {
            alert("Passwords do not match");
        }
        else if (!password.match(passwordFormat))
            alert(
                "Password must be 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character"
            );
        else {
            const user = {
                email: route.params.email,
                password
            }
            changeSpin(true)
            axios
                .post('https://thunderpe.herokuapp.com/auth/changePassword', user)
                .then((res) => {
                    changeSpin(false)
                    navigation.dispatch(StackActions.replace('Login'))
                })
        }
    }


    const backAction = () => {
        setTimeout(() => {
            setExitApp(0);
        }, 2000); // 2 seconds to tap second-time

        if (exitApp === 0) {
            setExitApp(exitApp + 1);

            ToastAndroid.show('Press back again to exit app', ToastAndroid.SHORT);
        } else if (exitApp === 1) {
            BackHandler.exitApp();
        }
        return true;
    };
    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );
        return () => backHandler.remove();
    });
    return (
        <View>
            <View style={mode === 'dark' ? styles.darkHeader : styles.header} >
                <TouchableOpacity
                    style={{ width: "12%" }}
                    onPress={() => (navigation.canGoBack() ? navigation.goBack() : null)}
                >
                    <Image
                        source={navigation.canGoBack() ? Back : null}
                        style={{ left: 12, height: 30, top: 11 }}
                    />
                </TouchableOpacity>
                <Text style={mode === 'dark' ? styles.darkTitle : styles.title}>NEW PASSWORD</Text>
            </View>
            <View>
                <Image source={Logo} style={styles.img} />
                {spin ? (
                    <Spinner
                        visible={spin}
                        textContent={"Registering..."}
                        textStyle={styles.spinnerTextStyle}
                        color="#323133"
                        overlayColor="rgba(255,255,255,0.8)"
                    />
                ) : null}
                <View style={{ alignItems: 'center', marginTop: '15%' }}>
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
                </View>

            </View>
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                    <Text
                        style={{
                            textAlign: "center",
                            marginTop: 8,
                            color: "#fff",
                            fontWeight: "bold",
                        }}
                    >
                        Set Password
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default ResetPassword

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
    title: {
        fontSize: 20,
        color: "white",
        height: 40,
        alignSelf: "center",
        fontWeight: "bold",
        marginTop: 8,
        marginBottom: 20,
        marginLeft: "18%",
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
        marginLeft: "18%",
        top: 9,
    },
    img: {
        alignSelf: "center",
        // width: "85%",
        // height: '10%',
        marginTop: '25%'
    },
    input: {
        borderBottomColor: "#000",
        borderBottomWidth: 1,
        marginBottom: 25,
        height: 40,
        width: '80%',
        paddingLeft: 28
    },
    button: {
        backgroundColor: light.primary,
        marginTop: 10,
        height: 45,
        borderRadius: 25,
        marginBottom: 10,
        width: '80%'
    },
})