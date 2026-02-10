import RequestModal from "@/components/RequestModal" 
import { getDetailsById, logoutUser } from "@/service/authService"
import { getCategories } from "@/service/categoryService"
import { auth } from "@/service/firebase"
import { getAllGigs, getGigsByCategory } from "@/service/freelancerService"
import { Ionicons } from "@expo/vector-icons"
import { Picker } from "@react-native-picker/picker"
import { router } from "expo-router"
import { useEffect, useState } from "react"
import { View, Text, ScrollView, Pressable, Image, Dimensions, Alert } from "react-native"
import ShowProfile from "@/components/ShowProfile"


export default function ClientDashboard() {
  const [gigs, setGigs] = useState<any[]>([])
  const [seeDescription,setSeeDescription] = useState(false)
  const [category , setCategory] = useState("")
  const [categories, setCategoryList] = useState<Array<any>>([])
  const {width , height} =  Dimensions.get('window')
  const [requestModalVisible, setRequestModalVisible] = useState(false)
  const [selectedGig, setSelectedGig] = useState<any>(null)
  const [userDetails, setUserDetails] = useState<any>({})

   useEffect(() => {
     getGigCategories()
   }, [])

  const fetchGigs = async () => {
       try{
          const activeGigs = await getAllGigs()
          setGigs(activeGigs)
       }catch(error){
          console.error("Error fetching gigs: ", error)
          alert("An error occurred while fetching gigs.")
       }
  }

  useEffect(() => {
    gigs.forEach(async (gig) => {
      if (gig.userId && !userDetails[gig.id]) {
        const user = await getGigCreator(gig.userId)
        setUserDetails((prev: any) => ({ ...prev, [gig.id]: user }))
      }
    });
  }, [gigs])


  const getGigCategories = async () => {
       const fetchedCategories = await getCategories()
       setCategoryList(fetchedCategories)
  }

  useEffect(() => {
    if(category) {
      getGigsByCategoryHandler(category)
    } else {
      fetchGigs()
    }
   }, [category])


   const getGigsByCategoryHandler = async (category: string) => {
      try {
        const activeGigs = await getGigsByCategory(category)
        setGigs(activeGigs)
      } catch (error) {
        console.error("Error fetching gigs by category: ", error)
        alert("An error occurred while fetching gigs by category.")
      }
    }

    const logoutUserHandler = async () => {
      try {
        await logoutUser()
          router.replace('/login')
      }catch (error) {
          alert("Error logging out")
          console.error("Logout Error: ", error)
      }
    }

    const getGigCreator = async (userId: string) => {
      try {
        const user = await getDetailsById(userId)
        return user
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }

    const confirmRequest = () => {
      Alert.alert(
        "Confirm Request",
        "Once you send a request for this project, it cannot be canceled later. Do you want to continue?",
        [
          {
            text: "No",
            style: "cancel"
          },
          {
            text: "Yes",
            onPress: () => setRequestModalVisible(true) 
          }
        ]
      )
    }


    return (
      <ScrollView>
      <View style={{ width:width, height:height, alignItems:"center"}}>
        <View className="w-[90%] items-end flex flex-row justify-between gap-4 mt-7 mb-5"> 
            <View>
              <Text className="text-2xl font-semibold text-blue-700">SkillLink</Text>
            </View>            
            <View className="flex flex-row items-center">
              <Pressable onPress={logoutUserHandler}>
                <Ionicons name="log-out-outline" size={24} color="black" />
              </Pressable>
            </View>       
        </View>
        <View className="w-[90%] mb-5">
          <Text className="text-xl font-semibold">👋 Welcome, {auth.currentUser?.displayName}</Text>
        </View>
        <View className="w-full mb-5">
          <Text className="text-3xl text-[#111827] font-bold pl-6 pt-6">Active Gigs</Text>
          <Text className="font-semibold text-gray-500 pl-6">Monitor your live gigs and make sure everything is on track.</Text>
        </View>

      <View className="w-[90%] justify-center items-end mb-5">
        <View className="w-[50%] border rounded-md">
                <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)} >
                  <Picker.Item label="Select Category" value={null} style={{ color: "gray" }}/>
                  {categories.map((cat) => (
                    <Picker.Item key={cat.id} label={cat.name} value={cat.name} />
                  ))}
                </Picker>
        </View>   
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
                        <Text className="text-gray-500 mt-2">No Image to Preview</Text>
                    </View>
                )
            }
            <Text className="text-base font-bold mb-1">{gig.gigTitle}</Text>
            <View className="flex-row justify-between items-center mb-1">
               <Text className="text-gray-500">Price: ${gig.price}</Text>
               <Text className="text-gray-500">Category: {gig.category}</Text>
            </View>
            <Text className="text-gray-500 mb-1">Complete within {gig.deliveryTime} days</Text>
            <View>
              <Text className="text-blue-500 underline" onPress={() => setSeeDescription(!seeDescription)}>{seeDescription ? "Hide" : "Show"} Description</Text>
            </View>
            {seeDescription && (
              <View className="mt-2">
                <Text className="text-gray-700">{gig.gigDescription}</Text>
              </View>
            )}

         
            {
              gig.userId && (
                 <ShowProfile uid={gig.userId} />
              )
            }
            
                    
            <View className="flex-row mt-3">
               <Pressable className="bg-red-600 px-4 py-2 rounded-md mr-3" onPress={() => { setSelectedGig(gig); confirmRequest() }}>
                <Text className="text-white font-semibold">Request</Text>
              </Pressable>
            </View>
          </View>
        ))}
        </View>
      </View>
      <RequestModal visible={requestModalVisible} onClose={() => setRequestModalVisible(false)} gig={selectedGig} onSuccess={() => {setRequestModalVisible(false), fetchGigs() }} />
      </ScrollView>
    )
}