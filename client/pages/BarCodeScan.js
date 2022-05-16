import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { StackActions } from '@react-navigation/routers';

export default function BarCodeScan({ route, navigation }) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const currentUser = route.params.currentUser
    // console.log(currentUser)
    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
        const userData = data.split(",")
        const user = {
            "name": userData[2],
            "phoneNumbers": [
                {
                    "number": userData[1]
                }
            ],
            "image": userData[3],
            "address": userData[4]

        }
        navigation.dispatch(StackActions.replace('EnterAmount', { user, currentUser, users: route.params.users, balance: route.params.balance }))
        setScanned(false)
        console.log(userData)
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
});