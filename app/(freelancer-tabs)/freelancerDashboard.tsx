import { useEffect, useState } from "react"
import { View, Text, Dimensions, TouchableOpacity, FlatList, Image, Pressable, ScrollView } from "react-native"
import { auth } from "@/service/firebase"
import { Ionicons } from "@expo/vector-icons"
import { LineChart, PieChart } from "react-native-chart-kit"
import { getFeedback, logoutUser } from "@/service/authService"
import { router } from "expo-router"
import React from "react"
import Wallet from "@/components/wallet"
import { gigCountByUserId } from "@/service/freelancerService"
import { completeProjectCount, pendingProjectCount, rejectedProjectCount } from "@/service/requestService"

const FreelancerDashboard = () => {

    const slides = [
        {
            id: '1',
            color: '#F59E0B'
        },
        {
            id: '2',
            color: '#3B82F6'
        },
        {
            id: '3',
            color: '#10B981'
        },
        {
            id: '4',
            color: '#EF4444'
        }
    ]
    const [previewVisible, setPreviewVisible] = React.useState(false)
    const [gigCount, setGigCount] = React.useState(0)
    const [completedCount, setCompletedCount] = React.useState(0)
    const [pendingCount, setPendingCount] = React.useState(0)
    const [rating , setRating] = React.useState(0)
    const [rejectedCount, setRejectedCount] = React.useState(0)
    const [completePercentage, setCompletePercentage] = React.useState(0)
    const [pendingPercentage, setPendingPercentage] = React.useState(0)
    const [rejectedPercentage, setRejectedPercentage] = React.useState(0)

    const data = [
        { name: "% Completed", population: completePercentage, color: "#4CAF50", legendFontColor: "#333", legendFontSize: 14 },
        { name: "% Pending", population: pendingPercentage, color: "#FF9800", legendFontColor: "#333", legendFontSize: 14 },
        { name: "% Rejected", population: rejectedPercentage, color: "#F44336", legendFontColor: "#333", legendFontSize: 14},
   ]

    useEffect(() => {
        fetchDetails()
     }, [])
    
    const logoutUserHandler = async () => {
        try {
            await logoutUser()
            router.replace('/login')
        }catch (error) {
            alert("Error logging out")
            console.error("Logout Error: ", error)
        }
    }

    const navigateWallet = () => {
        setPreviewVisible(true)
    }

    const fetchDetails = async () => {
        const allCount = await gigCountByUserId(auth.currentUser?.uid || "")
        const completeCount = await completeProjectCount(auth.currentUser?.uid || "")
        const pending = await pendingProjectCount(auth.currentUser?.uid || "")
        const feedback = await getFeedback(auth.currentUser?.uid || "")
        const rejectedCount = await rejectedProjectCount(auth.currentUser?.uid || "")

        const totalProjects = completeCount + pending + rejectedCount
        const completePrecentage = parseFloat(((completeCount / totalProjects) * 100).toFixed(2))
        const pendingPrecentage = parseFloat(((pending / totalProjects) * 100).toFixed(2))
        const rejectedPrecentage = parseFloat(((rejectedCount / totalProjects) * 100).toFixed(2))
        setGigCount(allCount)
        setCompletedCount(completeCount)
        setPendingCount(pending)
        setRejectedCount(rejectedCount)
        setCompletePercentage(completePrecentage)
        setPendingPercentage(pendingPrecentage)
        setRejectedPercentage(rejectedPrecentage)

        if (feedback) {
            let rating = (feedback / completeCount) * 5
            setRating(rating)
        }
    }


    const {width , height} = Dimensions.get('window')
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

    return (
     <ScrollView bounces={false} showsVerticalScrollIndicator={false}> 
      <View style={{ width:width, height:height, alignItems:"center"}}>
        <View className="w-[90%] items-end flex flex-row justify-between gap-4 mt-7 mb-5">
            <View className="flex flex-row gap-4 mt-7 mb-5">
                <Text className="text-2xl font-semibold text-blue-700">SkillLink</Text>
            </View>
            <View className="flex flex-row gap-4 mt-7 mb-5">
                <View className="items-center gap-2">
                    <Pressable className="flex flex-row items-center gap-1" onPress={navigateWallet}>
                        <Ionicons name="wallet-outline" size={24} color="black" />
                        <Text className="text-xl font-bold">Wallet</Text>
                    </Pressable>
                </View>
                <View className="flex flex-row items-center">
                    <Pressable onPress={logoutUserHandler}>
                        <Ionicons name="log-out-outline" size={24} color="black" />
                    </Pressable>
                </View>   
            </View>
                
        </View>
        <View className="w-[90%] mb-5">
            <Text className="text-xl font-semibold">👋 Welcome, {auth.currentUser?.displayName}</Text>
        </View>
        <View className="w-[90%] flex-row justify-between flex-wrap mt-5 mb-5 gap-4">
            <View className="bg-white p-4 rounded-xl w-[45%] shadow">
                <View className="flex-row items-center gap-2">
                    <Ionicons name="rocket-outline" size={20} color="#2563eb" />
                    <Text className="text-gray-500 text-lg font-semibold">Active Gigs</Text>
                </View> 
                <Text className="text-2xl font-bold mt-2">{gigCount}</Text>
            </View>
            <View className="bg-white p-4 rounded-xl w-[45%] shadow">
                <View className="flex-row items-center gap-2">
                    <Ionicons name="checkmark-done-outline" size={20} color="#16a34a" />
                    <Text className="text-gray-500 text-lg font-semibold">Completed</Text>
                </View>
                <Text className="text-2xl font-bold mt-2">{completedCount}</Text>
            </View>
            <View className="bg-white p-4 rounded-xl w-[45%] shadow">
                <View className="flex-row items-center gap-2">  
                    <Ionicons name="time-outline" size={20} color="#f59e0b" />
                    <Text className="text-gray-500 text-lg font-semibold">Pending</Text>
                </View>
                <Text className="text-2xl font-bold mt-2">{pendingCount}</Text>
            </View>
            <View className="bg-white p-4 rounded-xl w-[45%] shadow">
                <View className="flex-row items-center gap-2">
                    <Ionicons name="star-outline" size={20} color="#eab308" />
                    <Text className="text-gray-500 text-lg font-semibold">Rating</Text>
                </View>
                <Text className="text-2xl font-bold mt-2">{rating.toFixed(1)}</Text>
            </View>
        </View>

    <View className="w-[90%] bg-white p-4 rounded-2xl shadow-sm mb-4">
        <Text className="text-lg font-bold mb-1">
            Start earning today 🚀
         </Text>
        <Text className="text-gray-500 mb-4">
            Create your gig and get more clients
        </Text>

        <Pressable className="bg-green-600 p-4 rounded-xl flex-row justify-center items-center mb-3" onPress={() => router.replace('/(freelancer-tabs)/createGig')}>
            <Ionicons name="add-circle" size={22} color="white" />
            <Text className="text-white font-bold text-lg ml-2">
                Create Gig
            </Text>
        </Pressable>

        <View className="flex-row justify-between">
            <Pressable className="bg-gray-100 p-3 rounded-xl w-[45%] items-center" onPress={() => router.replace('/(freelancer-tabs)/activeGigs')}>
                <Text>My Gigs</Text>
            </Pressable>

            <Pressable className="bg-gray-100 p-3 rounded-xl w-[45%] items-center" onPress={() => router.replace('/(freelancer-tabs)/request')}>
                <Text>Requests</Text>
            </Pressable>
        </View>
    </View>
    
      <View className="mt-6 items-center w-[90%] bg-white p-4 rounded-2xl shadow-sm mb-4">
        <Text className="text-xl font-bold mb-3">Project Status Overview</Text>
        <PieChart
            data={data}
            width={width - 40}
            height={220}
            chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
        />
    </View>
   
    <View style={{ width: width, height: height / 4, padding: 10 }}>
                
                         {/* <FlatList
                            data={slides}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item.id}
                            onScroll={ (e) =>{
                                const contentOffsetX = e.nativeEvent.contentOffset.x
                                const currentIndex = Math.round(contentOffsetX / width)
                                setCurrentSlideIndex(currentIndex)
                            }}
                            renderItem={({ item }) => (
                                <View className="flex-1 justify-center items-center rounded-lg h-full" style={{backgroundColor: item.color, width:width-20}}>
                                   
                                </View>
                            )}

                        />
                        <View className="flex-row justify-center z-10 w-full mt-1">
                          {
                              slides.map((index)=> (  
                                <View className={`h-2 w-2 rounded-full mx-1 ${currentSlideIndex === slides.indexOf(index) ? 'bg-blue-500' : 'bg-gray-300'}`} key={index.id}></View>
                              ))
                          }
                        </View> */}

                        

                
            </View>

            <Wallet visible={previewVisible} onClose={() => setPreviewVisible(false)} />
            
        </View>
    </ScrollView>   
    )
}

export default FreelancerDashboard