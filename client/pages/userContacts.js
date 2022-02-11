import React, { useState, useEffect } from "react";
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

const userContacts = ({ route, navigation }) => {
  const [userContact, setContact] = useState([]);
  const [onThunder, setOnThunder] = useState([]);
  const [notOnThunder, setNotOnThunder] = useState([]);
  const [memoryContact, setMemoryContact] = useState([]);
  const [spin, changeSpin] = useState(true);
  const curretUser = route.params.user;

  // console.log(curretUser)
  var usersData = []
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
            if (user.phoneNumbers) {
              user.phoneNumbers.forEach(item => {
                item.number = (item.number.replace(/ /g, ""))
                item.number = (item.number.replace(/-/g, ""))
                item.number = (item.number.replace("+91", ""))
                item.number = parseInt(item.number)
              })
            }
            return !!user.phoneNumbers;
          });
          setContact(memory);

          axios
            .get("https://thunderpe.herokuapp.com/auth/getallusers")
            .then((res) => {

              onThunder.splice(0, onThunder.length);
              res.data.forEach(item => {
                // console.log(item)
                usersData.push(item)
                let obj = memory.find(o => o.phoneNumbers[0].number === item.mobile)
                if (obj != undefined) {
                  onThunder.push(obj)
                }
              })
              onThunder.forEach((user) => {
                // console.log(user.name)
                var index = memory.indexOf(user)
                memory.splice(index, 1)
                setNotOnThunder(memory)
                // console.log(obj.find((item) => item.name === "Rohit Kulkarni"))
              })
              changeSpin(false);
              setMemoryContact(onThunder);
              // console.log(notOnThunder)
            })
            .catch((err) => {
            });

        }
      }
    })();
  }, []);

  const renderItem = ({ item }) => (
    // console.log(item[0])
    <View key={item.id} style={styles.container}>
      <TouchableOpacity
        style={{ marginLeft: 12 }}
        onPress={() =>
          navigation.navigate("EnterAmount", {
            user: item,
            currentUser: curretUser,
          })
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
    setOnThunder(filteredContacts);
    // setNotOnThunder(filteredContacts)
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
        Contacts on ThunderPe:
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
        // contentContainerStyle={{ paddingBottom: 38 }}
        style={{ marginTop: 0, height: '25%' }}
      />
      <Text style={{
        fontSize: 15,
        fontWeight: 'bold',
        marginTop: 20,
        marginLeft: 10,
        color: 'red'
      }}>
        Contacts Not on ThunderPe:
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
        data={notOnThunder}
        renderItem={renderItem}
        ListEmptyComponent={() => <Text>No Contacts Found</Text>}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 395 }}
        style={{ marginTop: 0 }}
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
    backgroundColor: "#ffc100",
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
    backgroundColor: '#ffc100',
    position: 'absolute',
    right: '5%',
    top: '80%',
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
