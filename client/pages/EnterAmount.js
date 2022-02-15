import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import Back from "../assets/images/back.png";
import Logo from "../assets/images/Logo_Yel.png";
import User from "../assets/images/user.png";
import BottomSheet from "react-native-bottomsheet-reanimated";
import { light, dark } from '../controllers/Theme'
import * as Speech from "expo-speech";
const EnterAmount = ({ route, navigation }) => {
  // console.log(route.params.user)
  const payingTo = route.params.user;
  const payer = route.params.currentUser;
  const [showSheet, setShowSheet] = useState(false);
  const [amount, setAmount] = useState(0);

  const changeAmount = (e) => {
    setAmount(parseInt(e));
  };
  const changeSheet = () => {
    setShowSheet(false);
  };
  const sendMoney = () => {
    if (amount === 0) {
      alert("Please enter atleast 1 rupee");
    } else {
      setShowSheet(true);
    }
    // console.log(amount)
  };

  const handlePress = () => {
    Speech.speak(`Paying rupees ${amount} to ${payingTo.name}`);
  };

  return (
    <View>
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
      </View>
      <View style={{ alignItems: "center" }}>
        <Image source={Logo} style={styles.img} />
        <Image source={User} style={styles.userImg} />
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          Paying {payingTo.name}
        </Text>
        <Text
          style={{
            marginTop: "1%",
            fontSize: 16,
          }}
        >
          {payingTo.phoneNumbers[0].number}
        </Text>

        <View style={{ flexDirection: "row" }}>
          <Text
            style={{
              fontSize: 60,
              top: 8,
            }}
          >
            {"\u20B9"}
          </Text>
          <TextInput
            placeholder="0"
            style={{
              fontSize: 72,
              color: "black",
            }}
            keyboardType="numeric"
            selectionColor="#61615e"
            autoFocus={true}
            placeholderTextColor="#61615e"
            onSubmitEditing={sendMoney}
            onFocus={changeSheet}
            onChangeText={changeAmount}
          />
        </View>
        <TextInput
          placeholder="For what?"
          style={{
            height: 60,
            backgroundColor: "#d6d6d4",
            width: 180,
            borderRadius: 20,
            paddingLeft: 8,
            textAlign: "center",
            fontSize: 16,
            marginTop: 10,
          }}
          onFocus={changeSheet}
          onSubmitEditing={sendMoney}
        />
      </View>
      {showSheet ? (
        <BottomSheet
          keyboardAware
          bottomSheerColor="#FFFFFF"
          initialPosition={"20%"} //200, 300
          snapPoints={["20%"]}
          isRoundBorderWithTipHeader={true}
          backDropColor="red"
          // isModal
          containerStyle={{
            backgroundColor: "#ededeb",
          }}
          tipStyle={{
            backgroundColor: "#4d4d4b",
            width: 78,
            marginTop: 15,
            height: 3.5,
          }}
          // tipHeaderRadius={20}
          body={
            <View>
              <Text style={{ marginLeft: 10, fontSize: 16 }}>
                Paying From {payer.name + " --->"} {payingTo.name}
              </Text>
              <Text
                style={{ fontSize: 22, marginLeft: 14, fontWeight: "bold" }}
              >
                {"\u20B9"} {amount}
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: light.primary,
                  height: 45,
                  borderRadius: 25,
                  marginBottom: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  width: "80%",
                  alignSelf: "center",
                  marginTop: 12,
                }}
                onPress={handlePress}
              >
                <Text>Confirm and Pay</Text>
              </TouchableOpacity>
            </View>
          }
        />
      ) : null}
    </View>
  );
};

export default EnterAmount;

const styles = StyleSheet.create({
  header: {
    backgroundColor: light.primary,
    height: 49,
    flexDirection: "row",
  },
  container: {
    backgroundColor: "#fff",
    width: "80%",
    alignSelf: "center",
  },
  img: {
    alignSelf: "center",
    width: "40%",
    marginTop: -80,
  },
  userImg: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginTop: "-12%",
  },
});
