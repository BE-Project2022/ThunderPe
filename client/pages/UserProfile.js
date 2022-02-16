import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const UserProfile = ({ route, navigation }) => {
    const user = route.params.currentUser
    return (
        <View>
            <Text>UserProfile</Text>
        </View>
    )
}

export default UserProfile

const styles = StyleSheet.create({})