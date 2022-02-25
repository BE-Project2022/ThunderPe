import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView,
    Button,
    useColorScheme,
    FlatList,
    Dimensions,
    TextInput,
    KeyboardAvoidingView,
    Alert,
    LogBox
} from "react-native";
import Pin from "../assets/images/pin.png";
import Mobile from "../assets/images/mobile.png";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { Menu, MenuItem, MenuDivider } from "react-native-material-menu";
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from "expo-linear-gradient";
import User from "../assets/images/user.png";
import Email from "../assets/images/email.png";
import { StackActions, NavigationAction } from "@react-navigation/routers";
import Logo from "../assets/images/Short_Logo_White.png";
import { dark, light } from "../controllers/Theme";
import Back from "../assets/images/back.png";
import QRCode from "react-native-qrcode-svg";
import axios from "axios";
import { storeData } from "../controllers/Data";
import jwtDecode from "jwt-decode";
import Camera from '../assets/images/camera.png'
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from "../controllers/Firebase";

const window = Dimensions.get('window');
let base64Logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAA..';
const UserProfile = ({ route, navigation }) => {
    LogBox.ignoreLogs([`Setting a timer for a long period`]);
    LogBox.ignoreLogs(['Warning: ...']);
    const user = route.params.currentUser
    const { name, email, mobile, pin } = user
    const oldName = name
    const oldPin = pin
    let url = 'https://firebasestorage.googleapis.com/v0/b/thunderpe-33b6a.appspot.com/o/files%2Fuser.png?alt=media&token=007a7e33-42d9-4848-a9ff-665b6df3bd7b'
    const [fullname, setFullname] = useState(name);
    const [spin, changeSpin] = useState(false);
    const [LoginPin, setPin] = useState(pin);
    const [image, setImage] = useState(user.image);
    const [isOnState, setIsOnState] = useState(false);



    const hideMenu = () => setIsOnState(false);

    const showMenu = () => setIsOnState(true);
    var usersData = []
    useEffect(() => {

        axios
            .get("https://thunderpe.herokuapp.com/auth/getallusers")
            .then((res) => {
                res.data.forEach(item => {
                    // console.log(item.fullname)
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


    const changeFullname = (e) => {
        setFullname(e);
    };

    const changePin = (e) => {
        setPin(e);
        // console.log(typeof (e))
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

    const uploadImage = async (file) => {
        changeSpin(true)
        if (image != undefined) {
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    resolve(xhr.response);
                };
                xhr.onerror = function () {
                    reject(new TypeError("Network request failed"));
                };
                xhr.responseType = "blob";
                xhr.open("GET", image, true);
                xhr.send(null);
            });

            const fileRef = ref(storage, `files/${user.id}`);
            console.log('Hi')

            const result = await uploadBytes(fileRef, blob)
            console.log('Hello')


            // We're done with the blob, close and release it
            blob.close();

            await getDownloadURL(fileRef).then((res) => url = res);
            // console.log(url)
        }
        updateProfile()
    }

    const updateProfile = async (e) => {
        let changeURL = url
        console.log(url)
        if (fullname === "" || pin === "") {
            alert("Please fill in all fields");
        }
        else if (fullname != oldName) {
            Alert.alert(
                "!! Notice !!",
                "Changing name may change your QR Code as well! ",
                [
                    {
                        text: "Cancel",
                        style: "cancel"

                    },
                    {
                        text: 'Proceed',
                        onPress: () => {
                            const updateUser = { email, fullname, pin: parseInt(LoginPin), image: url }
                            console.log(updateUser)

                            axios
                                .post('https://thunderpe.herokuapp.com/auth/updateUser', updateUser)
                                .then((res) => {
                                    // console.log(res)
                                    storeData(res.data.token)
                                    changeSpin(false)
                                    // console.log(res.data)
                                    const decoded = jwtDecode(res.data.token);
                                    // console.log(decoded);
                                    navigation.dispatch(StackActions.replace('Dashboard', { user: route.params.currentUser, users: route.params.users }));
                                })
                                .catch((e) => console.log(e.response))
                        }
                    }
                ]
            )
        }
        else {
            const updateUser = { email, fullname, pin: parseInt(LoginPin), image: url }
            console.log('UDPDATED: ', updateUser)
            changeSpin(true)
            axios
                .post('https://thunderpe.herokuapp.com/auth/updateUser', updateUser)
                .then((res) => {
                    // console.log(res)
                    storeData(res.data.token);
                    changeSpin(false)
                    const decoded = jwtDecode(res.data.token);
                    console.log(decoded);
                    navigation.dispatch(StackActions.replace('Dashboard', { user: decoded, users: route.params.users }));

                })
                .catch((e) => console.log(e))

        }
    }
    // console.log(user)

    const mode = useColorScheme()
    return (
        <KeyboardAvoidingView behavior="position">
            <View>
                <View style={mode == "dark" ? styles.darkHeader : styles.header}>
                    <TouchableOpacity
                        style={{ width: "12%" }}
                        onPress={() => (navigation.canGoBack() ? navigation.goBack() : null)}
                    >
                        <Image
                            source={navigation.canGoBack() ? Back : null}
                            style={{ left: 12, height: 30, top: 11 }}
                        />
                    </TouchableOpacity>
                    <Text style={mode === 'dark' ? styles.darkTitle : styles.title}>USER</Text>
                </View>
                <View style={styles.background}>
                    <LinearGradient
                        colors={[light.primary, light.secondary]}
                        style={styles.linearGradient}
                        locations={[0.77, 0.95]}
                    >
                    </LinearGradient>
                    <View style={{ alignItems: 'center', marginTop: window.height / 45 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Hello {name}</Text>
                        <Image source={image ? { uri: image } : { uri: url }} style={{ width: 120, height: 120, marginTop: 10, borderRadius: 60 }} />
                        <Menu
                            visible={isOnState}
                            anchor={<TouchableOpacity onPress={showMenu}>
                                <Image
                                    source={Camera}
                                    style={{ height: 30, width: 30, backgroundColor: 'black' }}
                                    tintColor='white'
                                />
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
                <View style={{ alignItems: 'center', marginTop: 10 }}>
                    <QRCode
                        value={`${email},${mobile},${name},${image}`}
                        logo={{ uri: base64Logo }}
                        logoBackgroundColor='transparent'
                    />
                </View>
                <View style={{ width: '70%', alignSelf: 'center', marginTop: 20 }}>
                    <View>
                        <TextInput
                            style={styles.input}
                            value={email}
                            editable={false}
                            placeholderTextColor={mode === 'dark' ? 'grey' : 'grey'}
                        />
                        <Image source={Email} style={{ position: "absolute", top: 10 }} tintColor="#fc6203" />
                    </View>
                    <View>
                        <TextInput
                            style={styles.input}
                            value={fullname}
                            onChangeText={changeFullname}
                        />
                        <Image source={User} style={{ position: "absolute", top: 10 }} tintColor="#1c03fc" />
                    </View>
                    <View>
                        <TextInput
                            style={styles.input}
                            value={mobile.toString()}
                            editable={false}
                            placeholderTextColor={mode === 'dark' ? 'grey' : 'grey'}
                        />
                        <Image source={Mobile} style={{ position: "absolute", top: 10 }} tintColor="#1a5216" />
                    </View>
                    <View>
                        <TextInput
                            style={styles.input}
                            value={LoginPin.toString()}
                            onChangeText={changePin}
                            maxLength={4}
                            keyboardType='number-pad'
                        />
                        <Image source={Pin} style={{ position: "absolute", top: 10 }} tintColor="#431652" />
                    </View>
                    <View>
                        <TouchableOpacity style={styles.button} onPress={uploadImage} >
                            <Text
                                style={{
                                    textAlign: "center",
                                    marginTop: 8,
                                    color: "#fff",
                                    fontWeight: "bold",
                                }}
                            >
                                Update Profile
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

export default UserProfile

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
        marginLeft: "30%",
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
        marginLeft: "30%",
        top: 9,
    },
    background: { // this shape is a circle 
        alignSelf: 'center',
        width: window.width,
        overflow: 'hidden',
        height: window.width / 1.8,

    },
    linearGradient: {
        borderRadius: window.width,
        width: window.width * 2,
        height: window.width * 2,
        marginLeft: -(window.width / 2),
        position: 'absolute',
        bottom: 0,
        overflow: 'hidden'
    },
    input: {
        borderBottomColor: "#000",
        borderBottomWidth: 1,
        marginBottom: 25,
        height: 40,
        // flex: 1,
        paddingLeft: 30,
    },
    button: {
        backgroundColor: light.primary,
        marginTop: 10,
        height: 45,
        borderRadius: 25,
        marginBottom: 10,
    },
})