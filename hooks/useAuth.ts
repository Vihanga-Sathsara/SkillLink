import { useContext } from "react"
import { AuthContext } from "../components/context/authContext"

export const useAuth = () => {
    const context = useContext(AuthContext)
}