import React, { useState } from "react"
import "../global.css"
import { Href, Redirect } from "expo-router"
import { useEffect } from "react"
import { isFirstLaunch } from "../service/launchService"
import { useAuth } from "@/hooks/useAuth"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/service/firebase"

const Index = () => {
  const [page , setPage] = useState<Href | null>(null)
  const { user , loading} = useAuth()
    

  useEffect(() => {
     if (loading) return
    const checkUserRole = async () => {


       const firstLaunch = await isFirstLaunch()
        if (firstLaunch) {
          setPage("/landing")
          return
        }
     
      console.log("Checking user role for:", user?.uid)
    if (!user) {
      setPage("/login")
      return
    }
  
    try {
      console.log("Fetching document for user:", user?.uid)
      const docRef = doc(db, "users", user?.uid!)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const userData = docSnap.data()
        if (userData.role === "freelancer") {
          console.log("Navigating to freelancer dashboard")
          setPage("/freelancerDashboard")

        }
        else if (userData.role === "client") {
          setPage("/clientDashboard")
        }
      } else {
        setPage("/login")
      }
    } catch (error) {
      console.error("Error getting document:", error)
      setPage("/login")
    }
  }
    checkUserRole()
  },[user, loading])


  // useEffect(() => {
  //   const checkLaunch = async () => {
  //     const firstLaunch = await isFirstLaunch()
  //     if (firstLaunch) {
  //        setPage("/landing")
  //     } else {
  //        setPage("/login")
  //     }
         
  //   }
  //   checkLaunch()
  // }, [])
  
  if (page) {
    return <Redirect href={page} />
  }else {
    return null
  }

 

}

export default Index