import AsyncStorage from "@react-native-async-storage/async-storage";
import { Decrypt } from "./Decrypt";

export const storeData = async (value) => {
    try {
        let JsonValue = JSON.stringify(value);
        await AsyncStorage.setItem("@storage_Key", JsonValue);
        return ('Success')
    } catch (e) {
        console.log("error", e);
        // saving error
        return (e)
    }
};

export const getData = async () => {
    // console.log("getData");
    try {
        // await AsyncStorage.removeItem("@storage_Key")
        const value = await AsyncStorage.getItem("@storage_Key");
        // console.log(value)
        if (value !== null) {
            // value previously stored
            console.log("value=", value);
            console.log('\nDecrypt: ', Decrypt(value))
            return (value)
        }
        else {
            // console.log('HERE')
            return (null)
        }
    } catch (e) {
        // error reading value
        console.log("error", e);
        return (e)
    }
};