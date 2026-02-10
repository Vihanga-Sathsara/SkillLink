import { getDetails } from "@/service/authService"
import { Ionicons } from "@expo/vector-icons"
import React from "react"
import { View, Image, Text } from "react-native"

const ShowProfile =  ({ uid }: { uid: string }) => {
        const [profile , setProfile] = React.useState<string>("")
        const [name, setName] = React.useState<string>("")
        const [email, setEmail] = React.useState<string>("")
        const [feedback, setFeedback] = React.useState<string>("")

        React.useEffect(() => {
            getClientProfile(uid)
            console.log("Fetching profile for UID: ", uid)
        }, [uid])

        const getClientProfile = async (uid: string) => {
            try {
                const res =  await getDetails(uid)
                if(res) {               
                    setProfile(res.profileImage)
                    setName(res.fullName)
                    setEmail(res.email)
                    setFeedback(res.feedback || "")
                }   
            }catch (error) {
                    console.error("Failed to fetch client profile: ", error)
            }
        }
        
        return (
            <View className="w-full flex-row gap-4 items-center">
                {
                    profile ? (         
                        <Image source={{ uri: profile }} className="w-[50px] h-[50px] rounded-full"/>
                    ) : (
                            <View className="w-[50px] h-[50px] rounded-full bg-gray-200 items-center justify-center">
                                <Ionicons name="person" size={28} color="#6B7280" />
                            </View>
                    )
                }   
                <View>
                    <Text className="text-black font-semibold">{name}</Text>
                    <Text className="text-black font-semibold">{email}</Text>
                    <Text className="text-gray-500 text-sm">rating: {feedback ? `${feedback}` : 0}</Text>
                </View>
            </View>
        )
}

export default ShowProfile