import { View, Text, Pressable, ScrollView,Image } from "react-native"
import React, { useEffect, useState } from "react"
import { getFreelancerGigsByUserId } from "@/service/freelancerService"
import { auth } from "@/service/firebase"
import { Ionicons } from "@expo/vector-icons"

export default function activeGigs() {
  const [gigs, setGigs] = useState<any[]>([])
  const [seeDescription,setSeeDescription] = React.useState(false)

  useEffect(() => {
    fetchGigs()
  }, [])
  
  const fetchGigs = async () => {
     try{
        const userId = auth.currentUser?.uid
        if(!userId){
          alert("User not logged in")
          return
        }
        const activeGigs = await getFreelancerGigsByUserId(userId)
        setGigs(activeGigs)
     }catch(error){
        console.error("Error fetching gigs: ", error)
        alert("An error occurred while fetching gigs.")
     }
  }
    return (
      <ScrollView>
        <View className="w-full mb-5">
          <Text className="text-3xl text-[#111827] font-bold pl-6 pt-6">Active Gigs</Text>
          <Text className="font-semibold text-gray-500 pl-6">Monitor your live gigs and make sure everything is on track.</Text>
        </View>
      <View className="w-full items-center">  
        {gigs.map(gig => (
          <View key={gig.id} className="bg-white p-4 rounded-lg mb-4 w-[90%]">
            {
                gig.bannerImageUrl ? (
                    <Image source={{ uri: gig.bannerImageUrl }} className="w-full h-[200px] rounded-lg mb-4"/>
                ) : (
                    <View className="w-full h-[200px] bg-gray-200 rounded-lg mb-4 items-center justify-center">
                        <Ionicons name="image-outline" size={60} color="#6B7280" />
                        <Text className="text-gray-500 mt-2">No Image Selected</Text>
                    </View>
                )
            }

            <Text className="text-gray-500 mb-2">Views {gig.views}</Text>
            <View className="flex-row justify-between items-center mb-4">
               <Text className="text-gray-500">Price: ${gig.price}</Text>
               <Text className="text-gray-500">Category: {gig.category}</Text>
            </View>
            
            <Text className="text-lg font-bold">{gig.gigTitle}</Text>
            <View className="w-full flex-row justify-between mb-4">
              <Text className="font-semibold text-blue-500 underline" onPress={() => setSeeDescription(!seeDescription)}>{seeDescription ? "Hide" : "Show"} Description</Text>
            </View>
            {
                  seeDescription && (
                    <Text className="text-black text-sm font-semibold mb-4">{gig.gigDescription}</Text>
                  )
            }
                    
            <View className="flex-row mt-3">
              <Pressable className="bg-blue-600 px-4 py-2 rounded-md mr-3">
                <Text className="text-white">Edit</Text>
              </Pressable>

              <Pressable className="bg-red-600 px-4 py-2 rounded-md">
                <Text className="text-white">Delete</Text>
              </Pressable>
            </View>
          </View>
        ))}
        </View>
      </ScrollView>
    )
}