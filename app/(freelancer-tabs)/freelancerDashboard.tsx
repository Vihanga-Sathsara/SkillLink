import { useState } from "react"
import { View, Text, Dimensions, TouchableOpacity, FlatList, Image } from "react-native"

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


    const {width , height} =  Dimensions.get('window')
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

    return (
      <View style={{ width:width, height:height, alignItems:"center"}}>
        <View className="w-[90%] justify-between items-center flex-row mb-5">
            <Text className="text-xl font-bold">SkillLink</Text>
            <TouchableOpacity>
                <Text className="text-blue-500">Logout</Text>
            </TouchableOpacity>
        </View>
        <View className="w-[90%] mb-5">
            <Text className="text-4xl">Welcome, Freelancer!</Text>
        </View>
            <View style={{ width: width, height: height / 4, padding: 10 }}>
                
                         <FlatList
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
                        </View>

                
            </View>
        </View>

    )
}

export default FreelancerDashboard