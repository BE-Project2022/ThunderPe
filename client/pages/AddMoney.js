import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { StripeProvider } from "@stripe/stripe-react-native";
import Checkout from '../controllers/Checkout'
const AddMoney = () => {
    return (
        <View>
            <StripeProvider publishableKey="pk_test_51KzvJoSDgNUXPQuHrq8wvA5egAmuzKUJl0ATOIRxwnlocNjajgyZQpJLaLeLIFyYJTwHIXxxR5DflaatavG7BrSl00yDTsWTmP">
                <Checkout />
            </StripeProvider>
        </View>
    )
}

export default AddMoney

const styles = StyleSheet.create({})