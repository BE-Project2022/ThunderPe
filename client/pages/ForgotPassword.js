import { Image, StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, TextInput, useColorScheme } from 'react-native';
import React, { useState } from 'react';
import Logo from "../assets/images/Final_Logo_Oran.png";
import DarkLogo from "../assets/images/Final_Logo_Dark.png";
import User from '../assets/images/user.png'
import Mobile from "../assets/images/mobile.png"
import darkMobile from "../assets/images/mobile_white.png"
import Back from '../assets/images/back.png'
import { StackActions } from '@react-navigation/routers';
import axios from 'axios'
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { dark, light } from '../controllers/Theme';
import darkUser from "../assets/images/user_white.png";
// dark
const ForgotPassword = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [spin, changeSpin] = useState(false)
    var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    var mobileFormat = /^\d{10}$/;
    const mode = useColorScheme()


    const changeEmail = (e) => {
        setEmail(e);
    };
    const changeMobile = (e) => {
        setMobile(e);
    };

    const getOTP = async () => {
        // console.log(email, mobile)
        if (email === '' || mobile === '') {
            alert('Please fill all the fields')
        }
        else if (!email.match(mailFormat))
            alert('Please check username')
        else if (!mobile.match(mobileFormat))
            alert('Mobile Number must contain 10 digits')
        else {
            let mob = parseInt(mobile)
            // console.log(mob)
            const user = { email: email, mobile: mob }
            changeSpin(true)
            await axios
                .post('https://thunderpe.herokuapp.com/auth/forgotPassword', user)
                .then((res) => {
                    console.log('Authenticated')
                    changeSpin(false)

                    navigation.dispatch(StackActions.replace('EnterOTP', { id: res.data.id, email: res.data.user.email }))
                })
                .catch((err) => {
                    console.log(err)
                    alert("Invalid Mobile or Email")
                    changeSpin(false)
                })

        }
    }
    return (
        <KeyboardAvoidingView behavior="position" style={{ flexGrow: 1, height: '100%', backgroundColor: mode === 'dark' ? dark.background : '#fff' }}>
            <View style={mode === 'dark' ? { backgroundColor: dark.background } : { backgroundColor: "#fff" }}>
                <View style={mode === 'dark' ? styles.darkHeader : styles.header}>
                    <TouchableOpacity onPress={() => navigation.canGoBack() ? navigation.goBack() : null} style={{ width: '12%' }}>
                        <Image source={navigation.canGoBack() ? Back : null} style={{ left: 12, height: 30, top: 11 }} />
                    </TouchableOpacity>
                    <Text style={mode === 'dark' ? styles.darkTitle : styles.title}>FORGOT PASSWORD?</Text>
                </View>
                <View style={mode === 'dark' ? styles.darkContainer : styles.container}>
                    <Image source={Logo} style={styles.img} />
                    <Text style={
                        {
                            fontSize: 20,
                            color: mode === 'dark' ? "white" : "black",
                            // backgroundColor: "#FFC100",
                            height: 40,
                            textAlign: "center",
                            fontWeight: "bold",
                            marginTop: '15%',
                            marginBottom: 20
                        }}>FORGOT PASSWORD?</Text>
                    {spin ? (<Spinner
                        visible={spin}
                        textContent={'Sending OTP...'}
                        textStyle={styles.spinnerTextStyle}
                        color='#323133'
                        overlayColor='rgba(255,255,255,0.8)'

                    />) : null}
                    <View style={{ position: 'relative' }}>
                        <TextInput
                            style={mode === 'dark' ? styles.darkInput : styles.input}
                            placeholder="Username (Email Id)"
                            onChangeText={changeEmail}
                            placeholderTextColor={mode === 'dark' ? 'grey' : 'grey'}
                        />
                        <Image source={User} style={{ position: 'absolute', top: 10, right: 5 }} />
                    </View>

                    <View style={{ position: 'relative' }}>
                        <TextInput
                            placeholder="Mobile"
                            keyboardType='numeric'
                            style={mode === 'dark' ? styles.darkInput : styles.input}
                            onChangeText={changeMobile}
                            placeholderTextColor={mode === 'dark' ? 'grey' : 'grey'}
                        />
                        <Image source={Mobile} style={{ position: 'absolute', top: 10, right: 5 }} />
                    </View>
                    <TouchableOpacity
                        style={mode === 'dark' ? styles.darkButton : styles.button}
                        onPress={() => getOTP()}
                    >
                        <Text style={{ textAlign: 'center', marginTop: 8, color: '#fff', fontWeight: "bold" }}>Get OTP</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({

    header: {
        backgroundColor: light.primary,
        height: 49,
        flexDirection: 'row'
    },
    darkHeader: {
        backgroundColor: dark.primary,
        height: 49,
        flexDirection: 'row'
    },
    container: {
        backgroundColor: "#fff",
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
        // width: "120%",
        marginTop: '25%'
    },
    button: {
        backgroundColor: light.primary,
        marginTop: 10,
        height: 45,
        borderRadius: 25,
        marginBottom: 10
    },
    darkButton: {
        backgroundColor: dark.primary,
        marginTop: 10,
        height: 45,
        borderRadius: 25,
        marginBottom: 10
    },
    title: {
        fontSize: 20,
        color: "white",
        // backgroundColor: "#FFC100",
        height: 40,
        alignSelf: 'center',
        fontWeight: "bold",
        marginTop: 8,
        marginBottom: 20,
        marginLeft: '12%',
        top: 9
    },
    darkTitle: {
        fontSize: 20,
        color: "black",
        // backgroundColor: "#FFC100",
        height: 40,
        alignSelf: 'center',
        fontWeight: "bold",
        marginTop: 8,
        marginBottom: 20,
        marginLeft: '12%',
        top: 9
    },
    input: {
        borderBottomColor: "#000",
        borderBottomWidth: 1,
        marginBottom: 25,
        height: 40,
    },
    darkInput: {
        borderBottomColor: dark.text,
        borderBottomWidth: 1,
        marginBottom: 25,
        height: 40,
        color: dark.text
    },
});
export default ForgotPassword;
