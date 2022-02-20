import React, { useState, useEffect } from 'react';

import * as ImagePicker from 'expo-image-picker';
import { Button, Image, View, Platform, LogBox } from 'react-native';
import * as firebase from 'firebase/app'
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from "../controllers/Firebase";
const UploadImage = ({ route, navigation }) => {
    // console.log(process.env.REACT_APP_API_KEY)
    LogBox.ignoreLogs([`Setting a timer for a long period`]);
    const user = route.params.user
    // console.log(route.params.user)
    const [image, setImage] = useState(null);

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, Camera roll permissions are required to make this work!');
                }
            }
        })();
    }, []);

    const chooseImg = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            // aspect: [4, 3],
            quality: 1,
            allowsEditing: true,
        });

        console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };
    const formHandler = async (e) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function () {
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", image, true);
            xhr.send(null);
        });

        // Create a ref in Firebase (I'm using my user's ID)
        // const reff = ref(storage, `avatars/a`);
        const fileRef = ref(storage, `files/${user.id}`);
        console.log('Hi')
        const result = await uploadBytes(fileRef, blob)
        console.log('Hello')


        // We're done with the blob, close and release it
        blob.close();

        const url = await getDownloadURL(fileRef).then((res) => console.log(res));

        // Upload blob to Firebase
        // const snapshot = await ref.put(blob, { contentType: "image/png" });

        // // Create a download URL
        // const remoteURL = await snapshot.ref.getDownloadURL();

        // // Return the URL
        // return remoteURL;
    };

    const uploadFiles = (file) => {
        //
        if (!file) return;
        const filename = image.substring(image.lastIndexOf('/') + 1);
        const sotrageRef = ref(storage, `files/temp.png`)
        const uploadTask = uploadBytesResumable(sotrageRef, filename);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const prog = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                // setProgress(prog);
            },
            (error) => console.log(error),
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log("File available at", downloadURL);
                });
            }
        );
    };
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
            <Button title="Choose image from camera roll" onPress={chooseImg} />
            <Button title="Upload" onPress={formHandler} />
            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        </View>
    );
}
export default UploadImage