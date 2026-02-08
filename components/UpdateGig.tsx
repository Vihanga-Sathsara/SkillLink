import { Category, getCategories } from "@/service/categoryService"
import { uploadImageToCloudinary } from "@/service/cloudinaryService"
import { auth } from "@/service/firebase"
import { updateDetailsOfGig } from "@/service/freelancerService"
import { Ionicons } from "@expo/vector-icons"
import { Picker } from "@react-native-picker/picker"
import React, { use, useEffect } from "react"
import { KeyboardAvoidingView, TouchableWithoutFeedback, ScrollView, View, Pressable, TouchableOpacity, ActivityIndicator,Text, Keyboard, Platform, TextInput,Image, Dimensions,  Modal } from "react-native"
import * as ImagePicker from "expo-image-picker"
import GigPreviewModal from "./preview"



interface GigUpdateModalProps {
    visible: boolean
    onClose: () => void
    gig: any
    onUpdateSuccess?: () => void
}

const GigUpdateModal = ({visible, onClose, gig, onUpdateSuccess}: GigUpdateModalProps) => {
    
    const {width} =  Dimensions.get('window')

    const [ gigTitle, setGigTitle ] = React.useState("")
    const [ gigDescription, setGigDescription ] = React.useState("")
    const [ price, setPrice ] = React.useState("")
    const [ category, setCategory ] = React.useState("")
    const [ categories, setCategories ] = React.useState<Array<Category>>([])
    const [ deliveryTime, setDeliveryTime ] = React.useState("")
    const [previewVisible, setPreviewVisible] = React.useState(false)
    const [previewButton, setPreviewButton] = React.useState(false)
    const deliveryOptions = [ 1, 2, 3, 5, 7, 14, 30 ]
    const [ selectedImage, setSelectedImage ] = React.useState<string | null>(null)
    const [gigLoader, setGigLoader] = React.useState(false)
    const [changesMade, setChangesMade] = React.useState(false)
    const [newData , setNewData] = React.useState<any>({})

    useEffect(() => {
        getCategoriesList()
    }, [])

    useEffect(() => {
        setGigTitle(gig.gigTitle)
        setGigDescription(gig.gigDescription)
        setPrice(gig.price.toString())
        setCategory(gig.category)
        setDeliveryTime(gig.deliveryTime.toString())
        setSelectedImage(gig. bannerImageUrl || null)         
    }, [gig])

    const getCategoriesList = async () => {
        const fetchedCategories = await getCategories()
        setCategories(fetchedCategories)
    }

    useEffect(() => {
        if(!gigTitle || !gigDescription || !price || !category || !deliveryTime || !selectedImage) {
             setPreviewButton(false)
        } else {
             setPreviewButton(true)
        }
    }, [gigTitle, gigDescription, price, category, deliveryTime, selectedImage])

    useEffect(() => {
        if(gigTitle !== gig.gigTitle || gigDescription !== gig.gigDescription || price !== gig.price.toString() || category !== gig.category || deliveryTime !== gig.deliveryTime.toString() || selectedImage !== gig.bannerImageUrl){
            setChangesMade(true)
        }else{
            setChangesMade(false)
        }
    }, [gigTitle, gigDescription, price, category, deliveryTime, selectedImage, gig])


    useEffect(() => {
        setData()
    }, [gigTitle, gigDescription, price, category, deliveryTime, gig])

    const setData = async () => {
        const gigData: any = {}
        if(gigTitle !== gig.gigTitle) {
            gigData.gigTitle = gigTitle
        }
        if(gigDescription !== gig.gigDescription) {
            gigData.gigDescription = gigDescription
        }
        if(price !== gig.price.toString()) {
            gigData.price = parseFloat(price)
        }
        if(category !== gig.category) {
            gigData.category = category
        }
        if(deliveryTime !== gig.deliveryTime.toString()) {
            gigData.deliveryTime = parseInt(deliveryTime)
        }
        setNewData(gigData)
    }


    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!')
          return
        }
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (!result.canceled) {
          setSelectedImage(result.assets[0].uri)
        }
    }

    const removeImage = () => {
        setSelectedImage(null)
    }

    const uploadImageToServer = async () => {
          
          if (!selectedImage) {
              alert("No image selected")
              return
          }
         
          try{
            const fileName = `${auth.currentUser?.uid}_${Date.now()}.jpg`
            const res = await uploadImageToCloudinary(selectedImage,fileName)
            console.log("Cloudinary Upload Response: ", res)
    
            if (res) {
                return res
            } else {
                alert("Image upload failed")
            }
          } catch (error) {
            console.error("Error uploading image: ", error)
            alert("An error occurred while uploading the image.")
          }
    }

    const createGig = async () => {
          if(!gigTitle || !gigDescription || !price || !category || !deliveryTime) {
              alert("Please fill in all fields.")
              return
          }
          
          const currentUser = auth.currentUser
          if (!currentUser) {
              alert("User not authenticated.")
              return
          }
          setGigLoader(true)
          try{

            if(selectedImage !== gig.bannerImageUrl){
                const imageUrl = await uploadImageToServer()
                if (!imageUrl) {
                    setNewData(imageUrl)
                    setGigLoader(false)
                    return
                }
                newData.bannerImageUrl = imageUrl
            }
    
            await updateDetailsOfGig(gig.id, newData)
            alert("Gig updated successfully!")
            if(onUpdateSuccess) onUpdateSuccess()
            onClose()
          }catch(error){
              console.error("Error updating gig: ", error)
              alert("An error occurred while updating the gig.")
          }finally {
              setGigLoader(false)
          }
      }
    

    const clearInputs = () => {
        setGigTitle("")
        setGigDescription("")
        setPrice("")
        setCategory("")
        setDeliveryTime("")
        setSelectedImage(null)
    }
      
    return (
   <Modal visible={visible} animationType="slide" transparent>     
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
       
        <View style={{ width:width,alignItems:"center", justifyContent:"space-between", backgroundColor:"#F9FAFB"}}>
          <View className="w-[90%] justify-center">
             <Pressable onPress={onClose} className=" bg-red-700 p-3 rounded-md items-center w-[10%] mb-4 top-0 right-0 self-end">
                <Text className="text-white font-semibold">X</Text>
            </Pressable>
            <Text className="text-[#111827] text-3xl font-bold">Update Your Gig</Text>
            <Text className="font-semibold text-gray-500 mb-5">Showcase your skills and attract clients by creating a compelling gig.</Text>
            <View>
              <TextInput placeholder="Gig Title" className="w-full p-3 border rounded-md mb-4" value={gigTitle} onChangeText={setGigTitle}></TextInput>
              <TextInput multiline numberOfLines={5} textAlignVertical="top" placeholder="Describe your gig..." className="w-full p-3 border rounded-md mb-4" value={gigDescription} onChangeText={setGigDescription}></TextInput>
              <View className="w-full border rounded-md mb-4">
                <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)} >
                  <Picker.Item label="Select Category" value={null} style={{ color: "gray" }}/>
                  {categories.map((cat) => (
                    <Picker.Item key={cat.id} label={cat.name} value={cat.name} />
                  ))}
                </Picker>
              </View>
              <View className="w-full flex-row items-center border rounded-md mb-4 px-3">
                <Text className="absolute left-3 text-gray-500">$</Text>
                <TextInput placeholder="Price" className="flex-1 p-3 pl-4" keyboardType="numeric" value={price} onChangeText={setPrice}></TextInput>
              </View>
              <View className="w-full border rounded-md mb-4">
                <Picker selectedValue={deliveryTime} onValueChange={(itemValue) => setDeliveryTime(itemValue)}>
                  <Picker.Item label="Select Delivery Time" value={null} style={{ color: "gray" }}/>
                  {deliveryOptions.map((option) => (
                    <Picker.Item key={option} label={`${option} days`} value={option.toString()}/>
                  ))}
                </Picker>
              </View>

             {
                selectedImage && (
                  <View className="w-full flex-row justify-end">
                    <Pressable onPress={removeImage} className="w-[25%] items-center bg-[#e11d48] p-2 rounded-md mb-4">
                          <Text className="text-white text-sm font-semibold">Remove</Text>
                    </Pressable>
                  </View>  
                )
             } 
              
              <View className="w-full mb-4">
                  {selectedImage ? (
                    <Image source={{ uri: selectedImage }} style={{ width: "100%", height: 200, borderRadius: 8 }} />
                  ): (
                      <Pressable onPress={pickImage} className="w-full h-40 border-2 border-dashed border-blue-300 rounded-md justify-center items-center">
                        <View style={{ alignItems: "center" }}>
                          <Ionicons name="image-outline" size={40} color="#6B7280" />
                          <Text style={{ color: "#6B7280", marginTop: 4 }}>Upload Gig Banner</Text>
                        </View>
                      </Pressable>
                    )
                  }
              </View>
              <View className="w-full flex-row justify-between">
                  <Pressable onPress={() => setPreviewVisible(true)} disabled={!previewButton} className= {`w-[45%] items-center ${previewButton ? "bg-[#99af1e]" : "bg-gray-400"} p-3 rounded-md mb-4 mt-4`}>
                    <Text className="text-white font-semibold">Preview Gig</Text>
                  </Pressable>
                  <TouchableOpacity onPress={clearInputs} className="w-[45%] items-center bg-[#af1e36] p-3 rounded-md mb-4 mt-4">
                    <Text className="text-white font-semibold">Clear</Text>
                  </TouchableOpacity>
              </View>
              <Pressable onPress={createGig} disabled={gigLoader} className={`w-full items-center ${changesMade ? "bg-[#1E40AF]" : "bg-gray-400"} p-3 rounded-md mb-4 mt-4`}>
                    {gigLoader ? (
                      <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Text className="text-white font-semibold">Update Gig</Text>
                      )}
              </Pressable>
              <GigPreviewModal visible={previewVisible} onClose={() => setPreviewVisible(false)} gigTitle={gigTitle} gigDescription={gigDescription} price={price} deliveryTime={deliveryTime} image={selectedImage} />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>  
    </TouchableWithoutFeedback>
    </Modal>
    )
}

export default GigUpdateModal