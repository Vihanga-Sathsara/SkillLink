import Project from "@/components/Project"
import { getUserRole } from "@/service/authService"
import { auth } from "@/service/firebase"
import { getRequestCountForClient } from "@/service/requestService"
import React from "react"
import { Alert } from "react-native"
import { View, Text } from "react-native"
import { Dimensions } from "react-native"


export default function FindFreelancer() {
  const [role, setRole] = React.useState("")
  const [requestCount, setRequestCount] = React.useState(0)
  const {width} =  Dimensions.get('window')
  
  React.useEffect(() => {
          if (!auth.currentUser) {
              Alert.alert("Authentication Error", "User not authenticated. Please log in again.")
              return
          }
          const fetchUserRole = async () => {
              try {
                  const role = await getUserRole(auth.currentUser!.uid)
                  setRole(role)
              } catch (error) {
                  console.error("Error fetching user role: ", error)
                  Alert.alert("Error", "An error occurred while fetching user role.")
              }
          }
          fetchUserRole()
           const getRequestCount = async () => {
                try {
                  const count = await getRequestCountForClient(auth.currentUser!.uid)
                  console.log("Requests for client: ", count)
                  setRequestCount(count)
                } catch (error) {
                  console.error("Error fetching request count: ", error)
                }
            }
            getRequestCount()

      }, [auth.currentUser?.uid])
    return (
        requestCount > 0 && auth.currentUser ? (
            <Project uid={auth.currentUser.uid} role={role}></Project>
        ) : (
            <View style={{ width:width,alignItems:"center"}}>                             
                <View className="w-[90%]">
                    <View className="w-full mb-7 mt-7">
                        <Text className="text-3xl text-[#111827] font-bold pt-6">Your Request</Text>
                        <Text className="font-semibold text-gray-500">Here are the details of your project requests to freelancers.</Text>
                    </View>
                </View>
                <View style={{ height: 300,width:width*0.9, justifyContent: "center", alignItems: "center" }} className="border border-gray-200 rounded-lg bg-gray-200">
                    <Text style={{ fontSize: 18, color: "gray" }}>No project requests found.</Text>
                </View>
            </View>
        )
    )
}