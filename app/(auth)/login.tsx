import { router } from "expo-router"
import React from "react"

import { View, Text, Dimensions, Pressable, TextInput, TouchableWithoutFeedback, Keyboard } from "react-native"

const handleNavigate = () => {
    router.replace("/register")
}

const Login = () => {
    const [ email, setEmail ] = React.useState("")
    const [ password, setPassword ] = React.useState("")
  
      const {width , height} =  Dimensions.get('window')
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ width:width, height:height, alignItems:"center", justifyContent:"center", backgroundColor:"#F9FAFB"}}>
          <View className="w-[80%] h-[90%] justify-center">
            <Text className="text-[#111827] text-3xl text-center font-bold mb-4">Welcome Back to SkillLink</Text>
            <Text className="text-center font-semibold text-gray-500 mb-5">Login to access your account and connect with professionals or clients instantly.</Text>
            <Text className="text-2xl font-bold mb-4">Login</Text>
            <View className="w-full items-center">
              <Pressable className="w-full items-center bg-gray-200 p-3 rounded-md mb-4">
                <Text>Google Login</Text>
              </Pressable>
            </View>
            <Text className="text-center mb-4">or login with credentials</Text>
            <View className="w-full">
              <TextInput placeholder="Email" className="w-full p-3 border rounded-md mb-4" value={email} onChangeText={setEmail}></TextInput>
              <TextInput placeholder="Password" className="w-full p-3 border rounded-md mb-4" value={password} onChangeText={setPassword} secureTextEntry></TextInput>
              <Text className="mb-4">If you don't have an account, please <Pressable onPress={handleNavigate}><Text className="text-blue-500">register</Text></Pressable></Text>
              <Pressable className="w-full items-center bg-[#1E40AF] p-3 rounded-md mb-4">
                <Text className="text-white font-bold">Login</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>    
    )
}


export default Login