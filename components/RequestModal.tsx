import React from "react"
import { View,Text, Modal, TouchableWithoutFeedback, ScrollView, KeyboardAvoidingView, Platform, Keyboard, Pressable, Dimensions, TextInput, Image } from "react-native"
import DateTimePicker from '@react-native-community/datetimepicker'
import * as ImagePicker from "expo-image-picker"
import * as documentPicker from 'expo-document-picker'
import { uploadImageToCloudinary, uploadPDFToCloudinary } from "@/service/cloudinaryService"
import { Ionicons } from "@expo/vector-icons"
import { auth } from "@/service/firebase"
import { sendRequestToFreelancer } from "@/service/requestService"
import { useLoader } from "@/hooks/useLoader"



interface RequestProps {
    visible: boolean
    onClose: () => void
    gig: any
    onSuccess?: () => void
}

const RequestModal = ({visible, onClose, gig, onSuccess}: RequestProps) => {
    const {width} =  Dimensions.get('window')
    const [projectTitle, setProjectTitle] = React.useState("")
    const [projectDescription, setProjectDescription] = React.useState("")
    const [budget, setBudget] = React.useState("")
    const [deadline, setDeadline] = React.useState("")
    const [imgAttachment, setImgAttachment] = React.useState("")
    const [docAttachment, setDocAttachment] = React.useState("")
    const [showDatePicker, setShowDatePicker] = React.useState(false)
    const [gigDetails, setGigDetails] = React.useState<any>(null)
    const { showLoader, hideLoader, isLoading } = useLoader()
    const [defaultDeadlineDate, setDefaultDeadlineDate] = React.useState("")
    const [defaultBudget, setDefaultBudget] = React.useState("")
    

    React.useEffect(() => {
        setGigDetails(gig)
    },[gig])

    const onChangeDate = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false)
        if (selectedDate) {
            setDeadline(selectedDate.toISOString().split('T')[0])
        }
    }

    React.useEffect(() => {
        setDefaultBudget(gigDetails?.price.toString())
        setDefaultDeadline()
    }, [gigDetails])

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
             setImgAttachment(result.assets[0].uri)  
           }
    }
   
    const pickDocument = async () => {
           const result = await documentPicker.getDocumentAsync({
               type: 'application/pdf',
               copyToCacheDirectory: true,
           })
            
           console.log("Document Picker Result: ", result)
   
           if(!result.canceled){
               setDocAttachment(result.assets[0].uri)
               console.log("Selected Document: ", result.assets[0].uri)
           }
    }

    const uploadImageToServer = async () => {
              
              if (!imgAttachment) {
                  alert("No Attachment selected")
                  return
              }
             
              try{
                const fileName = `${auth.currentUser?.uid}_Attachment_${Date.now()}.jpg`
                const res = await uploadImageToCloudinary(imgAttachment,fileName)
                console.log("Cloudinary Upload Response: ", res)
        
                if (res) {
                    return res
                } else {
                    alert("Image upload failed")
                }
              } catch (error) {
                console.error("Error uploading attachment: ", error)
                alert("An error occurred while uploading the image.")
              }
        }
    
        const uploadDocumentToServer = async () => {
              
            if (!docAttachment) {
                alert("No document selected")
                return
            }
           
            try{
                const fileName = `${auth.currentUser?.uid}_Attachment_${Date.now()}.pdf`
                const res = await uploadPDFToCloudinary(docAttachment,fileName)
                console.log("Cloudinary Upload Response: ", res)
    
                if (res) {
                   return res
                }else {
                    alert("Document upload failed")
                }
              } catch (error) {
                console.error("Error uploading attachment: ", error)
                alert("An error occurred while uploading the document.")
              }
        }

    const removeAttachment = () => {

        if(imgAttachment){
            setImgAttachment("")
        }
        if(docAttachment){
            setDocAttachment("")
        }
    }

    const setDefaultDeadline = () => {     
        if(!gigDetails || !gigDetails.deliveryTime) {
            return
        }
        const deadlineDate = new Date()
        deadlineDate.setDate(deadlineDate.getDate() + gigDetails.deliveryTime)
        setDefaultDeadlineDate(deadlineDate.toISOString().split('T')[0])
    }

    const sendRequest = async () => { 
        if(isLoading) return
        try{
            showLoader()
            if(projectTitle && projectDescription) {
                let attachment = ""
                if(imgAttachment){
                   attachment = await uploadImageToServer()
                }

                if(docAttachment){
                   attachment = await uploadDocumentToServer()
                }

                if(deadline && budget){
                    await sendRequestToFreelancer(auth.currentUser?.uid || "", gigDetails.userId, gigDetails.id, projectTitle, projectDescription, parseFloat(budget), deadline, attachment)
                }else {
                    await sendRequestToFreelancer(auth.currentUser?.uid || "", gigDetails.userId, gigDetails.id, projectTitle, projectDescription, parseFloat(defaultBudget), defaultDeadlineDate, attachment)
                }
                
                alert("Request sent successfully!")
                if(onSuccess){
                    onSuccess()
                }
                closeModal()
            }else {
                alert("Please fill in all required fields.")
                return
            }
        }catch(error){
            console.error("Error sending request: ", error)
            alert("An error occurred while sending the request.")
        }finally{
            hideLoader()
        }
       
    }

    const closeModal = () => {
        setProjectTitle("")
        setProjectDescription("")
        setBudget("")
        setDeadline("")
        setImgAttachment("")
        setDocAttachment("")
        onClose()
    }

    return (
         <Modal visible={visible} animationType="slide">     
                  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                    <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                        <View style={{ width:width,alignItems:"center", justifyContent:"space-between"}}>
                            <View className="w-full ">
                                <Pressable onPress={closeModal} className=" bg-red-700 p-3 rounded-md items-center w-[10%] top-3 right-3 mb-4 self-end">
                                    <Text className="text-white font-semibold">X</Text>
                                </Pressable>
                            </View>
                            <View className="w-[90%] justify-center mb-5">           
                                <Text className="text-[#111827] text-3xl font-bold">Request</Text>
                                <Text className="font-semibold text-gray-500 mb-5">Send a project request to this freelancer and start working together.</Text>
                            </View>
                            <View className="w-[90%] justify-center mb-5 flex flex-row gap-4 bg-gray-100 p-4 rounded-lg">
                                <Image source={{ uri: gigDetails?.bannerImageUrl }} style={{ width: "50%", height: 100, borderRadius: 8 }} />
                                <View className="w-[45%] justify-center pr-4">
                                    <View className="flex flex-row mb-2">
                                        <Text className="text-sm font-semibold">Title : </Text>
                                        <Text className="text-sm ">{gigDetails?.gigTitle}</Text>
                                    </View>
                                    <View className="flex flex-row mb-2">
                                        <Text className="text-sm font-semibold">Category : </Text>
                                        <Text className="text-sm">{gigDetails?.category}</Text>
                                    </View>
                                    <View className="flex flex-row mb-2">
                                        <Text className="text-sm font-semibold">Price : </Text>
                                        <Text className="text-sm ">${gigDetails?.price}</Text>
                                    </View>
                                </View>
                            </View>
                            <View className="w-[90%] bg-gray-100 rounded-lg p-4">
                                <Text className="text-[#111827] text-2xl font-bold mb-3">Project Details</Text>
                                <View className="w-full bg-gray-100 rounded-lg mb-4 items-center gap-4">
                                    <TextInput className="border w-[90%] rounded-lg pl-3" placeholder="Project Title" placeholderTextColor="#999999" value={projectTitle} onChangeText={setProjectTitle}></TextInput>
                                    <TextInput className="border w-[90%] h-[200px] rounded-lg pl-3" numberOfLines={10} textAlignVertical="top" placeholder="Project Description" placeholderTextColor="#999999" value={projectDescription} onChangeText={setProjectDescription}></TextInput>
                                    <View className="w-[90%] flex-row items-center border rounded-md px-3">
                                        <Text className="absolute left-3 text-gray-500">$</Text>
                                        <TextInput placeholder="Your Budget (Optional)" placeholderTextColor="#999999" className="flex-1 p-3 pl-4" keyboardType="numeric" value={budget} onChangeText={setBudget}></TextInput>
                                    </View>
                                    <View className="w-[90%] flex-row items-center justify-between border rounded-md px-3">
                                        <TextInput placeholder="Deadline (Optional)" placeholderTextColor="#999999" value={deadline} onChangeText={setDeadline}></TextInput>
                                        <Pressable>
                                            <Text className="text-blue-700 " onPress={() => setShowDatePicker(true)}>Select Deadline</Text>           
                                        </Pressable>
                                        {
                                            showDatePicker && (
                                                <DateTimePicker
                                                    value={deadline ? new Date(deadline) : new Date()}
                                                    mode="date"
                                                    display="default"
                                                    onChange={onChangeDate}
                                            />
                                            )
                                        }
                                    </View>
                                        {
                                            imgAttachment || docAttachment ? (
                                                <View className="w-[90%] flex-row items-center justify-between border rounded-md px-3">
                                                    <TextInput placeholder="Attachment Added" placeholderTextColor="#999999" editable={false}></TextInput>
                                                    <Pressable onPress={removeAttachment} className="p-2">
                                                        <Text className="text-red-700">x</Text>           
                                                    </Pressable>
                                                </View>
                                            ) : (
                                                <View className="w-[90%] flex-row items-center justify-between border rounded-md px-3">
                                                 <TextInput placeholder="Attachment (Optional)" placeholderTextColor="#999999" editable={false}></TextInput>
                                                 <View className="flex flex-row gap-2">
                                                    <Pressable onPress={pickImage}>
                                                        <Ionicons name="image-outline" size={20} color="#E53E3E" />       
                                                    </Pressable>
                                                    <Pressable onPress={pickDocument}>
                                                        <Ionicons name="attach-outline" size={20} color="#718096" />
                                                    </Pressable>
                                                 </View>
                                                </View> 
                                            )
                                        }
                                    <Pressable className="w-[90%] items-center bg-blue-700 rounded-md p-4" onPress={sendRequest}>
                                        <Text className="text-white font-semibold" >Send Request</Text>           
                                    </Pressable>
                                    
                                </View>
                            </View>
                        </View>

                    </ScrollView>
                  </KeyboardAvoidingView>
                  </TouchableWithoutFeedback>
        </Modal>
    )
}

export default RequestModal