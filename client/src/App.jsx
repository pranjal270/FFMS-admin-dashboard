import api from "./api/axios"
import {useAuth }from "./context/AuthContext"
import useAxiosInterceptor from "../hooks/useAxiosInterceptor"
import React, { useEffect } from 'react'
import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import ProtectedRoute from "./components/ProtectedRoute"

const App = () => {
  const { setAccessToken,setIsloading } = useAuth()

  useAxiosInterceptor()

  useEffect(()=> {
    const initAuth = async () => {
      try {
        const res = await api.post("/auth/refresh")
        const newAccessToken = res.data.accessToken
        setAccessToken(newAccessToken)
        setIsloading(false)

      } catch (err) {
        setAccessToken(null)
      }finally{
        setIsloading(false)
      }
    }
    initAuth()
  }, [setAccessToken,setIsloading]) //only runs when app reloads not when ACT changes 

  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App



