import { Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

const freelancerLayout = () => {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen name="freelancerDashboard" options={{title:"Dashboard", tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />}} />
        <Tabs.Screen name="activeGigs" options={{title:"Gigs", tabBarIcon: ({ color, size }) => <Ionicons name="briefcase" color={color} size={size} />}} />
        <Tabs.Screen name="createGig" options={{title:"Create Gigs", tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" color={color} size={size} />}} />
        <Tabs.Screen name="earning" options={{title:"Earning", tabBarIcon: ({ color, size }) => <Ionicons name="cash" color={color} size={size} />}} />
        <Tabs.Screen name="profile" options={{title:"Profile", tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />}} />
    </Tabs>
  )
}

export default freelancerLayout;