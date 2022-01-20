import { Image, StyleSheet, Text, View, Button, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import React from 'react';
import Logo from "../assets/images/Logo_Yel.png";
import Input from "../components/Input";
import User from '../assets/images/user.png'
import Email from '../assets/images/email.png'
import Mobile from "../assets/images/mobile.png"
import Key from "../assets/images/key.png"
const SignUp = () => {
    return (
        <KeyboardAvoidingView behavior='position'>
            <View>
                <View style={styles.header}>
                    <Text style={styles.title}>SIGN UP</Text>
                </View>
                <View style={styles.container}>
                    <Image source={Logo} style={styles.img} />
                    <View style={{ position: 'relative' }}>
                        <Input name="Full Name" val="false" />
                        <Image source={User} style={{ position: 'absolute', top: 10, right: 5 }} />
                    </View>
                    <View style={{ position: 'relative' }}>
                        <Input name="Email Id" val="false" />
                        <Image source={Email} style={{ position: 'absolute', top: 10, right: 5 }} />
                    </View>
                    <View style={{ position: 'relative' }}>
                        <Input name="Mobile" val="false" type="numeric" />
                        <Image source={Mobile} style={{ position: 'absolute', top: 10, right: 5 }} />
                    </View>
                    <View style={{ position: 'relative' }}>
                        <Input name="Password" val="true" />
                        <Image source={Key} style={{ position: 'absolute', top: 10, right: 5 }} />
                    </View>
                    <View style={{ position: 'relative' }}>
                        <Input name="Confirm Password" val="true" />
                        <Image source={Key} style={{ position: 'absolute', top: 10, right: 5 }} />
                    </View>
                    <View>
                        <TouchableOpacity style={styles.button}>
                            <Text style={{ textAlign: 'center', marginTop: 8, color: '#fff', fontWeight: "bold" }}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.bottomText}>
                        <Text style={{ marginBottom: 10 }}>Already a user? Login here</Text>
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
    },
    button: {
        backgroundColor: "#ffc100",
        marginTop: 10,
        height: 45,
        borderRadius: 25,
        marginBottom: 10
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
        marginBottom: 20
    },
    header: {
        backgroundColor: "#ffc100",
        height: 49
    },
});
