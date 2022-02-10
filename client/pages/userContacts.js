import React, { useState, useEffect } from "react";
import { Button, Text, StyleSheet, View, Image, FlatList, TextInput, TouchableOpacity } from "react-native";
import * as Contacts from "expo-contacts";
import Back from '../assets/images/back.png'
import Spinner from 'react-native-loading-spinner-overlay/lib';


const userContacts = ({ route, navigation }) => {
  const [userContact, setContact] = useState([]);
  const [memoryContact, setMemoryContact] = useState([]);
  const [spin, changeSpin] = useState(true)
  const curretUser = route.params.user
  // console.log(curretUser)

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          sort: Contacts.SortTypes.FirstName
        });

        if (data.length > 0) {
          const contact = data;
          changeSpin(false)
          // console.log(data[2]);
          setContact(contact);
          setMemoryContact(data)
        }
      }
    })();
  }, []);

  const renderItem = ({ item }) => (
    // console.log(item[0])
    <View key={item.id} style={styles.container}>
      <TouchableOpacity style={{ marginLeft: 12, }} onPress={() => navigation.navigate("EnterAmount", { user: item, currentUser: curretUser })}>
        <Text style={{ fontSize: 16 }}>{item.name}</Text>
        <Text style={{ fontSize: 12 }}>
          {item.phoneNumbers &&
            item.phoneNumbers[0] &&
            item.phoneNumbers[0].number}
        </Text>
      </TouchableOpacity>
    </View>
  )

  const searchContacts = (value) => {
    const filteredContacts = memoryContact.filter(
      contact => {
        let contactLowerCase = contact.name.toLowerCase()
        let searchTermLowerCase = value.toLowerCase()
        return contactLowerCase.indexOf(searchTermLowerCase) > -1
      }
    )
    setContact(filteredContacts)
  }

  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.canGoBack() ? navigation.goBack() : null} style={{ width: '12%' }}>
          <Image source={navigation.canGoBack() ? Back : null} style={{ left: 12, height: 30, top: 11 }} />
        </TouchableOpacity>
        <Text style={styles.title}>NEW PAYMENT</Text>
      </View>
      <TextInput
        placeholder="Search"
        onChangeText={(value) => searchContacts(value)
        }
        style={styles.search}
        selectionColor='#757574'
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
      {spin ? (<Spinner
        visible={spin}
        textContent={'Fetching Contacts...'}
        textStyle={styles.spinnerTextStyle}
        color='#323133'
        overlayColor='rgba(255,255,255,0.8)'

      />) : null}
      <FlatList
        data={userContact}
        renderItem={renderItem}
        ListEmptyComponent={() => (<Text>No Contacts Found</Text>)}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 48 }}
        style={{ marginTop: 2 }}
      >
        {/* {userContact.map((contact) => (
        
      ))} */}
      </FlatList>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {

    borderBottomWidth: 1,
    borderBottomColor: '#D8D2D2',
    paddingBottom: 10,
    paddingTop: 10
  },
  title: {
    fontSize: 20,
    color: "white",
    // backgroundColor: "#FFC100",
    height: 40,
    alignSelf: 'center',
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 20,
    marginLeft: '18%',
    top: 9
  },
  header: {
    backgroundColor: "#ffc100",
    height: 49,
    flexDirection: 'row',
  },
  search: {
    fontSize: 15,
    marginTop: 10,
    width: '75%',
    alignSelf: 'center',
    borderRadius: 20,
    paddingLeft: 18,
    height: 40,
    borderColor: '#bfbebb',
    borderWidth: 1,
    color: '#757574'
  }
});

export default userContacts;
