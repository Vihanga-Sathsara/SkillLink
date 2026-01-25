import React from "react"
import "../global.css"
import { Redirect } from "expo-router"

const Index = () => {
  return <Redirect href={"/landing"} />
}

export default Index