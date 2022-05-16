import React, { useState, useEffect, memo } from "react";
import {
  Button,
  Text,
  StyleSheet,
  View,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import * as Contacts from "expo-contacts";
import Back from "../assets/images/back.png";
import Spinner from "react-native-loading-spinner-overlay/lib";
import Dialpad from '../assets/images/dialpad.png'
import axios from "axios";
import { light } from "../controllers/Theme";
let url = 'https://firebasestorage.googleapis.com/v0/b/thunderpe-33b6a.appspot.com/o/files%2Fuser.png?alt=media&token=007a7e33-42d9-4848-a9ff-665b6df3bd7b'

const userContacts = ({ route, navigation }) => {
  const [userContact, setContact] = useState([]);
  const [onThunder, setOnThunder] = useState([]);
  const [notOnThunder, setNotOnThunder] = useState([]);
  const [memoryContact, setMemoryContact] = useState([]);
  const [spin, changeSpin] = useState(true);
  const curretUser = route.params.currentUser;

  // console.log(curretUser)
  var usersData = []
  const users = route.params.users
  useEffect(() => {

    (async () => {

      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          sort: Contacts.SortTypes.FirstName,
        });

        if (data.length > 0) {
          const contact = data;
          const memory = contact.filter((user) => {
            // console.log(user)
            if (user.phoneNumbers) {
              user.phoneNumbers.forEach(item => {
                item.number = (item.number.replace(/ /g, ""))
                item.number = (item.number.replace(/-/g, ""))
                item.number = (item.number.replace("+91", ""))
                item.number = parseInt(item.number)
                // const person = users.find(elem => {
                //   if (elem.mobile == item.number)
                //     return true
                //   return false
                // })
                // if (person != undefined)
                // console.log(person)
              })
            }
            // console.log(user.phoneNumbers)
            return !!user.phoneNumbers;
          });
          setContact(memory);
          setMemoryContact(memory);
          onThunder.splice(0, onThunder.length);
          users.forEach(item => {
            let obj = memory.find(o => o.phoneNumbers[0].number == item.mobile)
            if (obj != undefined) {
              onThunder.push(obj)
            }

          })
          setMemoryContact(onThunder)


          changeSpin(false)
        }
      }
    })();
  }, []);

  const renderItem = ({ item }) => (
    // console.log(item[0])
    <View key={item.id} style={styles.container}>
      <TouchableOpacity
        style={{ marginLeft: 12 }}
        onPress={() => {
          console.log(item.phoneNumbers[0].number)
          let receiver = users.find(elem => elem.mobile == item.phoneNumbers[0].number)
          if (receiver != undefined) {
            // console.log(receiver)
            receiver = {
              ...receiver,
              phoneNumbers: [{ number: receiver.mobile }],
              name: receiver.mobile.fullname
            }
            // console.log(route.params.balance)
            navigation.navigate("EnterAmount", {
              user: receiver,
              currentUser: curretUser,
              users: route.params.users,
              balance: route.params.balance
            })
          }

        }
        }
      >
        <Text style={{ fontSize: 16 }}>{item.name}</Text>
        <Text style={{ fontSize: 12 }}>
          {item.phoneNumbers &&
            item.phoneNumbers[0] &&
            item.phoneNumbers[0].number}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const searchContacts = (value) => {
    const filteredContacts = memoryContact.filter((contact) => {
      let contactLowerCase = contact.name.toLowerCase();
      let searchTermLowerCase = value.toLowerCase();
      return contactLowerCase.indexOf(searchTermLowerCase) > -1;
    });
    setContact(filteredContacts);
    setOnThunder(filteredContacts)
  };

  return (
    <View >
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
        <Text style={styles.title}>NEW PAYMENT</Text>
      </View>
      <TextInput
        placeholder="Search contacts on ThunderPe"
        onChangeText={(value) => searchContacts(value)}
        style={styles.search}
        selectionColor="#757574"
      />
      <View
        style={{
          backgroundColor: "#D8D2D2",
          height: 1,
          width: "104%",
          marginTop: 15,
          marginLeft: -14,
        }}
      />
      {spin ? (
        <Spinner
          visible={spin}
          textContent={"Fetching Contacts..."}
          textStyle={styles.spinnerTextStyle}
          color="#323133"
          overlayColor="rgba(255,255,255,0.8)"
        />
      ) : null}
      <Text style={{
        fontSize: 15,
        fontWeight: 'bold',
        marginTop: 10,
        marginLeft: 10,
        color: 'green'
      }}>
        Your Contacts on ThunderPe:
      </Text>
      <View
        style={{
          backgroundColor: "#D8D2D2",
          height: 1,
          width: "104%",
          marginTop: 10,
          marginLeft: -14,
        }}
      />
      <FlatList
        data={onThunder}
        renderItem={renderItem}
        ListEmptyComponent={() => <Text>No Contacts Found</Text>}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 158 }}
      // style={{ marginTop: 0, height: '25%' }}
      />
      <TouchableOpacity
        style={styles.dialpad}
        onLongPress={() => ToastAndroid.show('Send to number', ToastAndroid.SHORT)}
        onPress={() => navigation.navigate('SendToNumber', {
          currentUser: curretUser,
        })}
      >
        <Image source={Dialpad} style={{ height: 35, width: 35 }} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: "#D8D2D2",
    paddingBottom: 10,
    paddingTop: 10,
  },
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
    backgroundColor: light.primary,
    height: 49,
    flexDirection: "row",
  },
  search: {
    fontSize: 15,
    marginTop: 10,
    width: "75%",
    alignSelf: "center",
    borderRadius: 20,
    paddingLeft: 18,
    height: 40,
    borderColor: "#bfbebb",
    borderWidth: 1,
    color: "#757574",
  },
  dialpad: {
    backgroundColor: light.primary,
    position: 'absolute',
    right: '5%',
    top: '75%',
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    shadowColor: "rgb(0,0,0)", // IOS
    shadowOffset: { height: 10, width: 10 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 4, //IOS
    elevation: 4,

  }
});

export default userContacts;
