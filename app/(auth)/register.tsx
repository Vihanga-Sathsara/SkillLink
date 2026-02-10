import { router } from "expo-router"
import React from "react"
import { View, Text, Dimensions, TextInput, Pressable, TouchableWithoutFeedback, Keyboard, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, Image } from "react-native"
import { useLoader } from "@/hooks/useLoader"
import { registerUser } from "@/service/authService"
import { Ionicons } from "@expo/vector-icons"
import { AntDesign } from "@expo/vector-icons"

const Register = () => {
    const [ fullName, setFullName ] = React.useState("")
    const [ email, setEmail ] = React.useState("")
    const [ password, setPassword ] = React.useState("")
    const [ confirmPassword, setConfirmPassword ] = React.useState("")
    const [ role, setRole ] = React.useState("")
    const { showLoader, hideLoader, isLoading } = useLoader()
    const [showPassword, setShowPassword] = React.useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

    const {width , height} =  Dimensions.get('window')

    const handleNavigate = () => {
        router.replace("/login")
    }

    const registerNewUser = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

        if(isLoading) return
        if (!role) {
            alert("Please select a role.")
            return
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.")
            return
        }

        if (!fullName || !email || !password) {
            alert("Please fill in all fields.")
            return
        }

        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.")
            return
        }

        if (!passwordRegex.test(password)) {
            alert("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.")
            return
        }

        try {
            showLoader()
            await registerUser(fullName, email, password, role)
            alert("User registered successfully")
            router.replace("/login")
        }catch (error) {
            console.error("Registration Error: ", error)
            alert("Error registering user")
        }finally {
            hideLoader()
        }
    }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                <View style={{ width:width, height:height, alignItems:"center", justifyContent:"center", backgroundColor:"#F9FAFB"}}>
                    <View className="w-[80%] justify-center">
                        <View className="w-full items-center justify-center">
                            <Image source={require("../../assets/images/logo.png")} className="w-[200px] h-[200px]"></Image>
                        </View>
                        <Text className="text-[#111827] text-3xl text-center font-bold mb-4">Welcome to SkillLink</Text>
                        <Text className="text-center font-semibold text-gray-500 mb-5">Join SkillLink today to hire trusted freelancers or showcase your skills to get hired.</Text>
                        <Text className="text-2xl font-bold mb-4">Register</Text>
                        <View className="w-full flex-row justify-between">
                            <TouchableOpacity onPress={() => setRole("client")} className={`p-4 rounded-md mb-4 border w-[48%] ${role === "client"? "border-[#4651e5] bg-[#E0E7FF]": "border-gray-300 bg-white"}`}>
                                <Text>Hire Freelancers</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setRole("freelancer")} className={`p-4 rounded-md mb-4 border w-[48%] ${role === "freelancer"? "border-[#4651e5] bg-[#E0E7FF]": "border-gray-300 bg-white"}`}>
                                <Text>Work as Freelancer</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <View className="w-full items-center">
                            <Pressable className="w-full items-center flex flex-row justify-center bg-red-100 border border-gray-300 p-3 rounded-md mb-4">
                                <AntDesign name="google" size={20} color="red" />
                                <Text className="text-lg pl-3">Google Register</Text>
                            </Pressable>
                        </View>
                        <Text className="text-center mb-4">or register with credentials</Text>
                        <View className="w-full">
                            <TextInput placeholder="Full Name" placeholderTextColor="#999999" className="w-full p-3 border rounded-md mb-4" value={fullName} onChangeText={setFullName}></TextInput>
                            <TextInput placeholder="Email" placeholderTextColor="#999999" className="w-full p-3 border rounded-md mb-4" value={email} onChangeText={setEmail}></TextInput>
                            <View className="w-full border rounded-md mb-4 flex-row items-center px-3">
                                <TextInput placeholder="Password" placeholderTextColor="#999999" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} className="flex-1 py-3"/>
                                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                                        <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#6B7280"/>
                                    </Pressable>
                            </View>
                            <View className="w-full border rounded-md mb-4 flex-row items-center px-3">
                                <TextInput placeholder="Confirm Password" placeholderTextColor="#999999" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showConfirmPassword} className="flex-1 py-3"/>
                                    <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#6B7280"/>
                                    </Pressable>
                            </View>
                            <Text className="mb-4">Already have an account? <Pressable onPress={handleNavigate}><Text className="text-blue-500">Login</Text></Pressable></Text>
                            <Pressable className="w-full bg-[#1E40AF] p-3 rounded-md mb-4" onPress={registerNewUser}>
                                <Text className="text-center text-white font-bold">Register</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

export default Register