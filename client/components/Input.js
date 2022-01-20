import React from "react";
import { View, StyleSheet, TextInput } from "react-native";

const Input = (props) => {
  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder={props.name}
        secureTextEntry={props.val === "true"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    marginBottom: 10,
    height: 40,
  },
});

export default Input;
