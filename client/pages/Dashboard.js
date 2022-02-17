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
} from "react-native";
import { StackActions } from "@react-navigation/routers";

import Logo from "../assets/images/Short_Logo_White.png";
import { LinearGradient } from "expo-linear-gradient";
import Rupee from "../assets/images/rupee.png";
import BottomSheet from "react-native-bottomsheet-reanimated";
import User from "../assets/images/user.png";
import More from "../assets/images/more.png";
import Reward from "../assets/images/reward.png";
import Next from "../assets/images/next.png";
import { dark, light } from "../controllers/Theme";
import { Menu, MenuItem, MenuDivider } from "react-native-material-menu";

const Dashboard = ({ route, navigation }) => {
  const [screenCover, setScreenCover] = useState("70%");
  const [expanded, setExpanded] = useState(false);
  const [userData, setData] = useState([]);
  const [isOnState, setIsOnState] = useState(false);

  const user = route.params.user;
  const mode = useColorScheme();

  // console.log(route.params.users)
  const changeCover = (e) => {
    setScreenCover(e.value);
  };
  // var userData = [];
  useEffect(() => {
    userData.splice(0, userData.length);
    if (route.params.users.length > 9 && expanded) showAllUsers();
  }, [expanded]);

  const hideMenu = () => setIsOnState(false);

  const showMenu = () => setIsOnState(true);

  const payUser = (e) => {
    route.params.users[e] = {
      ...route.params.users[e],
      phoneNumbers: [{ number: route.params.users[e].mobile }],
      name: route.params.users[e].fullname,
    };
    navigation.navigate("EnterAmount", {
      user: route.params.users[e],
      currentUser: route.params.user,
    });
  };

  const showAllUsers = () => {
    // console.log('HERE')
    setExpanded(true);
    const u = route.params.users[i].fullname.split(" ");

    userData.splice(0, userData.length);
    // console.log(userData.length)
    for (let i = 0; i < route.params.users.length; i++) {
      const temp = i;
      userData.push(
        <View key={i}>
          <TouchableOpacity onPress={(res) => payUser(temp)}>
            <View style={{ marginTop: 14, marginLeft: 20 }}>
              <Image source={User} style={{ height: 55, width: 55 }} />
              <Text style={{ marginLeft: 4 }}>{u[0]}</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
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
              <Image source={User} style={{ height: 55, width: 55 }} />
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
      const temp = i;
      const u = route.params.users[i].fullname.split(" ");

      userData.push(
        <View key={i}>
          <TouchableOpacity key={temp} onPress={(res) => payUser(temp)}>
            <View style={{ marginTop: 14, marginLeft: 20 }}>
              <Image source={User} style={{ height: 55, width: 55 }} />
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
    <View>
      <View style={mode == "dark" ? styles.darkHeader : styles.header}>
        <Image source={Logo} style={styles.img} />
        <Text style={styles.title}>THUNDERPE</Text>

        <Menu
          visible={isOnState}
          anchor={
            <TouchableOpacity onPress={showMenu}>
              <Image
                source={User}
                style={{ marginRight: "4%", height: 35, width: 35 }}
              />
            </TouchableOpacity>
          }
          onRequestClose={hideMenu}
          style={{ marginTop: 45, marginLeft: "-7%", width: "50%" }}
        >
          <MenuItem
            onPress={() =>
              navigation.navigate("UserProfile", {
                currentUser: route.params.user,
              })
            }
          >
            Show Profile
          </MenuItem>
          <MenuItem
            onPress={async () => {
              try {
                await AsyncStorage.removeItem("@storage_Key");
              } catch (error) {
                console.log("error", error);
              }
              navigation.dispatch(StackActions.replace("Login"));
            }}
          >
            LogOut
          </MenuItem>
        </Menu>
      </View>

      <View>
        <LinearGradient
          colors={[light.primary, light.secondary]}
          style={styles.gradient}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 0.8, y: 0.5 }}
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
                  ? { left: 70, fontSize: 28, top: 4, fontWeight: "bold" }
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
          <ScrollView>
            <View style={styles.payments}>
              <Text style={{ fontSize: 18 }}>Recent Payments</Text>
              <View style={styles.paymentUsers}>{userData}</View>
              <View
                style={{
                  backgroundColor: "#D8D2D2",
                  height: 1,
                  width: "104%",
                  marginTop: 15,
                  marginLeft: -14,
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
                  marginLeft: -14,
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
                    marginLeft: -14,
                  }}
                />
              </View>
            </View>
          </ScrollView>
        }
      />
      <TouchableOpacity
        style={styles.paymentButton}
        onPress={() => navigation.navigate("userContacts", { user: user })}
      >
        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
          + New Payment
        </Text>
      </TouchableOpacity>
    </View>
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
  gradient: {
    padding: 15,
    width: "100%",
    alignItems: "center",
    height: 227,
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
    left: -75,
    fontWeight: "bold",
  },
  reduced: {
    height: 50,
  },
  payments: {
    marginTop: 18,
    marginLeft: 14,
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
    marginTop: "120%",
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
