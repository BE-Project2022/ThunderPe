import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Button,
  useColorScheme,
  FlatList,
  Animated,
  Dimensions,
  LogBox
} from "react-native";
import { ScrollView } from 'react-native-gesture-handler'
import { StackActions } from "@react-navigation/routers";
import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import Logo from "../assets/images/Short_Logo_White.png";
import { LinearGradient } from "expo-linear-gradient";
import Rupee from "../assets/images/rupee.png";
import BottomSheet from "react-native-bottomsheet-reanimated";
import Less from "../assets/images/less.png";
import More from "../assets/images/more.png";
import Reward from "../assets/images/reward.png";
import Next from "../assets/images/next.png";
import { dark, light } from "../controllers/Theme";
import { Menu, MenuItem, MenuDivider } from "react-native-material-menu";
import QR from "../assets/images/qr.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
const window = Dimensions.get('window');
const Dashboard = ({ route, navigation }) => {
  let url = 'https://firebasestorage.googleapis.com/v0/b/thunderpe-33b6a.appspot.com/o/files%2Fuser.png?alt=media&token=007a7e33-42d9-4848-a9ff-665b6df3bd7b'
  LogBox.ignoreLogs(['Warning: ...']);
  const [screenCover, setScreenCover] = useState("70%");
  const [expanded, setExpanded] = useState(false);
  const [userData, setData] = useState([]);
  const [isOnState, setIsOnState] = useState(false);

  const user = route.params.user; //token
  // console.log(user)
  const mode = useColorScheme();
  // console.log(route.params.user)
  const [fadeAnim, setFadeAnim] = useState(new Animated.Value(0))
  // console.log(route.params.users)
  const changeCover = (e) => {
    setScreenCover(e.value);
  };
  // console.log(route.params.users)
  // console.log(useIsFocused())
  // var userData = [];
  useFocusEffect(
    useCallback(() => {

      Animated.timing(
        fadeAnim,
        {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        }
      ).start()
    }, [fadeAnim])
  )
  useEffect(() => {
    userData.splice(0, userData.length);
    if (route.params.users.length > 9 && expanded) showAllUsers();
  }, [expanded, fadeAnim]);



  const hideMenu = () => setIsOnState(false);

  const showMenu = () => setIsOnState(true);

  const payUser = (e) => {
    // console.log(route.params.users[e])
    route.params.users[e] = {
      ...route.params.users[e],
      phoneNumbers: [{ number: route.params.users[e].mobile }],
      name: route.params.users[e].fullname,
    };

    navigation.navigate("EnterAmount", {
      user: route.params.users[e],
      currentUser: route.params.user,
      users: route.params.users
    });
    setFadeAnim(new Animated.Value(0))
  };

  const showAllUsers = () => {
    // console.log('HERE')
    setExpanded(true);

    userData.splice(0, userData.length);
    let i = 0
    // console.log(userData.length)
    for (i = 0; i < route.params.users.length; i++) {

      const u = route.params.users[i].fullname.split(" ");
      const temp = i;
      userData.push(
        <View key={i}>
          <TouchableOpacity onPress={(res) => payUser(temp)}>
            <View style={{ marginTop: 14, marginLeft: 20 }}>
              <Image
                source={route.params.users[i].image != null ? { uri: route.params.users[i].image } : { uri: url }}
                style={{ height: 55, width: 55, borderRadius: 60 }}
              />
              <Text style={{ marginLeft: 4 }}>{u[0]}</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
    userData.push(
      <View
        key={i}
        style={{
          width: 48,
          height: 48,
          borderRadius: 44,
          borderColor: "black",
          borderWidth: 1.5,
          marginTop: 20,
          marginLeft: 24,
        }}
      >
        <TouchableOpacity onPress={() => {
          console.log('hi')
          setExpanded(false)
        }}>
          <Image source={Less} style={{ alignSelf: "center", marginTop: 10 }} />
          <Text style={{ marginTop: 14, marginLeft: 3 }}>Less</Text>
        </TouchableOpacity>
      </View>
    );
  };
  // console.log("HERE: \n", route.params.users)
  const setLessUsers = () => {
    userData.splice(0, userData.length);
    for (let i = 0; i < route.params.users.length; i++) {

      const u = route.params.users[i].fullname.split(" ");
      const temp = i;
      userData.push(
        <View key={i}>
          <TouchableOpacity onPress={(res) => payUser(temp)}>
            <View style={{ marginTop: 14, marginLeft: 20 }}>
              <Image source={route.params.users[i].image != null ? { uri: route.params.users[i].image } : { uri: url }} style={{ height: 55, width: 55, borderRadius: 60 }} />
              <Text style={{ marginLeft: 10 }}>{u[0]}</Text>
            </View>
          </TouchableOpacity>
        </View>
      );

    }
  };
  const setMoreUsers = () => {
    let i = 0;
    userData.splice(0, userData.length);
    for (i = 0; i < 9; i++) {

      // console.log(route.params.users[i])
      const temp = i;
      const u = route.params.users[i].fullname.split(" ");
      console.log()
      userData.push(
        <View key={i}>
          <TouchableOpacity key={temp} onPress={(res) => payUser(temp)}>
            <View style={{ marginTop: 14, marginLeft: 20 }}>
              <Image source={route.params.users[i].image != null ? { uri: route.params.users[i].image } : { uri: url }} style={{ height: 55, width: 55, borderRadius: 60 }} />
              <Text style={{ marginLeft: 10 }}>{u[0]}</Text>
            </View>
          </TouchableOpacity>
        </View>
      );

    }
    userData.push(
      <View
        key={i}
        style={{
          width: 48,
          height: 48,
          borderRadius: 44,
          borderColor: "black",
          borderWidth: 1.5,
          marginTop: 20,
          marginLeft: 24,
        }}
      >
        <TouchableOpacity onPress={showAllUsers}>
          <Image source={More} style={{ alignSelf: "center", marginTop: 10 }} />
          <Text style={{ marginTop: 14, marginLeft: 3 }}>More</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (route.params.users.length > 9 && !expanded) {
    setMoreUsers();
  } else if (route.params.users.length < 9) {
    setLessUsers();
  }

  return (
    <Animated.View style={{ opacity: fadeAnim }} >
      <View>
        <View style={mode == "dark" ? styles.darkHeader : styles.header}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("BarCodeScan", {
                currentUser: route.params.user,
              })
            }
            style={{ left: '-50%' }}
          >
            <Image source={QR} style={{ width: 40, height: 40 }} />
          </TouchableOpacity>
          <Image source={Logo} style={styles.img} />
          <Text style={styles.title}>THUNDERPE</Text>

          <Menu
            visible={isOnState}
            anchor={
              <TouchableOpacity onPress={showMenu}>
                <Image
                  source={{ uri: user.image }}
                  style={{ marginRight: "4%", height: 35, width: 35, borderRadius: 50 }}
                />
              </TouchableOpacity>
            }
            onRequestClose={hideMenu}
            style={{ marginTop: 45, marginLeft: "-7%", width: "50%" }}
          >
            <MenuItem
              onPress={() => {
                hideMenu();
                navigation.navigate("UserProfile", {
                  currentUser: route.params.user,
                  users: route.params.users
                });
              }}
            >
              Show Profile
            </MenuItem>
            <MenuItem
              onPress={async () => {
                try {

                  await AsyncStorage.removeItem("@storage_Key");
                  navigation.dispatch(StackActions.replace("Login"));
                } catch (error) {
                  console.log("error", error);
                }

              }}
            >
              LogOut
            </MenuItem>
          </Menu>
        </View>
        <View style={styles.background}>
          <LinearGradient
            colors={[light.primary, light.secondary]}
            style={styles.gradient}
            locations={[0.1, 0.24]}
          >
            <View>
              <Text style={screenCover != "70%" ? styles.normal : styles.text}>
                {screenCover === "70%"
                  ? "WALLET BALANCE"
                  : "Balance: \u20B9 150545"}
              </Text>
              <Image
                source={Rupee}
                style={
                  screenCover === "70%"
                    ? { top: 50, alignSelf: "center", height: 40, right: 52 }
                    : null
                }
              />
              <Text
                style={
                  screenCover === "70%"
                    ? { top: 5, alignSelf: "center", fontWeight: 'bold', fontSize: 28, right: -14 }
                    : null
                }
              >
                150545
              </Text>
            </View>
          </LinearGradient>
        </View>
        <BottomSheet
          keyboardAware
          bottomSheerColor="#FFFFFF"
          initialPosition={"70%"} //200, 300
          snapPoints={["70%", "85%"]}
          isRoundBorderWithTipHeader={true}
          enabledInnerScrolling={true}
          enabledContentGestureInteraction={true}
          enabledContentTapInteraction={false}
          // backDropColor="red"
          // isModal
          // containerStyle={{ backgroundColor: "red" }}
          tipStyle={{
            backgroundColor: "black",
            width: 78,
            marginTop: 15,
            height: 3.5,
          }}
          tipHeaderRadius={28}
          // headerStyle={{backgroundColor:"red"}}
          // bodyStyle={{backgroundColor:"red",flex:1}}
          onChangeSnap={changeCover}
          body={
            <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={styles.payments} nestedScrollEnabled={true}>
              <View>
                <Text style={{ fontSize: 18 }}>Recent Payments</Text>
                <View style={styles.paymentUsers}>{userData}</View>
                <View
                  style={{
                    backgroundColor: "#D8D2D2",
                    height: 1,
                    width: "104%",
                    marginTop: '10%',
                    marginLeft: -20,
                  }}
                />
                <View style={{ marginTop: 10 }}>
                  <Text style={{ fontSize: 18 }}>Promotions</Text>
                  <TouchableOpacity style={{ marginTop: 13, width: 59 }}>
                    <Image
                      source={Reward}
                      style={{
                        backgroundColor: "transparent",
                        height: 55,
                        width: 55,
                      }}
                    />
                    <Text style={{ fontSize: 13 }}>Rewards</Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    backgroundColor: "#D8D2D2",
                    height: 1,
                    width: "104%",
                    marginTop: 15,
                    marginLeft: -20,
                  }}
                />
                <View>
                  <TouchableOpacity style={{ height: 60, flexDirection: "row" }}>
                    <Text style={{ fontSize: 18, marginTop: "3.5%" }}>
                      Show Transaction History
                    </Text>
                    <Text
                      style={{
                        fontSize: 18,
                        marginTop: "3.5%",
                        marginLeft: "30%",
                      }}
                    >
                      {" "}
                      {">"}{" "}
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      backgroundColor: "#D8D2D2",
                      height: 1,
                      width: "104%",
                      marginLeft: -20,
                    }}
                  />
                </View>
              </View>
            </ScrollView >
          }
        />
        <TouchableOpacity
          style={styles.paymentButton}
          onPress={() => navigation.navigate("userContacts", { currentUser: user, users: route.params.users })}
        >
          <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
            + New Payment
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default Dashboard;
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    width: "80%",
    alignSelf: "center",
    // height: '100%'
  },
  button: {
    backgroundColor: "#ffc100",
    marginTop: 10,
    height: 45,
    borderRadius: 25,
    marginBottom: 10,
  },
  bottomText: {
    alignItems: "center",
  },
  img: {
    // top: 5,
    height: 55,
  },
  title: {
    fontSize: 20,
    color: "white",
    // backgroundColor: "#FFC100",
    height: 40,
    fontWeight: "bold",
    marginTop: 4,
    marginRight: "17%",
    marginLeft: "-3.2%",
    // marginLeft: -10
    // marginBottom: 20,
  },
  darkHeader: {
    backgroundColor: dark.primary,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  header: {
    backgroundColor: light.primary,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  input: {
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    marginBottom: 25,
    height: 40,
    flex: 1,
    paddingLeft: 30,
  },
  linearGradient: {
    flex: 1,
    justifyContent: "center",
  },
  background: { // this shape is a circle 
    alignSelf: 'center',
    width: window.width,
    overflow: 'hidden',
    height: window.height / 1.4

  },
  gradient: {
    width: window.width * 2,
    height: window.width * 2,
    marginLeft: -(window.width / 2),
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
    top: 25,
    textAlign: "center",
  },
  horizontalLine: {
    margin: "25px 0px 15px 0px",
    height: 1,
    width: "100%",
    backgroundColor: "#D3D3D3",
  },
  normal: {
    height: 550,
    fontSize: 22,
    left: 210,
    top: 10,
    fontWeight: "bold",
  },
  reduced: {
    height: 50,
  },
  payments: {
    marginTop: 18,
    marginLeft: 14,
    zIndex: 3,

  },
  paymentUsers: {
    flexDirection: "row",
    marginLeft: -16,
    flex: 1,
    flexWrap: "wrap",
    width: "105%",
    // backgroundColor: 'red'
  },
  paymentButton: {
    backgroundColor: light.primary,
    marginTop: "27%",
    height: 45,
    borderRadius: 25,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    alignSelf: "center",
    shadowColor: "rgb(0,0,0)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 4, //IOS
    elevation: 7,
  },
  logout: {
    marginLeft: "83%",
    elevation: 5,
    position: "absolute",
    marginTop: "15%",
    zIndex: 999,
  },
});
