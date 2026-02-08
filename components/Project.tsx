import { Dimensions, Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, View } from "react-native"
import React from "react"

const Project = () => {
    const {width } =  Dimensions.get('window')
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                <View style={{ width:width,alignItems:"center", justifyContent:"space-between"}}>
                                
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
        </TouchableWithoutFeedback>    

    )
}

export default Project;