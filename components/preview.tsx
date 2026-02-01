import React, { useEffect } from "react"
import { Modal, View, Text, Pressable, Image } from "react-native"
import { getUserDetails } from "@/service/authService"
import { auth } from "@/service/firebase"
import { Ionicons } from "@expo/vector-icons"

const [name, setName] = React.useState<string | undefined>("")
const [feedback, setFeedback] = React.useState<number | undefined>(0)
const [profileImage, setProfileImage] = React.useState<string | null>(null)

type Props = {
  visible: boolean
  onClose: () => void
  gigTitle: string
  gigDescription: string
  price: string
  deliveryTime: string
  image: string | null
  name?: string
  feedback?: number
}

useEffect(() => {
    const fetchUserDetails = async () => {
        if (auth.currentUser) {
            const userDetails = await getUserDetails(auth.currentUser.uid)
            if (userDetails) {
                setName(userDetails.fullName || "Freelancer Name")
                setFeedback(userDetails.feedback || 0)
                setProfileImage(userDetails.profileImage || null)
            }
        }
    }
    fetchUserDetails()
}, [])

const GigPreviewModal = ({visible,onClose,gigTitle,gigDescription,price,deliveryTime,image}: Props) => {

const [seeDescription,setSeeDescription] = React.useState(false)
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-center items-center">
       <Pressable onPress={onClose} className=" bg-red-700 p-3 rounded-md items-center w-[10%] mb-4">
            <Text className="text-white font-semibold">X</Text>
        </Pressable>
        <View className="w-[90%] bg-white rounded-xl p-4">
            <Text className="text-black text-2xl font-semibold mb-4">Preview</Text>
            
            {image && (
                <Image source={{ uri: image }} className="w-full h-[200px] rounded-lg mb-4"/>
            )}
            <Text className="text-xl font-bold mb-4">{gigTitle}</Text>
            <View className="w-full flex-row justify-between mb-4">
                <Text className="font-semibold">Price: ${price}</Text>
                <Text className="font-semibold">Delivery: {deliveryTime} days</Text>
            </View>
            <View className="w-full flex-row justify-between mb-4">
                <Text className="font-semibold text-blue-500 underline" onPress={() => setSeeDescription(!seeDescription)}>{seeDescription ? "Hide" : "Show"} Description</Text>
            </View>
            {
                seeDescription && (
                    <Text className="text-black text-sm font-semibold mb-4">{gigDescription}</Text>
                )
            }
            <View className="w-full flex-row gap-4 items-center mb-4">
                {
                    profileImage ? (
                        <Image
                        source={{ uri: profileImage }}
                        className="w-[50px] h-[50px] rounded-full"
                        />
                    ) : (
                        <View className="w-[50px] h-[50px] rounded-full bg-gray-200 items-center justify-center">
                        <Ionicons name="person" size={28} color="#6B7280" />
                        </View>
                    )
                }
                <View>
                    <Text className="text-black font-semibold">{name || "Freelancer Name"}</Text>
                    <Text className="text-gray-500 text-sm">{feedback ? `${feedback} positive feedback` : "No feedback available"}</Text>
                </View>
            </View>
        </View>
      </View>
    </Modal>
  );
};

export default GigPreviewModal
