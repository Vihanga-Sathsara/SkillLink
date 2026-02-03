import { getUserDetails } from "@/service/authService"
import { auth } from "@/service/firebase"
import { Ionicons } from "@expo/vector-icons"
import React from "react"
import { useEffect } from "react"
import { KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, View, Text, Dimensions, Keyboard, Platform,Image, Pressable, TextInput } from "react-native"

export const UserProfile = () => {
    const [name, setName] = React.useState<string | undefined>("")
    const [feedback, setFeedback] = React.useState<number | undefined>(0)
    const [profileImage, setProfileImage] = React.useState<string | null>("")
    const [email, setEmail] = React.useState<string | undefined>("")
    const [bio, setBio] = React.useState<string | null>("")
    const [address, setAddress] = React.useState<string | null>("")
    const [country, setCountry] = React.useState<string | undefined>("")
    const [ bannerImage , setBannerImage ] = React.useState<string | null>("")
    const [ changesMade , setChangesMade ] = React.useState<boolean>(false)

    const [user , setUser] = React.useState<any>(null);
    useEffect(() => {
        const fetchUserDetails = async () => {
            if (auth.currentUser) {
                const userDetails = await getUserDetails(auth.currentUser.uid)
                if (userDetails) {
                    setName(userDetails.fullName || "")
                    setFeedback(userDetails.feedback || 0)
                    setProfileImage(userDetails.profileImage || "")
                    setBannerImage(userDetails.bannerImage || "")
                    setEmail(userDetails.email || "")
                    setBio(userDetails.bio || "")
                    setAddress(userDetails.address || "")
                    setCountry(userDetails.country || "")
                    setUser(userDetails)
                }
            }
        }
        fetchUserDetails()
    }, [])

    useEffect(() => {
        checkChanges()
    }, [name, bio, address, country,profileImage,bannerImage, user])

    const checkChanges = () => { 
       if (!user) return
       if ( user.fullName === name && user.bio === bio && user.address === address &&  user.country === country &&  user.profileImage === profileImage && user.bannerImage === bannerImage ) {
             setChangesMade(false) 
       }else{
             setChangesMade(true)
       }
       
    }

    const updateProfile = () => {
       
       
    }
    
    const {width , height} =  Dimensions.get('window')
        return (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                  <View style={{ width:width,height:height, backgroundColor:"#F9FAFB", alignItems:"center", justifyContent:"space-between" }}>
                   <View className="w-[90%] h-[90%] justify-center">
                        <View className="w-full mb-5">
                            <Text className="text-3xl text-[#111827] font-bold pt-6">Profile</Text>
                            <Text className="font-semibold text-gray-500">Control your personal info, settings, and preferences in one place.</Text>
                        </View>
                        <View className="w-full gap-4 mb-10">
                            {
                                bannerImage ? (
                                    <View className="w-full h-[150px] bg-gray-200 rounded-lg mb-4 items-center justify-center">
                                        <Image source={{ uri: bannerImage }} className="w-full h-[150px] rounded-lg mb-4 items-center justify-center"/>
                                        <Pressable className="absolute bottom-0 right-0 bg-white rounded-lg p-2 border border-gray-300">
                                            <Text className="font-semibold">📷</Text>
                                        </Pressable>
                                    </View>
                                ) : (
                                    <View className="w-full h-[150px] bg-gray-200 rounded-lg mb-4 items-center justify-center">
                                        <Ionicons name="image-outline" size={60} color="#6B7280" />
                                        <Text className="text-gray-500 mt-2">No Banner Selected</Text>
                                        <Pressable className="absolute bottom-0 right-0 bg-white rounded-lg p-2 border border-gray-300">
                                            <Text className="font-semibold">📷</Text>
                                        </Pressable>
                                    </View>
                                )
                            }
                            {
                                profileImage ? (
                                    <View className="w-[120px] h-[120px] rounded-full bg-gray-200 items-center justify-center absolute top-20 left-2">
                                        <Image source={{ uri: profileImage }} className="w-[175px] h-[175px] rounded-full items-center justify-center absolute top-20 left-2"/>
                                        <Pressable className="absolute bottom-0 right-0 bg-white rounded-full p-2 border border-gray-300">
                                            <Text className="font-semibold">📷</Text>
                                        </Pressable>
                                    </View>
                                ) : (
                                    <View className="w-[120px] h-[120px] rounded-full bg-gray-200 items-center justify-center absolute top-20 left-2">
                                        <Ionicons name="person" size={60} color="#6B7280" />
                                        <Pressable className="absolute bottom-0 right-0 bg-white rounded-full p-2 border border-gray-300">
                                            <Text className="font-semibold">📷</Text>
                                        </Pressable>
                                    </View>
                                    
                                )
                            }
                        </View>
                        <View className="">
                            <TextInput placeholder="Email" className="w-full p-3 border border-gray-200 rounded-md mb-4" editable={false}  value={email} onChangeText={setEmail} ></TextInput>
                            <TextInput placeholder="Full Name" className="w-full p-3 border rounded-md mb-4"  value={name} onChangeText={setName} ></TextInput>

                            {
                                bio ? (
                                    <TextInput placeholder="Full Name" className="w-full p-3 border rounded-md mb-4"  value={bio} onChangeText={setBio}></TextInput>
                                ):(
                                    <TextInput className="border border-red-700 rounded-lg p-3 pl-4 mb-4" multiline numberOfLines={ 8 } placeholder="Bio" value={bio || ""} onChangeText={setBio}></TextInput>
                                )
                            }
                            {
                                address ? (
                                    <TextInput placeholder="Full Name" className="w-full p-3 border rounded-md mb-4"  value={address} onChangeText={setAddress}></TextInput>
                                ):(
                                    <TextInput className="border border-red-700 rounded-lg p-3 pl-4 mb-4" multiline numberOfLines={ 5 } placeholder="Address" value={address || ""} onChangeText={setAddress}></TextInput>
                                )
                            }
                            {
                                country ? (
                                    <TextInput placeholder="Full Name" className="w-full p-3 border rounded-md mb-4"  value={country} onChangeText={setCountry}></TextInput>
                                ):(
                                    <TextInput className="border border-red-700 rounded-lg p-3 pl-4 mb-4" placeholder="Country" value={country || ""} onChangeText={setCountry}></TextInput>
                                )
                            }

                            <Pressable onPress={updateProfile} className={`w-full items-center  p-3 rounded-md mb-4  ${changesMade ? "bg-green-500" : "bg-gray-400" }`} disabled={!changesMade}>
                                <Text className="text-white font-bold">{changesMade ? "Save Changes" : "No Changes"}</Text>
                            </Pressable>
                        </View>
                    </View> 
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        )
}