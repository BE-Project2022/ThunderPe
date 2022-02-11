import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import Back from "../assets/images/back.png";
import Logo from "../assets/images/Logo_Yel.png";
import Spinner from "react-native-loading-spinner-overlay/lib";
import axios from 'axios';

const SendMoneyToNumber = ({ route, navigation }) => {
    const [show, changeShow] = useState(false);
    const [number, changeNumber] = useState(0)
    const [payee, setPayee] = useState([])
    const currentUser = route.params.currentUser


    const setNumber = (e) => {
        changeShow(false)
        changeNumber(parseInt(e))
    }

    var userData = []
    useEffect(() => {
        // payee.splice(0, payee.length);
        userData.splice(0, userData.length);
        axios
            .get("https://thunderpe.herokuapp.com/auth/getallusers")
            .then((res) => {
                res.data.forEach(item => {
                    // console.log(item.fullname)
                    userData.push(item)
                    // console.log(userData)
                })
            })
            .catch((err) => {
                // alert(err.response.data.error);
                // console.log(err.response);
                changeSpin(false);
            });
    })
    const showUser = () => {
        payee.splice(0, payee.length);
        if (number.toString().length < 10) {
            alert('Enter 10 Digits Number')
            changeShow(false)
        }
        else if (number === route.params.currentUser.mobile) {
            alert('Cannot Send Money to self')
        }
        else {
            // console.log(number)
            // console.log(typeof (userData[0]))
            let temp = userData.find(item => item.mobile === number)
            if (temp != undefined) {
                temp = { ...temp, phoneNumbers: [{ number: temp.mobile }], name: temp.fullname }
                console.log(temp)
                payee.push(temp)
                console.log(payee)
            }
            changeShow(true)
        }

    }
    const renderItem = ({ item }) => (
        // console.log(item[0])

        < View key={item.id} style={styles.container} >
            <Text style={{ fontWeight: 'bold', marginLeft: '15%' }}>USER FOUND: </Text>
            <TouchableOpacity
                style={{ marginLeft: 12 }}

                onPress={() =>
                    navigation.navigate("EnterAmount", {
                        user: item,
                        currentUser: currentUser,
                    })
                }
            >
                <Text style={{ fontSize: 22, marginTop: 15, marginLeft: '15%' }}>{item.fullname}</Text>
                <Text style={{ fontSize: 16, marginLeft: '15%' }}>
                    {item.mobile}
                </Text>
            </TouchableOpacity>
        </View >
    );

    return (
        <View>
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
                <Text style={styles.title}>ENTER NUMBER</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
                <Image source={Logo} style={styles.img} />
                <Text
                    style={{
                        fontSize: 24,
                        marginTop: -25,
                        fontWeight: 'bold'
                    }}>
                    Enter a Phone Number
                </Text>
                <TextInput
                    placeholder="00000 00000"
                    style={styles.input}
                    keyboardType='number-pad'
                    selectionColor='#ffc100'
                    maxLength={10}
                    onChangeText={setNumber}
                    onSubmitEditing={showUser}
                />
                {payee.length === 0 && show ? (
                    <Text style={{ marginTop: '5%', fontSize: 16, color: 'red' }}>No User Found! Please check phone number</Text>
                ) : null
                }
                {payee && show ? (
                    <FlatList
                        data={payee}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{ paddingBottom: 118 }}
                        style={{ marginTop: 0, width: '100%' }}
                    />
                ) : null}
            </View>
        </View>
    )
}

export default SendMoneyToNumber

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        color: "white",
        // backgroundColor: "#FFC100",
        height: 40,
        alignSelf: "center",
        fontWeight: "bold",
        marginTop: 8,
        marginBottom: 20,
        marginLeft: "18%",
        top: 9,
    },
    header: {
        backgroundColor: "#ffc100",
        height: 49,
        flexDirection: "row",
    },
    img: {
        alignSelf: "center",
        width: "40%",
        marginTop: -80,
    },
    input: {
        height: 60,
        width: 280,
        backgroundColor: '#ebebe8',
        marginTop: '10%',
        paddingLeft: 20,
        fontSize: 22,
        borderColor: '#ffc100',
        borderWidth: 2
    },
    container: {
        borderBottomWidth: 1,
        borderBottomColor: "#D8D2D2",
        paddingBottom: 10,
        paddingTop: 10,
    },
})