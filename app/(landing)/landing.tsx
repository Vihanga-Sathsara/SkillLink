import { View, Text, TouchableOpacity, FlatList, Dimensions, Image} from "react-native"
import React from "react"
import { useState, useRef } from "react"


const slides = [
  {
    id: '1',
    title: 'Connecting Skills with Opportunities',
    description: 'Join SkillLink today and find trusted professionals in just a few taps.',
    image: require('../../assets/images/slide-1.jpeg')
  },
  {
    id: '2',
    title: 'Browse and Find Skills Instantly',
    description: 'Discover trusted professionals and explore their skills with ease.',
    image: require('../../assets/images/slide-2.jpg')
  },
  {
    id: '3',
    title: 'Chat with Professionals Instantly',
    description: 'Communicate directly with service providers before confirming a job.',
    image: require('../../assets/images/slide-3.jpg')
  },
  {
    id: '4',
    title: 'Book Services with Confidence',
    description: 'Hire professionals, track progress, and connect instantly.',
    image: require('../../assets/images/slide-4.png')
  }
]

const {width , height} =  Dimensions.get('window')

const Landing = () => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  return (
    <View style={{width:width , height: height}}>
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
                <View style={{width , height: height/4 * 3}} className="flex-1 bg-white justify-center items-center">
                    <Image source={item.image} style={{width: '100%', height: '50%', resizeMode: 'contain'}} />
                    <Text className="font-semibold text-2xl pt-3">{item.title}</Text>
                    <Text className="text-center px-4 pt-2">{item.description}</Text>
                </View>
            )}
        />
        <View className="flex-row justify-center mb-10 z-10 w-full">
          {
              slides.map((index)=> (  
                <View className={`h-2 w-2 rounded-full mx-1 ${currentSlideIndex === slides.indexOf(index) ? 'bg-blue-500' : 'bg-gray-300'}`} key={index.id}></View>
              ))
          }
        </View>
        <View className="pt-4 bg-[#3B82F6] items-center" style={{width:width, height: height / 4, borderTopRightRadius: 70, borderTopLeftRadius: 70,justifyContent: 'center'}}>
            <Text className="text-xl font-semibold text-center mb-2 text-[#FFFFFF]">Ready to get started?</Text>
            <Text className="text-center px-6 mb-2 text-[#DBEAFE]">
                Join SkillLink and connect with professionals today
            </Text>
            <TouchableOpacity className="mt-1 px-6 py-3 bg-[#1E40AF] rounded-full w-[50%] self-center items-center">
                <Text className="text-white font-semibold text-center">Get Started</Text>
            </TouchableOpacity>
        </View>   
    </View>
  
  )
}

export default Landing