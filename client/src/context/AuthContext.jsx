import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [accessToken, setAccessToken] = useState(null)
    const [user, setUser] = useState(null); //logged in admin dets 
    const [isloading, setIsloading] = useState(true)

    useEffect(()=> {
    const initAuth = async () => {
      try {
        const res = await api.post("/auth/refresh")
        const newAccessToken = res.data.accessToken
        setAccessToken(newAccessToken)
        setUser(res.data.user)
        setIsloading(false)

      } catch (err) {
        setAccessToken(null)
        setUser(null)
      } finally{
        setIsloading(false)
      }
    }
    initAuth()
    }, []) //only runs when app reloads not when ACT changes //runs on evry mount

    const loginUser = (token , userData) => {
        setAccessToken(token)
        setUser(userData)
    }   

    const logoutUser = () =>{
        setAccessToken(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken , isloading, setIsloading , user, setUser , loginUser,
        logoutUser}}>
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