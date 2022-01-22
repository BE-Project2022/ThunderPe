import { Image, StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, TextInput } from 'react-native';
import React, { useState } from 'react';
import Logo from "../assets/images/Logo_Yel.png";
import User from '../assets/images/user.png'
import Email from '../assets/images/email.png'
import Mobile from "../assets/images/mobile.png"
import Key from "../assets/images/key.png"
import Back from '../assets/images/back.png'
import { getStateFromPath } from '@react-navigation/core';
import axios from 'axios'
const ForgotPassword = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");

    const changeEmail = (e) => {
        setEmail(e);
    };
    const changeMobile = (e) => {
        setMobile(e);
    };

    const getOTP = () => {
        // console.log(email, mobile)
        if (email === '' || mobile === '') {
            alert('Please fill all the fields')
        }
        else {

        }
    }
    return (
        <View style={{ backgroundColor: "#fff", height: '100%' }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.canGoBack() ? navigation.goBack() : null} style={{ width: '12%' }}>
                    <Image source={navigation.canGoBack() ? Back : null} style={{ left: 12, height: 30, top: 11 }} />
                </TouchableOpacity>
                <Text style={styles.title}>FORGOT PASSWORD?</Text>
            </View>
            <View style={styles.container}>
                <Image source={Logo} style={styles.img} />
                <Text style={{
                    fontSize: 20,
                    color: "black",
                    // backgroundColor: "#FFC100",
                    height: 40,
                    textAlign: "center",
                    fontWeight: "bold",
                    marginTop: 8,
                    marginBottom: 20
                }}>FORGOT PASSWORD?</Text>
                <View style={{ position: 'relative' }}>
                    <TextInput
                        style={styles.input}
                        placeholder="Username (Email Id)"
                        onChangeText={changeEmail}
                    />
                    <Image source={User} style={{ position: 'absolute', top: 10, right: 5 }} />
                </View>

                <View style={{ position: 'relative' }}>
                    <TextInput
                        placeholder="Mobile"
                        keyboardType='numeric'
                        style={styles.input}
                        onChangeText={changeMobile}
                    />
                    <Image source={Mobile} style={{ position: 'absolute', top: 10, right: 5 }} />
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => getOTP()}
                >
                    <Text style={{ textAlign: 'center', marginTop: 8, color: '#fff', fontWeight: "bold" }}>Get OTP</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({

    header: {
        backgroundColor: "#ffc100",
        height: 49,
        flexDirection: 'row'
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
    input: {
        borderBottomColor: "#000",
        borderBottomWidth: 1,
        marginBottom: 25,
        height: 40,
    },
});
export default ForgotPassword;
