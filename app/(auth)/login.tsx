import { useLoader } from "@/hooks/useLoader"
import { forgotPassword, loginUser } from "@/service/authService"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import React from "react"
import { AntDesign } from "@expo/vector-icons"
import { View, Text, Dimensions, Pressable, TextInput, TouchableWithoutFeedback, Keyboard, ScrollView, KeyboardAvoidingView, Platform,Image, Alert } from "react-native"
import ForgetPassword from "@/components/ForgetPassword"


const Login = () => {
    const [ email, setEmail ] = React.useState("")
    const [ password, setPassword ] = React.useState("")
    const { showLoader, hideLoader, isLoading } = useLoader()
    const [showPassword, setShowPassword] = React.useState(false)
    const {width , height} =  Dimensions.get('window')
    const [forgetPasswordVisible, setForgetPasswordVisible] = React.useState(false)

  const handleNavigate = () => {
      router.replace("/register")
  }

const loginUserWithEmailAndPassword = async (email: string, password: string) => {
    if(isLoading) return
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

    if (!email || !password) {
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
        const res = await loginUser(email, password)

        if (!res) {
            alert("User details not found.")
            return
        }

        if (res === "freelancer") {
            router.replace("/(freelancer-tabs)/freelancerDashboard")
        }else if (res === "client") {
            router.replace("/(client-tabs)/clientDashboard")
        }
        console.log("Login Success: ", res)
        
    }catch (error) {
        console.error("Login Error: ", error)
        alert("Error logging in user")
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
                      <Text className="text-[#111827] text-3xl text-center font-bold mb-4">Welcome Back to SkillLink</Text>
                      <Text className="text-center font-semibold text-gray-500 mb-5">Login to access your account and connect with professionals or clients instantly.</Text>
                      <Text className="text-2xl font-bold mb-4">Login</Text>
                      <View className="w-full items-center">
                        <Pressable className="w-full items-center flex flex-row justify-center bg-red-100 border border-gray-300 p-3 gap-5 rounded-md mb-4">
                          <AntDesign name="google" size={20} color="red" />
                          <Text className="text-lg pl-3">Google Login</Text>
                        </Pressable>
                      </View>
                      <Text className="text-center mb-4">or login with credentials</Text>
                      <View className="w-full">
                        <TextInput placeholder="Email" placeholderTextColor="#999999" className="w-full p-3 border rounded-md mb-4" value={email} onChangeText={setEmail}></TextInput>
                        <View className="w-full border rounded-md mb-4 flex-row items-center px-3">
                          <TextInput placeholder="Password" placeholderTextColor="#999999" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} className="flex-1 py-3"/>
                          <Pressable onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#6B7280"/>
                          </Pressable>
                        </View>
                        <Text className="mb-2 font-semibold">Forget Password? <Pressable onPress={() => setForgetPasswordVisible(true)}><Text className="text-blue-500 font-semibold">Click here</Text></Pressable></Text>
                        <Text className="mb-4 font-semibold">If you don't have an account, please <Pressable onPress={handleNavigate}><Text className="text-blue-500 font-semibold">register</Text></Pressable></Text>
                        <Pressable className="w-full items-center bg-[#1E40AF] p-3 rounded-md mb-4" onPress={() => loginUserWithEmailAndPassword(email, password)}>
                          <Text className="text-white font-bold">Login</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                  <ForgetPassword visible={forgetPasswordVisible} onClose={() => setForgetPasswordVisible(false)} />
              </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>    
    )
}


export default Login