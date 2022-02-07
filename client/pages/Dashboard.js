import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, Animated } from "react-native";
import { StackActions } from "@react-navigation/routers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Logo from '../assets/images/Short_Logo_White.png'
import { LinearGradient } from "expo-linear-gradient";
import Rupee from '../assets/images/rupee.png'
import { PanGestureHandler, State } from 'react-native-gesture-handler'
import BottomSheet from 'react-native-bottomsheet-reanimated'
const Dashboard = ({ navigation }) => {

  const [screenCover, setScreenCover] = useState('')

  const changeCover = (e) => {
    setScreenCover(e.value);
  };
  return (
    <View>
      <View style={styles.header}>
        <Image source={Logo} style={styles.img} />
        <Text style={styles.title}>THUNDERPE</Text>
      </View>
      <View >
        <LinearGradient
          colors={['#FfC100', '#FFD85E']}
          style={styles.gradient}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 0.8, y: 0.5 }}
        >
          <View>
            <Text style={screenCover != '70%' ? styles.normal : styles.text}>{screenCover === '70%' ? 'WALLET BALANCE' : 'Balance: \u20B9 150545'}

            </Text>
            <Image source={Rupee} style={screenCover === '70%' ? { top: 50, alignSelf: 'center', height: 40, right: 52 } : null} />
            <Text style={screenCover === '70%' ? { left: 70, fontSize: 28, top: 4, fontWeight: 'bold' } : null}>150545</Text>
          </View>
        </LinearGradient>
      </View>
      <BottomSheet
        keyboardAware
        bottomSheerColor="#FFFFFF"
        initialPosition={'70%'} //200, 300
        snapPoints={['70%', '85%']}
        isRoundBorderWithTipHeader={true}
        // backDropColor="red"
        // isModal
        // containerStyle={{ backgroundColor: "red" }}
        tipStyle={{ backgroundColor: "black", width: 60, marginTop: 15 }}
        tipHeaderRadius={24}
        // headerStyle={{backgroundColor:"red"}}
        // bodyStyle={{backgroundColor:"red",flex:1}}
        onChangeSnap={changeCover, console.log(screenCover)}
        header={
          <View>
            <Text style={styles.text}>Header</Text>
          </View>
        }
        body={
          <View style={styles.body}>
            <Text style={styles.text}>Body</Text>
          </View>
        }
      />
      <TouchableOpacity
        onPress={async () => {
          try {
            await AsyncStorage.removeItem("@storage_Key");
          } catch (error) {
            console.log("error", error);
          }
          navigation.dispatch(StackActions.replace("Login"));
        }}
      >
        <Text>Logout</Text>
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
    marginLeft: -10
    // marginBottom: 20,
  },
  header: {
    backgroundColor: "#ffc100",
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
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
    width: '100%',
    alignItems: 'center',
    height: 227
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    top: 25,
    textAlign: 'center'
  },
  horizontalLine: {
    margin: '25px 0px 15px 0px',
    height: 1,
    width: '100%',
    backgroundColor: '#D3D3D3'
  },
  normal: {
    height: 550,
    fontSize: 22,
    left: -75,
    fontWeight: 'bold'
  },
  reduced: {
    height: 50
  }
});