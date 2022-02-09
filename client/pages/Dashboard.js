import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Logo from '../assets/images/Short_Logo_White.png'
import { LinearGradient } from "expo-linear-gradient";
import Rupee from '../assets/images/rupee.png'
import BottomSheet from 'react-native-bottomsheet-reanimated'
import User from '../assets/images/user.png'
import More from '../assets/images/more.png'
const Dashboard = ({ route, navigation }) => {

  const [screenCover, setScreenCover] = useState('70%')
  const [userData, setUserData] = useState([])
  const [expanded, setExpanded] = useState(false)
  const [shown, setShown] = useState(false)

  useEffect(() => {



  }, [userData])


  const changeCover = (e) => {
    setScreenCover(e.value);
  };
  // var userData = [];
  const clearUserData = async () => {
    console.log(userData.length)
    setUserData(userData.splice(0, userData.length))
    setExpanded(true)
    showAllUsers()
    // userData = []
    console.log(userData.length)
  }

  const showAllUsers = () => {
    console.log('HERE')
    for (let i = 0; i < route.params.users.length; i++) {
      userData.push(
        <View key={i}>
          <TouchableOpacity>
            <View style={{ marginTop: 14, marginLeft: 20 }}>
              <Image source={User} style={{ height: 55, width: 55 }} />
              <Text style={{ marginLeft: 10 }}>{route.params.users[i]}</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }

  }
  // console.log("HERE: \n", route.params.users)
  const setLessUsers = () => {
    setShown(true)
    for (let i = 0; i < route.params.users.length; i++) {
      userData.push(
        <View key={i}>
          <TouchableOpacity>
            <View style={{ marginTop: 14, marginLeft: 20 }}>
              <Image source={User} style={{ height: 55, width: 55 }} />
              <Text style={{ marginLeft: 10 }}>{route.params.users[i]}</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  }
  const setMoreUsers = () => {
    let i = 0
    for (i = 0; i < 9; i++) {
      userData.push(
        <View key={i}>
          <TouchableOpacity>
            <View style={{ marginTop: 14, marginLeft: 20 }}>
              <Image source={User} style={{ height: 55, width: 55 }} />
              <Text style={{ marginLeft: 10 }}>{route.params.users[i]}</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
    userData.push(
      <View key={i}
        style={
          {
            width: 48,
            height: 48,
            borderRadius: 44,
            borderColor: 'black',
            borderWidth: 1.5,
            marginTop: 20,
            marginLeft: 24
          }}>
        <TouchableOpacity onPress={clearUserData}>
          <Image source={More} style={{ alignSelf: 'center', marginTop: 10 }} />
          <Text style={{ marginTop: 14, marginLeft: 3 }}>More</Text>
        </TouchableOpacity>

      </View>

    )

  }

  if (route.params.users.length > 9 && !expanded) {
    setMoreUsers()
  }
  else if (route.params.users.length < 9) {
    setLessUsers()
  }
  // else if (route.params.users.length > 9 && expanded && !shown) {
  //   showAllUsers()
  // }


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
        tipStyle={{ backgroundColor: "black", width: 78, marginTop: 15, height: 3.5 }}
        tipHeaderRadius={28}
        // headerStyle={{backgroundColor:"red"}}
        // bodyStyle={{backgroundColor:"red",flex:1}}
        onChangeSnap={changeCover}
        body={
          <View style={styles.payments}>
            <Text style={{ fontSize: 18 }}>Recent Payments</Text>
            <View style={styles.paymentUsers}>
              {userData}
            </View>
          </View>
        }
      />
      {/* <TouchableOpacity
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
      </TouchableOpacity> */}
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
  },
  payments: {
    marginTop: 18,
    marginLeft: 14
  },
  paymentUsers: {
    flexDirection: 'row',
    marginLeft: -16,
    flex: 1,
    flexWrap: 'wrap',
    width: '105%',
    // backgroundColor: 'red'
  }
});