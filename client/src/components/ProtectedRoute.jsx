import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({children}) => {
    const {accessToken, isLoading } = useAuth

    if (isLoading) {
        return <div>Loading ....</div>
    }
    
    if (!accessToken) {
        return <Navigate to="/Login" replace /> //send user to login page
    }

    return children //render actual page
}

export default ProtectedRoute