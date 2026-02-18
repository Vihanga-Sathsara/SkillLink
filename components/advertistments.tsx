import { getAdvertisements } from "@/service/advertistmentService";
import { useEffect, useState } from "react";
import { View, Text, Dimensions, FlatList, Image } from "react-native";

export default function Advertistments() {
    const {width , height} =  Dimensions.get('window')
    const [advertisements, setAdvertisements] = useState<any[]>([])
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0)


   useEffect(() => {
        const fetchAds = async () => {
            try {
                const rs = await getAdvertisements()
                setAdvertisements(rs)
            } catch (error) {
                console.error("Failed to load advertisements:", error)
            } 
        }
        fetchAds()
    }, [])

    return (
        <View>
            {
                advertisements.length > 0 ? (
                    <View style={{ width: width, height: height / 4, padding: 10 }}>  
                        <FlatList
                            data={advertisements}
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
                                <View className="flex-1 justify-center items-center rounded-lg w-full h-full" style={{backgroundColor: item.color, width:width-20}}>
                                    <Image
                                        source={{ uri: item.advertisementUrl}} 
                                        style={{ width: "100%", height: "100%", borderRadius: 10 }}
                                        resizeMode="cover"
                                    />    
                                </View>
                            )}

                        />
                        <View className="flex-row justify-center z-10 w-full mt-1">
                        {
                            advertisements.map((index)=> (  
                                <View className={`h-2 w-2 rounded-full mx-1 ${currentSlideIndex === advertisements.indexOf(index) ? 'bg-blue-500' : 'bg-gray-300'}`} key={index.id}></View>
                            ))
                        }
                        </View>     
                    </View>          
                ):(
                    <View className="w-full h-40 bg-blue-100 rounded-lg items-center justify-center">
                        <Text className="text-gray-500">No Advertisements to Display</Text>
                    </View>
                )
                     
            }
        </View>
       
    )
}
