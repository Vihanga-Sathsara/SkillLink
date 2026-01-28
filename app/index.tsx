import React, { useState } from "react"
import "../global.css"
import { Href, Redirect } from "expo-router"
import { useEffect } from "react"
import { isFirstLaunch } from "../service/launchService"

const Index = () => {
  const [page , setPage] = useState<Href | null>(null)
  useEffect(() => {
    const checkLaunch = async () => {
      const firstLaunch = await isFirstLaunch()
      if (firstLaunch) {
         setPage("/landing")
      } else {
         setPage("/login")
      }
         
    }
    checkLaunch()
  }, [])
  
  if (page) {
    return <Redirect href={page} />
  }else {
    return null
  }


}

export default Index