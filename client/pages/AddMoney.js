import { StyleSheet, Text, View, FlatList, Image, ScrollView, SafeAreaView, useColorScheme, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
// import Checkout from '../controllers/Checkout'
import axios, { Axios } from "axios";
import Spinner from "react-native-loading-spinner-overlay";

import moment from 'moment'
import { dark, light } from "../controllers/Theme";

// import axios from "axios";
import Back from "../assets/images/back.png";
const AddMoney = ({ navigation, route }) => {
    const mode = useColorScheme()
    const curr = route.params.currentUser
    const users = route.params.users
    const balance = route.params.balance
    const [amount, setAmount] = useState("1");
    const [spin, changeSpin] = useState(false);
    const stripe = useStripe();
    console.log(curr.address)
    // console.log(props.curr)
    const donate = async () => {
        try {
            const finalAmount = parseInt(amount);
            if (finalAmount < 1) return Alert.alert("You cannot send below 1 INR");
            const response = await fetch("https://thunderpe.herokuapp.com/auth/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ amount: finalAmount, name: 'ThunderPe' }),
            });
            const data = await response.json();
            if (!response.ok) {
                return Alert.alert(data.message);
            }
            const initSheet = await stripe.initPaymentSheet({
                paymentIntentClientSecret: data.clientSecret,
                merchantDisplayName: 'Merchant Name'
            });
            if (initSheet.error) {
                console.error(initSheet.error);
                return Alert.alert(initSheet.error.message);
            }
            const presentSheet = await stripe.presentPaymentSheet({
                clientSecret: data.clientSecret,
            });
            if (presentSheet.error) {
                console.error(presentSheet.error);
                return Alert.alert(presentSheet.error.message);
            }
            const sendData = {
                to: curr.address,
                amount: parseInt(amount)
            }
            changeSpin(true)
            axios.post('https://thunderpe.herokuapp.com/auth/addToWallet', sendData)
                .then((res) => {
                    changeSpin(false)
                    // console.log(res.data)
                    Alert.alert("Added amount to wallet.");
                    navigation.goBack()
                })
                .catch((err) => {
                    console.error(err.response);
                    changeSpin(false)
                    Alert.alert("Payment failed!")
                });

        } catch (err) {
            console.error(err);
            changeSpin(false)
            Alert.alert("Payment failed!");
        }
    };
    return (
        <View>
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
                <Text style={mode === 'dark' ? styles.darkTitle : styles.title}>ADD TO WALLET</Text>
            </View>
            <View>
                {spin ? (
                    <Spinner
                        visible={spin}
                        textContent={"Transferring to wallet..."}
                        textStyle={styles.spinnerTextStyle}
                        color="#323133"
                        overlayColor="rgba(255,255,255,0.8)"
                    />
                ) : null}
                <StripeProvider publishableKey="pk_test_51KzvJoSDgNUXPQuHrq8wvA5egAmuzKUJl0ATOIRxwnlocNjajgyZQpJLaLeLIFyYJTwHIXxxR5DflaatavG7BrSl00yDTsWTmP">
                    <View >
                        <View style={{ marginTop: '15%', alignItems: 'center' }}>
                            <Text style={{ marginTop: '3%', fontSize: 16, fontWeight: 'bold' }}>User: {curr.name}</Text>
                            <Text style={{ marginTop: '3%', fontSize: 16, fontWeight: 'bold' }}>Wallet Address: </Text>
                            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{curr.address}</Text>
                        </View>
                        <View style={styles.container}>
                            <Text>
                                Enter Amount:
                            </Text>
                            <TextInput
                                placeholder="Amount"
                                keyboardType="numeric"
                                style={{ padding: 10, borderColor: "black", borderWidth: 1, marginTop: '4%', backgroundColor: '#ebebe8', }}
                                value={amount}
                                onChangeText={(e) => setAmount(e)}
                            />
                            <TouchableOpacity style={styles.button} onPress={donate}>
                                <Text
                                    style={{
                                        textAlign: "center",
                                        marginTop: 8,
                                        color: "#fff",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Add to Wallet
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </StripeProvider>
            </View>
        </View>
        // 
    )
}

export default AddMoney

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
        marginLeft: "20%",
        top: 9,
    },
    darkTitle: {
        fontSize: 20,
        color: 'white',
        height: 40,
        alignSelf: "center",
        fontWeight: "bold",
        marginTop: 8,
        marginBottom: 20,
        marginLeft: "20%",
        top: 9,
    },
    container: {
        marginTop: '25%',
        width: '80%',
        alignSelf: 'center'
    },
    button: {
        backgroundColor: light.primary,
        marginTop: 10,
        height: 45,
        borderRadius: 25,
        marginBottom: 10,
    },
})