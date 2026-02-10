import { Dimensions, Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, View, Text, Pressable, ActivityIndicator, Alert, TextInput, Image  } from "react-native"
import React from "react"
import { getProjectsByStatus, getRequestsByStatus, getRequestsForClient, getRequestsForFreelancer, submitPaymentSlip, submitProjectURL, updatePaymentStatus, updateRequestStatus } from "@/service/requestService"
import { auth } from "@/service/firebase"
import { Linking } from "react-native"
import { Picker } from "@react-native-picker/picker"
import { Ionicons } from "@expo/vector-icons"
import ShowProfile from "./ShowProfile"
import * as ImagePicker from "expo-image-picker"
import { uploadImageToCloudinary } from "@/service/cloudinaryService"
import { updateFeedback } from "@/service/authService"



const Project = ({ uid, role }: { uid: string , role: string }) => {
    const {width } =  Dimensions.get('window')

    const [projects, setProjects] = React.useState<any[]>([])
    const [selectedStatus, setSelectedStatus] = React.useState("")
    const statusValues = ["pending", "accepted", "rejected", "completed"]
    const [link, setLink] = React.useState("")
    const [imgAttachment, setImgAttachment] = React.useState("")
    const [fileName, setFileName] = React.useState("")


    React.useEffect(() => {
        getProjects()
    }, [uid, role, selectedStatus])

    const getProjects = async () => {
        try{
            if (!auth.currentUser) {
                console.error("User not authenticated")
                return
            }

            if (!selectedStatus && role === "client") {
                const response = await getRequestsForClient(uid) 
                setProjects(response)
                return
            }else if (!selectedStatus && role === "freelancer") {
                const response = await getRequestsForFreelancer(uid) 
                setProjects(response)
                return
            }

            if (selectedStatus) {
                if (role === "client") {
                    const response = await getRequestsByStatus(uid, selectedStatus)
                    setProjects(response)
                } else if (role === "freelancer") {
                    const response = await getProjectsByStatus(uid, selectedStatus)
                    setProjects(response)
                }
            }

            
        } catch (error) {
            console.error("Failed to fetch projects:", error);
        }
    }

    const AcceptedProject = async ( projectId: string) => {
        try {

            const res = await updateRequestStatus(projectId, "accepted")
            
            if(res === false) {
                alert("Failed to update project status")
                return
            }else if(res === true) {
                await getProjects()
                alert("Project Accepted")
            }
        } catch (error) {
            console.error("Payment processing failed: ", error)
        }
    }

    const rejectedProject = async (projectId: string) => {
        try {
            const res = await updateRequestStatus(projectId, "rejected")
            if(res === false) {
                alert("Failed to update project status")
                return
            }else if(res === true) {
                await getProjects()
                alert("Project Rejected")
            }
        } catch (error) {
            console.error("Failed to update project status: ", error)
        }
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
                 setImgAttachment(result.assets[0].uri)
                 const fileName = result.assets[0].uri.split('/').pop()
                 setFileName(fileName || `payment_slip_${Date.now()}.jpg`)
                 console.log("Selected image: ", result.assets[0].uri)  
               }
    }

    const uploadImageToServer = async (imgAttachment: string, fileName: string) => {
                  
            if (!imgAttachment) {
                alert("No Attachment selected")
                return
            }
                 
                  try{

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

    const removeAttachment = () => {
        setImgAttachment("")
        setFileName("")
    }

    const projectCompletedHandler = async (projectId: string) => {

       try {
            if(!link) {
                alert("Please submit the project link before marking as completed.")
                return
            }

             const res = await updateRequestStatus(projectId, "completed")
                if(res){
                    console.log("Project marked as completed",link)
                    await submitProjectURL(projectId, link)
                    await getProjects()
                    alert("Project marked as completed!")
                }
        
       } catch (error) {
            console.error("Failed to mark project as completed: ", error)
       }
      
    }

    const submitPaymentSlipHandler = async (projectId: string) => {

        try {
                if(!imgAttachment) {
                    alert("Please upload the payment slip before confirming payment.")
                    return
                }
                const imageUrl = await uploadImageToServer(imgAttachment, fileName)
                if (!imageUrl) {
                    return
                }
                await submitPaymentSlip(projectId, imageUrl)
                await getProjects()
                alert("Payment slip submitted successfully!")
        } catch (error) {
                console.error("Failed to submit payment slip: ", error)
                alert("An error occurred while submitting the payment slip.")
        }
    }

    const updatePaymentStatusHandler = async (projectId: string) => {
        try {
            await updatePaymentStatus(projectId, true)
            await getProjects()
            alert("Payment confirmed successfully!")
        } catch (error) {
            console.error("Failed to confirm payment: ", error)
            alert("An error occurred while confirming the payment.")
        }
    }

    const updatePositiveFeedbackHandler = async (uid:string) => {
        try {
            await updateFeedback(uid, 1)
            alert("Thank you for your feedback!")
        }catch (error) {
            console.error("Failed to submit feedback: ", error)
            alert("An error occurred while submitting feedback.")
        }
    }

     const updateNegativeFeedbackHandler = async (uid:string) => {
        try {
            await updateFeedback(uid, -1)
            alert("Thank you for your feedback!")
        }catch (error) {
            console.error("Failed to submit feedback: ", error)
            alert("An error occurred while submitting feedback.")
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                <View style={{ width:width,alignItems:"center"}}>
                    
                    <View className="w-[90%]">
                        <View className="w-full mb-5 mt-7">
                            <Text className="text-3xl text-[#111827] font-bold pt-6">Your Request</Text>
                            <Text className="font-semibold text-gray-500">Here are the details of your project requests to freelancers.</Text>
                        </View>

                        <View className="w-full mb-5 items-end">
                            <View className="w-[50%] border rounded-md">
                                <Picker selectedValue={selectedStatus} onValueChange={(itemValue) => setSelectedStatus(itemValue)} >
                                    <Picker.Item label="Select Category" value={null} style={{ color: "gray" }}/>
                                    {statusValues.map((status) => (
                                        <Picker.Item key={status} label={status} value={status} />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                    
                     {projects.map(project => (
                        <View key={project.id} className="bg-white p-4 rounded-lg mb-4 w-full">
                            <Text className="text-2xl font-bold text-blue-700">{project.projectTitle}</Text>
                            <Text className="text-lg">{project.projectDescription}</Text>
                            {
                                project.attachmentURL ? (
                                    <Pressable onPress={() => Linking.openURL(project.attachmentURL)} className="bg-blue-700 p-2 rounded mt-3 w-[50%] items-center">
                                        <Text className="text-white font-semibold">View Attachment</Text>
                                    </Pressable>
                                ) : null
                            }
                            <View className="w-full flex flex-row items-center justify-between mt-4">
                                <Text className="">Budget: ${project.budget}</Text>
                                <Text className="">Deadline: {project.deadline}</Text>
                            </View>
                            {
                                role === "client" && (
                                    <View className="mt-4 bg-gray-100 p-4 rounded-lg mb-4">
                                        <Text className="text-xl font-semibold mb-4">Freelancer Information</Text>
                                        <ShowProfile uid={project.freelancerId }></ShowProfile>
                                    </View>
                                )
                            }
                            {
                                role === "freelancer" && (
                                    <View className="mt-4 bg-gray-100 p-4 rounded-lg mb-4">
                                        <Text className="text-xl font-semibold mb-4">Client Information</Text>
                                        <ShowProfile uid={project.clientId }></ShowProfile>
                                    </View>
                                )
                            }
                            
                            {
                                role === "client" && (
                                    project.status === "pending" ? (
                                        <View className="w-full flex-row items-center gap-4 mt-4 border-l-4 border-yellow-500 p-4 bg-gray-50 rounded-lg">
                                            <ActivityIndicator size="small" color="#f59e0b" />
                                            <Text className="text-yellow-600 font-semibold">
                                                Waiting for response
                                            </Text>
                                        </View>
                                    ) : project.status === "accepted" ? (
                                        <View className="w-full">
                                            <View className="w-full flex-row items-center gap-4 mt-4 border-l-4 border-green-500 p-4 bg-gray-50 rounded-lg mb-4">
                                                <Ionicons name="checkmark" size={24} color="green" />
                                                <Text className="text-green-500 font-semibold">Project was accepted</Text>
                                            </View>
                                            <View className="w-full flex flex-row gap-4 items-center border-l-4 rounded-lg border-l-blue-500 p-4 mb-4">
                                                <ActivityIndicator size="small" color="#3b82f6" />
                                                <Text className="text-blue-600 font-semibold">
                                                    Waiting for freelancer to submit the project
                                                </Text>    
                                            </View>
                                        </View>
                                    ) : project.status === "rejected" ? (
                                        <View className="w-full flex-row items-center gap-4 mt-4 border-l-4 border-red-500 p-4 bg-gray-50 rounded-lg">
                                            <Ionicons name="close-circle" size={28} color="red" />
                                            <Text className="text-red-500 font-semibold">Project was rejected</Text>         
                                        </View>
                                        
                                    ) : project.status === "completed" && (
                                        <View className="w-full">
                                            {
                                                project.paymentUrl ? (
                                                    (
                                                        project.paymentStatus === false ? (
                                                            <View className="w-[90%] flex-row items-center gap-4 mt-4 border-l-4 border-blue-600 p-4 bg-gray-50 rounded-lg mb-4">
                                                                <ActivityIndicator size="small" color="#3B82F6" />
                                                                    <Text className="text-blue-600 font-semibold">
                                                                        Waiting for response
                                                                    </Text>
                                                            </View>
                                                        ):(
                                                            <View className="w-[90%] items-center gap-4 mt-4 border-l-4 border-blue-700 p-4 bg-gray-50 rounded-lg mb-4">
                                                                <Text className="text-xl font-semibold">Your Project</Text>
                                                                 <Pressable onPress={() => Linking.openURL(project.projectUrl)} className="bg-blue-600 p-3 rounded mt-3 items-center">
                                                                    <Text className="text-white font-semibold">Get Your Project</Text>
                                                                </Pressable>
                                                            </View>
                                                        )
                                                    )
                                                    
                                                ):(
                                                    <View className="w-[90%] flex-row items-center gap-4 mt-4 border-l-4 border-green-500 p-4 bg-gray-50 rounded-lg mb-4">
                                                        <Ionicons name="checkmark-done" size={24} color="green" />
                                                        <Text className="text-green-500 font-semibold">Freelancer has completed the project. Please pay and send slip to freelancer.</Text>
                                                    </View>
                                                )
                                            }
                                            
                                            
                                            {
                                                !project.paymentUrl && (
                                                    imgAttachment ? (
                                                        <View className="w-full flex-row items-center justify-between border rounded-md px-3">
                                                            <TextInput>{fileName}</TextInput>
                                                                <View className="flex flex-row gap-2 items-center">
                                                                    <Pressable onPress={removeAttachment} className="p-2">
                                                                        <Text className="text-red-700 text-xl">x</Text>           
                                                                    </Pressable>
                                                                </View>
                                                        </View>
                                                    ) : (
                                                        <View className="w-full flex-row items-center justify-between border rounded-md px-3">
                                                            <TextInput placeholder="Submit Your Payment Slip" className="w-[90%]">{imgAttachment ? fileName : ""}</TextInput>
                                                            <View className="flex flex-row gap-2">
                                                                <Pressable onPress={pickImage}>
                                                                    <Ionicons name="image-outline" size={20} color="#E53E3E" />       
                                                                </Pressable>
                                                            </View>
                                                        </View> 
                                                    )
                                                ) 
                                            
                                            } 
                                        {
                                            project.paymentUrl ? (
                                            <View className="w-full"> 
                                             <View className="w-[90%]">
                                                <Text className="text-xl  text-center">Give Your Honest Feedback!</Text>
                                             </View>
                                               
                                               <View className="w-[90%] flex flex-row mt-5 gap-4 items-center justify-center">
                                                    <Pressable className="p-4 rounded-lg bg-blue-100" onPress={() => updatePositiveFeedbackHandler(project.freelancerId)}>
                                                        <Text>
                                                            <Ionicons name="thumbs-up" size={32} color="blue" />
                                                        </Text>
                                                    </Pressable>
                                                    <Pressable className="p-4 rounded-lg bg-red-100" onPress={() => updateNegativeFeedbackHandler(project.freelancerId)}>
                                                        <Text>
                                                            <Ionicons name="thumbs-down" size={32} color="red" />
                                                        </Text>
                                                    </Pressable>
                                                </View>
                                             </View>   
                                            ): (
                                                 <Pressable className=" bg-blue-700 p-3 rounded-md items-center mt-4" onPress={() => Alert.alert("Confirm Payment", "Are you sure you want to confirm payment for this project?", [
                                                        {
                                                            text: "No",
                                                            style: "cancel"
                                                        },
                                                        {
                                                            text: "Yes",
                                                            onPress: () => {
                                                                submitPaymentSlipHandler(project.id)
                                                            }
                                                        }
                                                    ])}>
                                                    <Text className="text-white font-semibold">
                                                        Confirm Payment
                                                    </Text>
                                             </Pressable>
                                            )
                                        } 
                                        </View>
                                    )
                                )
                            }
                            {
                                role === "freelancer" && (
                                    project.status === "pending" ? (
                                        <View className="w-full mt-4">
                                            <View className="w-full flex flex-row justify-between mt-4">
                                                <Pressable onPress={() => Alert.alert("Accept Project", "Are you sure you want to accept this project?", [
                                                    {
                                                        text: "No",
                                                        style: "cancel"
                                                    },
                                                    {
                                                        text: "Yes",
                                                        onPress: () => {
                                                            AcceptedProject(project.id)
                                                        }
                                                    }
                                                ])} className="bg-green-600 p-2 rounded w-[45%] items-center">
                                                    <Text className="text-white font-semibold">Accept</Text>
                                                </Pressable>

                                                <Pressable onPress={() => Alert.alert("Reject Project", "Are you sure you want to reject this project?", [
                                                    {
                                                        text: "No",
                                                        style: "cancel"
                                                    },
                                                    {
                                                        text: "Yes",
                                                        onPress: () => {
                                                            rejectedProject(project.id)
                                                        }
                                                    }
                                                ])} className="bg-red-600 p-2 rounded w-[45%] items-center">
                                                    <Text className="text-white font-semibold">Reject</Text>
                                                </Pressable>
                                            </View>
                                        </View>
                                        
                                        
                                    ) : project.status === "accepted" ? (
                                        <View className="w-full mt-4">
                                            <View className="w-full flex-row items-center gap-4 border-l-4 border-green-500 p-4 bg-gray-50 rounded-lg mb-4">
                                                <Ionicons name="checkmark" size={24} color="green" />
                                                <Text className="text-green-500 font-semibold">You accepted this project</Text>
                                            </View>
                                            <View className="w-full flex flex-row gap-4 items-center border-l-4 rounded-lg border-l-orange-500 p-4 mb-4">
                                                <Ionicons name="cloud-upload-outline" size={18} color="#374151" />
                                                <Text className="text-black text-sm">
                                                    Please upload your completed work to Google Drive and submit the shareable link below.
                                                </Text>
                                            </View>
                                            <View className="w-full">
                                                <TextInput placeholder="Submit Your Project Link" className="w-full p-3 border rounded-md mb-4" value={link} onChangeText={setLink}></TextInput>
                                                <Pressable onPress={() => Alert.alert("Submit Project", "Are you sure you want to submit this project?", [
                                                    {
                                                        text: "No",
                                                        style: "cancel"
                                                    },
                                                    {
                                                        text: "Yes",
                                                        onPress: () => {
                                                            projectCompletedHandler(project.id)
                                                        }
                                                    }
                                                ])} className="bg-blue-700 p-3 rounded-md items-center">
                                                    <Text className="text-white font-semibold">Submit Project</Text>
                                                </Pressable>
                                            </View>
                                        </View>
                                    ) : project.status === "rejected" ? (
                                        <View className="w-full mt-4">
                                            <View className="w-full flex-row items-center gap-4 border-l-4 border-red-500 p-4 bg-gray-50 rounded-lg mb-4">
                                                <Ionicons name="close-circle" size={28} color="red" />
                                                <Text className="text-red-500 font-semibold">You rejected this project</Text>
                                            </View>
                                        </View>
                                    ) : project.status === "completed" && ( 
                                        project.paymentUrl ? (
                                            (
                                                project.paymentStatus === false ? (
                                                    <View>
                                                        <Pressable onPress={() => Linking.openURL(project.paymentUrl)} className="bg-green-600 p-3 rounded mt-3 items-center mb-4">
                                                            <Text className="text-white font-semibold">View Payment Slip</Text>
                                                        </Pressable>
                                                        <Pressable onPress={() => Alert.alert("Accept Payment", "Are you sure you want to accept this payment?", [
                                                            {
                                                                text: "No",
                                                                style: "cancel"
                                                            },
                                                            {
                                                                text: "Yes",
                                                                onPress: () => {
                                                                    updatePaymentStatusHandler(project.id)
                                                                }
                                                            }
                                                            ])} className="bg-blue-700 p-3 rounded-md items-center">
                                                            <Text className="text-white font-semibold">Accept Payment</Text>
                                                        </Pressable>
                                                    </View>
                                                    
                                                ):(
                                                    
                                                    <View className="w-full mt-4">
                                                        <Pressable onPress={() => Linking.openURL(project.paymentUrl)} className="bg-green-600 p-3 rounded mt-3 items-center mb-4">
                                                            <Text className="text-white font-semibold">View Payment Slip</Text>
                                                        </Pressable>
                                                        <View className="w-full flex-row items-center gap-4 border-l-4 border-blue-700 p-4 bg-gray-50 rounded-lg mb-4">
                                                            <Ionicons name="checkmark" size={24} color="blue" />
                                                            <Text className="text-blue-700 font-semibold">All are done!</Text>
                                                        </View>
                                                        <View className="w-full"> 
                                                            <View className="w-[90%]">
                                                                <Text className="text-xl  text-center">Give Your Honest Feedback!</Text>
                                                            </View>
                                                            
                                                            <View className="w-[90%] flex flex-row mt-5 gap-4 items-center justify-center">
                                                                    <Pressable className="p-4 rounded-lg bg-blue-100" onPress={() => updatePositiveFeedbackHandler(project.clientId)}>
                                                                        <Text>
                                                                            <Ionicons name="thumbs-up" size={32} color="blue" />
                                                                        </Text>
                                                                    </Pressable>
                                                                    <Pressable className="p-4 rounded-lg bg-red-100" onPress={() => updateNegativeFeedbackHandler(project.clientId)}>
                                                                        <Text>
                                                                            <Ionicons name="thumbs-down" size={32} color="red" />
                                                                        </Text>
                                                                    </Pressable>
                                                                </View>
                                                            </View>
                                                    </View>
                                                )   
                                            )
                                        ):(
                                            <View className="w-full flex flex-row gap-4 items-center border-l-4 rounded-lg border-l-orange-500 p-4 mb-4">
                                                <Ionicons name="card-outline" size={18} color="#10B981" />
                                                <Text className="text-black text-sm">
                                                    waiting for client to confirm payment!
                                                </Text>
                                            </View>
                                        )
                                    )
                                )
                            }         
                        </View>
                    ))} 
                   
                </View>
                   
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
        </TouchableWithoutFeedback>    

    )
}

export default Project;