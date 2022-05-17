import { StyleSheet, Text, View, FlatList, Image, ScrollView, SafeAreaView, useColorScheme, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import axios, { Axios } from "axios";
import Spinner from "react-native-loading-spinner-overlay";
import moment from 'moment'
import { dark, light } from "../controllers/Theme";
// import axios from "axios";
import Back from "../assets/images/back.png";
const TransactionHistory = ({ navigation, route }) => {
    const user = route.params.user
    // var date = new Date(timestamp);
    const mode = useColorScheme()
    // console.log(date.getTime())
    // console.log(date)
    // console.log(user)
    // console.log(user.address.toLowerCase())
    const [history, setHistory] = useState([])
    const [spin, changeSpin] = useState(false);
    let data = []
    // let timestamp = '1652765732'
    // let time = moment.unix(timestamp)
    // console.log(time)
    // const dates = time.toString()
    // console.log('DATES: ', dates)
    // const temp = dates.split(" ")
    // console.log(temp)

    useEffect(async () => {
        changeSpin(true)
        const temp = await axios.post('https://thunderpe.herokuapp.com/auth/transactionHistory', user)
        data = temp.data.result
        // console.log(data[0])
        // console.log(temp.data.result.length)
        updateHistory()
    }, [])
    const check = async () => {

        // console.log(data[0])

    }
    // check()

    const updateHistory = async () => {
        console.log('HIs')
        // console.log(user.address.toLowerCase())
        history.splice(0, history.length)
        let temp = []
        for (var i = 0; i < data.length; i++) {
            if (data[i].from === user.address.toLowerCase()) {
                // console.log('HERE')
                const to = data[i].to.toLowerCase()
                console.log(to)
                const toAddr = { address: to }
                try {
                    const receiver = await axios.post('https://thunderpe.herokuapp.com/auth/oneUser', toAddr)

                    // console.log(receiver.data)
                    if (receiver.data) {
                        var timestamp = data[i].timeStamp
                        var time = moment.unix(timestamp)
                        // console.log(timestamp)
                        // console.log(time)
                        const dates = time.toString()
                        // console.log('DATES: ', dates)
                        const d = dates[0]
                        const temp = dates.split(" ")
                        // console.log(temp)
                        const answer = temp[0] + ' ' + temp[1] + ' ' + temp[2] + ' ' + temp[3]
                        // console.log('ANSEWER: ', answer)
                        // console.log(receiver.data.user.fullname)
                        const create = {
                            id: i,
                            name: receiver.data.user.fullname,
                            value: data[i].value,
                            date: answer,
                            image: receiver.data.user.image,
                            to: true
                        }
                        temp.push(create)
                        history.push(create)
                    }
                } catch (err) { }
            }
            else {
                const from = data[i].from.toLowerCase()
                // console.log(from)
                const fromAddr = { address: from }
                try {
                    const receiver = await axios.post('https://thunderpe.herokuapp.com/auth/oneUser', fromAddr)

                    // console.log(receiver.data)
                    if (receiver.data) {
                        var timestamp = data[i].timeStamp
                        var time = moment.unix(timestamp)
                        // console.log(typeof time)
                        const dates = time.toString()
                        // console.log(dates[0])
                        const d = dates[0]
                        const temp = dates.split(" ")
                        // console.log(temp)
                        const answer = temp[0] + ' ' + temp[1] + ' ' + temp[2] + ' ' + temp[3]
                        // console.log(answer)
                        // console.log(receiver.data.user.fullname)
                        const create = {
                            id: i,
                            name: receiver.data.user.fullname,
                            value: data[i].value,
                            date: answer,
                            image: receiver.data.user.image,
                            to: false
                        }
                        temp.push(create)
                        history.push(create)
                    }
                } catch (err) { }
            }
        }


        changeSpin(false)
        // console.log(history)
    }

    function Item({
        title
    }) {
        // console.log(title.image)
        return (
            <View>
                <View style={styles.item}>
                    <Image style={{ height: 50, width: 60 }} source={{ uri: title.image }} />
                    <View style={{ flexDirection: 'column', }}>
                        <Text style={styles.title2}>{title.name}</Text>
                        <Text style={styles.date}>{title.date}</Text>

                    </View>
                    <Text style={title.to ? styles.red : styles.green}>{"\u20B9 " + title.value}</Text>
                </View>
                <View
                    style={{
                        backgroundColor: "#D8D2D2",
                        height: 1,
                        width: "104%",
                        marginTop: '-3%',
                        marginLeft: -20,
                    }}
                />
            </View>
        );
    }


    return (
        <SafeAreaView style={styles.container}>
            {spin ? (
                <Spinner
                    visible={spin}
                    textContent={"Working on it..."}
                    textStyle={styles.spinnerTextStyle}
                    color="#323133"
                    overlayColor="rgba(255,255,255,0.8)"
                />
            ) : null}
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
                <Text style={mode === 'dark' ? styles.darkTitle : styles.title}>TRANSACTION HISTORY</Text>
            </View>
            <FlatList data={history} renderItem={({ item }) =>
                <Item title={item} />} keyExtractor={item => item.id} />
        </SafeAreaView>
    )
}

export default TransactionHistory

const styles = StyleSheet.create({

    container: {
        flex: 1,
        // marginTop: Constants.statusBarHeight,
    },
    item: {
        backgroundColor: 'white',
        padding: 8,
        marginVertical: 8,
        marginHorizontal: 16,
        marginBottom: 15,
        flexDirection: 'row'
    },
    title2: {
        fontSize: 18,
        marginLeft: 20,
        marginTop: 2,
        color: 'black',
        fontWeight: 'bold'
    },
    header: {
        backgroundColor: light.primary,
        height: 49,
        flexDirection: "row",
    },
    darkHeader: {
        backgroundColor: dark.primary,
        height: 49,
        flexDirection: "row",
    }, title: {
        fontSize: 20,
        color: "white",
        height: 40,
        alignSelf: "center",
        fontWeight: "bold",
        marginTop: 8,
        marginBottom: 20,
        marginLeft: "10%",
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
        marginLeft: "10%",
        top: 9,
    },
    date: {
        fontSize: 13,
        color: 'grey',
        marginLeft: 20
    },
    red: {
        color: 'red',
        marginLeft: '20%',
        fontSize: 24
    },
    green: {
        color: 'green',
        marginLeft: '20%',
        fontSize: 24

    }
})