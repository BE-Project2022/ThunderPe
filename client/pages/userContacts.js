import React, { useState, useEffect } from "react";
import { Button, Text, StyleSheet, View, ScrollView } from "react-native";
import * as Contacts from "expo-contacts";

const userContacts = () => {
  const [userContact, setContact] = useState([]);
  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({});

        if (data.length > 0) {
          const contact = data;
          // console.log(contact[0].phoneNumbers[0].number);
          setContact(contact);
        }
      }
    })();
  }, []);
  return (
    <ScrollView>
      {userContact.map((contact) => (
        <View key={contact.id} style={styles.container}>
          <Text>{contact.name}</Text>
          <Text>
            {contact.phoneNumbers &&
              contact.phoneNumbers[0] &&
              contact.phoneNumbers[0].number}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 12,
  },
});

export default userContacts;
