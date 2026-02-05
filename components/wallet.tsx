import { Ionicons } from "@expo/vector-icons"
import { Pressable, View,Text, Modal, Dimensions } from "react-native"


export default function Wallet({visible, onClose}: {visible: boolean, onClose: () => void}) {
    const {width , height} =  Dimensions.get('window')
    return (     
         <Modal visible={visible} animationType="slide" transparent>
          <View className=" bg-white" style={{ width:width, height:height, alignItems:"center"}}> 
            <Pressable onPress={onClose} className=" bg-red-700 p-3 rounded-md items-center w-[10%] mb-4">
                <Text className="text-white font-semibold">X</Text>
            </Pressable>
           
             <View className="w-[90%] bg-yellow-400 rounded-xl p-4">
                <Text className="text-black text-2xl font-semibold mb-4">Wallet</Text>
                <Text className="text-gray-700 mb-2">This is where wallet details will be displayed.</Text>
             </View>
            
        </View>       
         </Modal>
        
    )
}