import {useAuth} from "../src/context/AuthContext"
import { useEffect } from "react"
import api from "../src/api/axios"



let isRefreshing = false
let refreshSubscribers = []

const subscribeTokenRefresh = (callback) => {
    refreshSubscribers.push(callback)
}

const onRefreshed = (newToken) => {
    refreshSubscribers.forEach( (cb) => cb(newToken))
    refreshSubscribers = []
}

const useAxiosInterceptor = () => {
    const { accessToken , setAccessToken } = useAuth()
    
    useEffect(()=> {

        const requestIntercept = api.interceptors.request.use(
            (config) => {
                if (accessToken) {
                    config.headers.Authorization = `Bearer ${accessToken}`
                }
                return config
            },
            (error) => Promise.reject(error) 
        )

        const responseIntercept = api.interceptors.response.use(
            (reponse) => reponse,
             async (error) => {
                originalRequest = error.config

                if (
                        error.response.status === 401 &&
                        !originalRequest._retry
                    ) {
                        originalRequest._retry = true

                        if (isRefreshing) {
                            return new Promise ((resolve)=> {
                                subscribeTokenRefresh((newToken)=> {
                                    originalRequest.headers.Authorization = `Bearer ${newToken}`
                                    resolve(api(originalRequest))
                                })
                            })
                        }
                        try {
                            const res = await api.post("/auth/refresh")

                            const newAccessToken = res.data.accessToken

                            setAccessToken(newAccessToken)
                            onRefreshed(newAccessToken)

                            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

                            return api(originalRequest)
                        } catch (err) {
                            setAccessToken(null)
                            window.location.href = '/login'
                            return Promise.reject(err)
                        } finally {
                            isRefreshing = false
                        }
                    }
             return Promise.reject(error)   
            }
        )
        return () => {
            api.interceptors.request.eject(requestIntercept)
            api.interceptors.response.eject(responseIntercept)

        }
    }, [ accessToken, setAccessToken])

}

export default useAxiosInterceptor

