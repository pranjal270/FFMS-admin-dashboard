import api from "./api/axios"
import {useAuth }from "./context/AuthContext"
import useAxiosInterceptor from "../hooks/useAxiosInterceptor"
import React, { useEffect } from 'react'
import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import FlagDetailPage from "./pages/FlagDetailPage"
import ProtectedRoute from "./components/ProtectedRoute"

const App = () => {

  useAxiosInterceptor()
 

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

      <Route
        path="/dashboard/flags/:flagId"
        element={
          <ProtectedRoute>
            <FlagDetailPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App



