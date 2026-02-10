import { auth } from "@/service/firebase"
import { Pressable, View,Text, Modal, Dimensions } from "react-native"
import { getTotalEarnings } from "@/service/requestService"
import React, { useEffect, useState } from "react"


export default function Wallet({visible, onClose}: {visible: boolean, onClose: () => void}) {
    const {width , height} =  Dimensions.get('window')
    const [totalEarnings, setTotalEarnings] = useState(0)

    useEffect(() => {
        const fetchTotalEarnings = async () => {
            if (!auth.currentUser) {
                alert("User not logged in")
                return
            }
            const earnings = await getTotalEarnings(auth.currentUser.uid)
            setTotalEarnings(earnings)
        }
        fetchTotalEarnings()
    }, [])

    return (     
         <Modal visible={visible} animationType="slide" transparent>
            <View className=" bg-white" style={{ width:width, height:height, alignItems:"center"}}> 
                <View className="w-[90%]">

                    <View className="w-full items-end justify-end mt-4 mb-4">
                        <Pressable onPress={onClose} className=" bg-red-700 p-3 rounded-md items-center w-[10%] mb-4">
                            <Text className="text-white font-semibold">X</Text>
                        </Pressable>
                    </View>
                    <View>
                        <View className="w-full bg-purple-100 rounded-lg shadow-lg p-5">
                            <Text className="text-black text-4xl font-semibold mb-2">Total Earning</Text>
                            <Text className="text-black text-4xl">${totalEarnings}</Text>
                        </View>
                    </View>
                </View>
            </View>       
         </Modal>
        
    )
}


