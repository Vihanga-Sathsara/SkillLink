import { getUserDetails } from "@/service/authService"
import { auth } from "@/service/firebase"
import { Ionicons } from "@expo/vector-icons"
import React from "react"
import { useEffect } from "react"
import { KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, View, Text, Dimensions, Keyboard, Platform,Image, Pressable, TextInput, TouchableOpacity, Alert } from "react-native"
import { updateDetails } from "@/service/authService"
import { useLoader } from "@/hooks/useLoader"
import * as ImagePicker from "expo-image-picker"
import { uploadImageToCloudinary } from "@/service/cloudinaryService"
import * as documentPicker from 'expo-document-picker'
import { uploadPDFToCloudinary } from "@/service/cloudinaryService"
import { getVerificationDataByUserId, saveVerificationData, updateVerificationStatus } from "@/service/verificationService"
import { deleteGigsByUserId } from "@/service/freelancerService"
import { deleteUserAccount } from "@/service/authService"
import { router } from "expo-router"

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
    const [ verifyDocument , setVerifyDocument ] = React.useState<any>(null)
    const [updateData , setUpdateData ] = React.useState<any>({})
    const [documentName , setDocumentName ] = React.useState<string>("")
    const { showLoader, hideLoader, isLoading } = useLoader()
    const [newProfileImage , setNewProfileImage ] = React.useState<string | null>(null)
    const [newBannerImage , setNewBannerImage ] = React.useState<string | null>(null)
    const [verificationStatus , setVerificationStatus ] = React.useState<string>("")
    const [verificationData , setVerificationData ] = React.useState<any>(null)
   

    const [user , setUser] = React.useState<any>(null);
    useEffect(() => { 
        fetchUserDetails()
        checkVerificationStatus()
    }, [])

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

    const checkVerificationStatus = async () => {
        if (!auth.currentUser) return
        const verificationData = await getVerificationDataByUserId(auth.currentUser.uid)
        if (verificationData && verificationData.length > 0) {
           setVerificationStatus(verificationData[0].verified)
           setVerificationData(verificationData[0])
        }
    }

    useEffect(() => {
        checkChanges()
    }, [name, bio, address, country,profileImage,bannerImage, user])

    useEffect(() => {
        checkChangeData()
    }, [name, bio, address, country,profileImage,bannerImage, user])

    const checkChanges = () => { 
       if (!user) return
       if ( user.fullName === name && user.bio === bio && user.address === address &&  user.country === country &&  user.profileImage === profileImage && user.bannerImage === bannerImage ) {
             setChangesMade(false) 
       }else{
             setChangesMade(true)
       }
       
    }

    const checkChangeData = async () => {
        const updates: any = {}
        if (!user) return
        if ( user.fullName !== name ) {
          updates.fullName = name
        }
        if ( user.bio !== bio ) {
            updates.bio = bio
        }
        if ( user.address !== address ) {
           updates.address = address
        }
        if ( user.country !== country ) {
           updates.country = country
        }
        setUpdateData(updates)
    }

    const updateProfile = async () => {
       if (isLoading) return
        if (!auth.currentUser) {
            alert("User not logged in")
            hideLoader()
            return
        }
        if (newProfileImage){
            const uploadedProfileImageUrl = await uploadProfileImageToServer()
            if (uploadedProfileImageUrl) {
                updateData.profileImage = uploadedProfileImageUrl
            }
        }
        if (newBannerImage){
            const uploadedBannerImageUrl = await uploadBannerImageToServer()
            if (uploadedBannerImageUrl) {
                updateData.bannerImage = uploadedBannerImageUrl
            }
        }
        try {
            showLoader()
            await updateDetails(auth.currentUser, updateData)
            alert("Profile updated successfully")
            setChangesMade(false)
            setUpdateData({})
            setNewProfileImage(null)
            setNewBannerImage(null)
            fetchUserDetails()
        }
        catch (error) {
            alert("Failed to update profile")
        }
        finally {
            hideLoader()
        }
    }

    const uploadProfileImageToServer = async () => {
          
          if (!newProfileImage) {
              alert("No image selected")
              return
            }
         
          try{
            const fileName = `${auth.currentUser?.uid}_Profile_Image_${Date.now()}.jpg`
            const res = await uploadImageToCloudinary(newProfileImage,fileName)
            console.log("Cloudinary Upload Response: ", res)
    
            if (res) {
                return res
            } else {
                alert("Image upload failed")
            }
          } catch (error) {
            console.error("Error uploading profile image: ", error)
            alert("An error occurred while uploading the image.")
          }
    }

    const uploadBannerImageToServer = async () => {
          
          if (!newBannerImage) {
              alert("No image selected")
              return
          }
         
          try{
            const fileName = `${auth.currentUser?.uid}_Banner_Image_${Date.now()}.jpg`
            const res = await uploadImageToCloudinary(newBannerImage,fileName)
            console.log("Cloudinary Upload Response: ", res)
    
            if (res) {
                return res
            } else {
                alert("Image upload failed")
            }
          } catch (error) {
            console.error("Error uploading banner image: ", error)
            alert("An error occurred while uploading the image.")
          }
    }

    const uploadVerifyDocumentToServer = async () => {
          
        if (!verifyDocument) {
            alert("No document selected")
            return
        }

        try{
            const fileName = `${auth.currentUser?.uid}_Verification_Document_${Date.now()}.pdf`
            const res = await uploadPDFToCloudinary(verifyDocument,fileName)
            console.log("Cloudinary Upload Response: ", res)

            if (res) {
                return res
            }else {
                alert("Document upload failed")
            }
          } catch (error) {
            console.error("Error uploading verification document: ", error)
            alert("An error occurred while uploading the document.")
          }
    }

    const pickProfileImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!')
          return
        }
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
    
        if (!result.canceled) {
          setProfileImage(result.assets[0].uri)  
          setNewProfileImage(result.assets[0].uri)
        }
    }

    const pickBannerImage = async () => {
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
          setBannerImage(result.assets[0].uri)  
          setNewBannerImage(result.assets[0].uri)
        }
    }

    const pickVerifyDocument = async () => {
        const result = await documentPicker.getDocumentAsync({
            type: 'application/pdf',
            copyToCacheDirectory: true,
        })
         
        console.log("Document Picker Result: ", result)

        if(!result.canceled){
            setVerifyDocument(result.assets[0].uri)
            setDocumentName(result.assets[0].name)
            console.log("Selected Document: ", result.assets[0].uri)
        }
    }

   
    const sendVerificationDocument = async () => {
        if (isLoading) return
        if (!auth.currentUser) {
            alert("User not logged in")
            hideLoader()
            return
        }
        if (!verifyDocument) {
            alert("No document selected")
            hideLoader()
            return
        }
        try{
            showLoader()
            const uploadedDocumentUrl = await uploadVerifyDocumentToServer()
            if (uploadedDocumentUrl) {
                await saveVerificationData(auth.currentUser.uid, uploadedDocumentUrl)
                await updateVerificationStatus(verificationData.id, "pending")
                checkVerificationStatus()
                alert("Verification document sent successfully")
                setVerifyDocument(null)
                setDocumentName("")
                checkVerificationStatus()
            }
        } catch (error) {
            console.error("Error sending verification document: ", error)
            alert("An error occurred while sending the verification document.")
        } finally {
            hideLoader()
        }
    }

    const accountDeletion = async () => {
        Alert.alert(
            "Confirm Deletion",
            "Are you sure you want to delete your account? This action cannot be undone.",
        [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: () => {
                deleteAccount()
                console.log("Account deleted")
            } 
            },
        ]
     )
    }

    const deleteAccount = async () => {
        if (isLoading) return

        if (!auth.currentUser) {
            alert("User not logged in")
            return
        }

        try {
            showLoader()
            await deleteGigsByUserId(auth.currentUser.uid)
            await deleteUserAccount(auth.currentUser.uid)
            alert("Account deleted successfully")
            router.replace('/login')
        } catch (error) {
            console.error("Error deleting account: ", error)
            alert("An error occurred while deleting the account. Please try again.")
         } finally {
            hideLoader()
         }
    }
    
    const {width } =  Dimensions.get('window')
        return (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                  <View style={{ width:width, backgroundColor:"#F9FAFB", alignItems:"center", justifyContent:"space-between"}}>
                   <View className="w-[90%] justify-center">
                        <View className="w-full mb-5 mt-7">
                            <Text className="text-3xl text-[#111827] font-bold pt-6">Account Center</Text>
                            <Text className="font-semibold text-gray-500">Control your personal info, settings, and preferences in one place.</Text>
                        </View>
                        <Text className="text-2xl text-[#111827] font-bold mb-4">Personal Information</Text>
                        <View className="w-full gap-4 mb-10">
                           
                            {
                                bannerImage ? (
                                    <View className="w-full h-[150px] bg-gray-200 rounded-lg mb-4 items-center justify-center">
                                        <Image source={{ uri: bannerImage }} className="w-full h-full rounded-lg items-center justify-center"/>
                                        <Pressable className="absolute bottom-0 right-0 bg-white rounded-lg p-2 border border-gray-300" onPress={pickBannerImage}>
                                            <Text className="font-semibold">📷</Text>
                                        </Pressable>
                                    </View>
                                ) : (
                                    <View className="w-full h-[150px] bg-gray-200 rounded-lg mb-4 items-center justify-center">
                                        <Ionicons name="image-outline" size={60} color="#6B7280" />
                                        <Text className="text-gray-500 mt-2">No Banner Selected</Text>
                                        <Pressable className="absolute bottom-0 right-0 bg-white rounded-lg p-2 border border-gray-300" onPress={pickBannerImage}>
                                            <Text className="font-semibold">📷</Text>
                                        </Pressable>
                                    </View>
                                )
                            }
                            {
                                profileImage ? (
                                    <View className="w-[120px] h-[120px] rounded-full items-center justify-center absolute top-20 left-2">
                                        <Image source={{ uri: profileImage }} className="w-full h-full rounded-full items-center justify-center "/>
                                        <Pressable className="absolute bottom-0 right-0 bg-white rounded-full p-2 border border-gray-300" onPress={pickProfileImage}>
                                            <Text className="font-semibold">📷</Text>
                                        </Pressable>
                                    </View>
                                ) : (
                                    <View className="w-[120px] h-[120px] rounded-full bg-gray-200 items-center justify-center absolute top-20 left-2">
                                        <Ionicons name="person" size={60} color="#6B7280" />
                                        <Pressable className="absolute bottom-0 right-0 bg-white rounded-full p-2 border border-gray-300" onPress={pickProfileImage}>
                                            <Text className="font-semibold">📷</Text>
                                        </Pressable>
                                    </View>
                                    
                                )
                            }
                        </View>
                        <View>
                            <TextInput placeholder="Email" placeholderTextColor="#999999" className="w-full p-3 border border-gray-200 rounded-md mb-4" editable={false}  value={email} onChangeText={setEmail} ></TextInput>
                            <TextInput placeholder="Full Name" placeholderTextColor="#999999" className="w-full p-3 border rounded-md mb-4"  value={name} onChangeText={setName} ></TextInput>

                            {
                                bio ? (
                                    <TextInput placeholder="Full Name" placeholderTextColor="#999999" className="w-full p-3 border rounded-md mb-4"  value={bio} onChangeText={setBio}></TextInput>
                                ):(
                                    <TextInput className="border border-red-700 rounded-lg p-3 pl-4 mb-4" multiline numberOfLines={ 8 } placeholder="Bio" placeholderTextColor="#999999" value={bio || ""} onChangeText={setBio}></TextInput>
                                )
                            }
                            {
                                address ? (
                                    <TextInput placeholder="Full Name" placeholderTextColor="#999999" className="w-full p-3 border rounded-md mb-4"  value={address} onChangeText={setAddress}></TextInput>
                                ):(
                                    <TextInput className="border border-red-700 rounded-lg p-3 pl-4 mb-4" multiline numberOfLines={ 5 } placeholder="Address" placeholderTextColor="#999999" value={address || ""} onChangeText={setAddress}></TextInput>
                                )
                            }
                            {
                                country ? (
                                    <TextInput placeholder="Full Name" placeholderTextColor="#999999" className="w-full p-3 border rounded-md mb-4"  value={country} onChangeText={setCountry}></TextInput>
                                ):(
                                    <TextInput className="border border-red-700 rounded-lg p-3 pl-4 mb-4" placeholder="Country" placeholderTextColor="#999999" value={country || ""} onChangeText={setCountry}></TextInput>
                                )
                            }

                            <Pressable onPress={updateProfile} className={`w-full items-center  p-3 rounded-md mb-4  ${changesMade ? "bg-green-500" : "bg-gray-400" }`} disabled={!changesMade}>
                                <Text className="text-white font-bold">{changesMade ? "Save Changes" : "No Changes"}</Text>
                            </Pressable>
                        </View>
                        <View className="mb-4">
                            <Text className="text-2xl text-[#111827] font-bold mb-4">Verification Center</Text>
                            <View className="w-full border-l-2 p-4 bg-gray-100 border-l-blue-500 rounded-lg mb-4">
                                {
                                    verificationStatus === "pending" ? (
                                        <View className="w-full flex flex-row justify-start items-center">
                                        <Ionicons name="time-outline" size={24} color="orange" />
                                        <Text className="p-2">Verification takes up to 3 business days ⏳</Text>
                                        </View>
                                    ) : verificationStatus === "approved" ? (
                                        <View className="w-full flex flex-row justify-start items-center">
                                        <Ionicons name="checkmark-circle-outline" size={24} color="green" />
                                        <Text className="p-2">You are verified as a trusted professional ✅</Text>
                                        </View>
                                    ) : verificationStatus === "rejected" ? (
                                        <View className="w-full flex flex-row justify-start items-center">
                                        <Ionicons name="close-circle-outline" size={24} color="red" />
                                        <Text className="p-2">Verification rejected. Please resubmit ❌</Text>
                                        </View>
                                    ) : (
                                        <View className="w-full flex flex-row justify-start items-center">
                                        <Ionicons name="information-circle-outline" size={24} color="#3B82F6" />
                                        <Text className="p-2">Get Verified and Showcase Yourself 🏅</Text>
                                        </View>
                                    )
                                }                              
                            </View>
                            {
                                verificationStatus === "not verified" || verificationStatus === "rejected" || verificationStatus === "" ? (
                                    <View>
                                        <Text className="text-xl mb-3">✅ Verification Submission Instructions</Text>
                                        <Text className="text-lg text-gray-600 mb-2">Please upload your verification documents as ONE PDF file that includes all of the following:</Text>
                                        <View className="w-full flex flex-row mb-1">
                                            <Text className="text-sm">1. </Text>
                                            <Text className="text-sm">A clear photo of your government-issued ID (passport, driver's license, or national ID card).</Text>
                                        </View>
                                        <View className="w-full flex flex-row mb-1">
                                            <Text className="text-sm">2. </Text>
                                            <Text className="text-sm">A recent utility bill or bank statement (not older than 3 months) showing your name and address.</Text>
                                        </View>
                                        <View className="w-full flex flex-row mb-1">
                                            <Text className="text-sm">3. </Text>
                                            <Text className="text-sm">A selfie of you holding your government-issued ID next to your face for identity confirmation.</Text>
                                        </View>
                                    </View>
                                ) : null
                            }
                            
                        </View>

                        {
                            verificationStatus === "not verified" || verificationStatus === "rejected" || verificationStatus === "" ?(
                                verifyDocument ? (
                                    <View className="w-full h-[150px] bg-gray-200 rounded-lg mb-4 items-center justify-center">
                                        <Text className="text-gray-500 mt-2 text-center">Document Selected: {documentName}</Text>
                                        <Pressable className="absolute bottom-0 right-0 bg-white rounded-lg p-2 border border-gray-300" onPress={() => setVerifyDocument(null)}>
                                            <Text className="font-semibold">❌</Text>
                                        </Pressable>
                                    </View>
                                ) : (
                                    <Pressable className="w-full h-[150px] bg-gray-200 rounded-lg mb-4 items-center justify-center" onPress={pickVerifyDocument}>
                                        <Ionicons name="document-text-outline" size={60} color="#6B7280" />
                                        <Text className="text-gray-500 mt-2">No Document Selected</Text>
                                    </Pressable>
                                )
                            ) : null
                        }
                        {
                            verificationStatus === "not verified" || verificationStatus === "rejected" || verificationStatus === "" ?(
                                <TouchableOpacity className={`w-full items-center ${verifyDocument ? 'bg-red-500' : 'bg-gray-400'} p-3 rounded-md mb-4`} onPress={() => sendVerificationDocument()} disabled={!verifyDocument}>
                                    <Text className="text-white font-semibold">Verify</Text>
                                </TouchableOpacity>
                            ): null
                        }
                        <View className="mb-7">
                                <Text className="text-2xl text-[#111827] font-bold mb-4">Account Deletion</Text>
                                <Text className="text-gray-700 mb-2">Deleting your account is permanent and cannot be undone.</Text>
                                <Text className="text-gray-700 mb-2">All your gigs and profile data will be permanently removed.</Text>
                                <Text className="text-gray-700 mb-2">Please make sure you really want to delete your account before proceeding.</Text>
                                <Pressable className="bg-red-600 p-3 rounded-md mt-4 items-center" onPress={accountDeletion}>
                                    <Text className="text-white font-bold">Delete Account</Text>
                                </Pressable>
                        </View>
                    </View> 
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        )
}