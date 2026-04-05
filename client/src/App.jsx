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
  const { setAccessToken } = useAuth
  const { setIsLoading } = useAuth

  useAxiosInterceptor()

  useEffect(()=> {
    const initAuth = async () => {
      try {
        const res = await api.post("/auth/refresh")
        newAccessToken = res.data.accessToken
        setAccessToken(newAccessToken)
        setIsLoading(false)

      } catch (err) {
        setAccessToken(null)
      }
    }
    initAuth()
  }, [setAccessToken]) //only runs when app reloads not when ACT changes 

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



// import { Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import Signup from "./pages/Signup"

// function App() {
//   return (

//     <Routes>
//       <Route path="/" element={<Dashboard />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/signup" element={<Signup />} />
//     </Routes>
//   );
// }

// export default App;