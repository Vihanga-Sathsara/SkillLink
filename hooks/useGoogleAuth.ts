import * as Google from "expo-auth-session/providers/google"
import { useEffect } from "react"
import { Alert } from "react-native"
import { googleRegister } from "@/service/authService"
import { makeRedirectUri } from "expo-auth-session"


export const useGoogleAuth = (role: string) => {
  
    const [request, response, promptAsync] = Google.useAuthRequest({
      responseType: "id_token", 
      scopes: ["profile", "email"],
    })
      

    useEffect(() => {
    if (response?.type === "success") {
      const idToken = response.authentication?.idToken
      if (idToken) {
        if (!role) {
          Alert.alert("Error", "Please select a role before registering")
          return
        }
        googleRegister(idToken, role).then(user => {
          Alert.alert("Welcome", `Welcome ${user.displayName}`)
        }).catch(error => {
          console.error("Google Registration Error:", error)
          Alert.alert("Error", "Failed to register with Google")
        })
      }
    }
  }, [response])

   return {
    request,
    promptAsync
  }

}

