import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({children}) => {
    const {accessToken, isLoading } = useAuth()

    if (isLoading) {
        return <div>Loading ....</div>
    }
    
    if (!accessToken) {
        return <Navigate to="/Login" replace /> 
    }

    return children 
}

export default ProtectedRoute