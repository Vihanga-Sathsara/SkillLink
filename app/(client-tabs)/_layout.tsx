import { Ionicons } from "@expo/vector-icons"
import { Tabs } from "expo-router"

const clientLayout = () => {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen name="clientDashboard" options={{title:"Dashboard", tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />}} />
            <Tabs.Screen name="request" options={{title:"Request", tabBarIcon: ({ color, size }) => <Ionicons name="clipboard-outline" color={color} size={size} />}} />
            <Tabs.Screen name="profile" options={{title:"Profile", tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />}} />
        </Tabs>
    )
}

export default clientLayout