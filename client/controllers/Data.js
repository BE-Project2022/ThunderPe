import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (value) => {
  try {
    let JsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("@storage_Key", JsonValue);
    return "Success";
  } catch (e) {
    console.log("error", e);
    // saving error
    return e;
  }
};

export const getData = async () => {
  // console.log("getData");
  try {
    // await AsyncStorage.removeItem("@storage_Key")
    const value = await AsyncStorage.getItem("@storage_Key");
    // console.log(value)
    return value;
  } catch (e) {
    // error reading value
    console.log("error", e);
    return e;
  }
};
