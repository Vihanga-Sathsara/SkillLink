import { router } from "expo-router"
import React from "react"
import { View, Text, Dimensions, TextInput, Pressable, TouchableWithoutFeedback, Keyboard } from "react-native"

const Register = () => {
    const [ fullName, setFullName ] = React.useState("")
    const [ email, setEmail ] = React.useState("")
    const [ password, setPassword ] = React.useState("")
    const [ confirmPassword, setConfirmPassword ] = React.useState("")

    const {width , height} =  Dimensions.get('window')

    const handleNavigate = () => {
        router.replace("/login")
    }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ width:width, height:height, alignItems:"center", justifyContent:"center", backgroundColor:"#F9FAFB"}}>
            <View className="w-[80%] h-[90%] justify-center">
                <Text className="text-[#111827] text-3xl text-center font-bold mb-4">Welcome to SkillLink</Text>
                <Text className="text-center font-semibold text-gray-500 mb-5">Join SkillLink today to hire trusted freelancers or showcase your skills to get hired.</Text>
                <Text className="text-2xl font-bold mb-4">Register</Text>
                <View className="w-full items-center">
                    <Pressable className="w-full items-center bg-gray-200 p-3 rounded-md mb-4">
                        <Text>Google Login</Text>
                    </Pressable>
                </View>
                <Text className="text-center mb-4">or register with credentials</Text>
                <View className="w-full">
                    <TextInput placeholder="Full Name" className="w-full p-3 border rounded-md mb-4" value={fullName} onChangeText={setFullName}></TextInput>
                    <TextInput placeholder="Email" className="w-full p-3 border rounded-md mb-4" value={email} onChangeText={setEmail}></TextInput>
                    <TextInput placeholder="Password" className="w-full p-3 border rounded-md mb-4" value={password} onChangeText={setPassword} secureTextEntry></TextInput>
                    <TextInput placeholder="Confirm Password" className="w-full p-3 border rounded-md mb-4" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry></TextInput>
                    <Text className="mb-4">Already have an account? <Pressable onPress={handleNavigate}><Text className="text-blue-500">Login</Text></Pressable></Text>
                    <Pressable className="w-full bg-[#1E40AF] p-3 rounded-md mb-4">
                        <Text className="text-center text-white font-bold">Register</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    </TouchableWithoutFeedback>
  )
}

export default Register