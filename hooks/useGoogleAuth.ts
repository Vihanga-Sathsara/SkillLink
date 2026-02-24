import * as Google from "expo-auth-session/providers/google"
import { useEffect } from "react"
import { Alert } from "react-native"
import { googleLogin, googleRegister } from "@/service/authService"
import { makeRedirectUri } from "expo-auth-session"


export const useGoogleAuth = (role: string) => {
  
    const [request, response, promptAsync] = Google.useAuthRequest({
      clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
      responseType: "id_token",
      scopes: ["profile", "email"],
      redirectUri: makeRedirectUri({ useProxy: true } as any)
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


export const useGoogleLogin = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    responseType: "id_token",
    scopes: ["profile", "email"],
    redirectUri:  makeRedirectUri({ useProxy: true } as any)
  })

  useEffect(() => {
    if (response?.type === "success") {
      const idToken = response.authentication?.idToken;
      if (!idToken) return

      googleLogin(idToken)
        .then(user => {
          console.log("Logged User:", user)
        })
        .catch(error => {
          console.error("Google Login Error:", error)
          Alert.alert("Error", "Login failed")
        });
    }
  }, [response])

  return { request, promptAsync }
};
