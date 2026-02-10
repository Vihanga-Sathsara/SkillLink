import Project from "@/components/Project"
import { getUserRole } from "@/service/authService"
import { auth } from "@/service/firebase"
import React from "react"
import { Alert } from "react-native"


export default function FindFreelancer() {
  const [role, setRole] = React.useState("")
  React.useEffect(() => {
          if (!auth.currentUser) {
              Alert.alert("Authentication Error", "User not authenticated. Please log in again.")
              return
          }
          const fetchUserRole = async () => {
              try {
                  const role = await getUserRole(auth.currentUser!.uid)
                  setRole(role)
              } catch (error) {
                  console.error("Error fetching user role: ", error)
                  Alert.alert("Error", "An error occurred while fetching user role.")
              }
          }
          fetchUserRole()
      }, [auth.currentUser?.uid])
    return (
      auth.currentUser?.uid ? (
        <Project uid={auth.currentUser.uid} role={role}></Project>
      ) : null
    )
}