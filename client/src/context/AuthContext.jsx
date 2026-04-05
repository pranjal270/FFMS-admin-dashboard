import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [accessToken, setAccessToken] = useState(null)
    const [isloading, setIsloading] = useState(true)

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken , isloading, setIsloading}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider")
    }
    return context;

}