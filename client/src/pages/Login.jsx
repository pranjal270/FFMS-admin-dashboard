import React, { useState } from 'react'
import {useAuth} from "../context/AuthContext"
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const { setAccessToken } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)

  const handleLogin = async () => {
    try { 
      const res = await api.post("/auth/login", {
        email,
        password
      })

      setAccessToken(res.data.accessToken)

      navigate("/dashboard")
    } catch(err) {
      console.error("Login failed", err)
    }
  }

  return (
    <>
    <h1>Login karlooo</h1>

    <input 
    type='email' 
    value={Email} 
    placeholder='Enter Email' 
    onChange={(e)=> setEmail(e.target.value)} 
    />

    <input 
    type='password' 
    value={password} 
    placeholder='Enter password' 
    onChange={(e)=> setPassword(e.target.value)} 
    />

    <button onClick={handleLogin}>Login</button>
    
    </>
  )
}

export default Login