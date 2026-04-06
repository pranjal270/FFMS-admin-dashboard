import React, { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"

const Login = () => {
  const { setAccessToken } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      })

      setAccessToken(res.data.accessToken)
      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
      console.error("Login failed", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative grid min-h-screen place-items-center overflow-hidden bg-[#05050d] px-4 py-8 text-white">
      <div className="pointer-events-none absolute h-[32rem] w-[32rem] rounded-full bg-violet-600/20 blur-[80px]" />

      <button
        type="button"
        className="absolute left-4 top-6 z-10 text-sm text-white/55 transition hover:text-white sm:left-8"
        onClick={() => navigate("/")}
      >
        Back to home
      </button>

      <div className="relative z-10 w-full max-w-md rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-[0_18px_56px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-violet-200/85">
            Welcome back
          </p>
          <h2 className="mt-2 text-4xl font-bold tracking-[-0.03em]">
            Admin login
          </h2>
          <p className="mt-3 text-white/60">
            Sign in to continue to your dashboard.
          </p>
        </div>

        {error && (
          <p className="mt-4 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm text-white/75">
            Email
            <input
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/15"
              type="email"
              value={email}
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="grid gap-2 text-sm text-white/75">
            Password
            <input
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/15"
              type="password"
              value={password}
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 px-5 py-3 font-semibold text-white shadow-[0_0_28px_rgba(124,58,237,0.38)] transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Login to dashboard"}
          </button>
        </form>

        <p className="mt-4 text-sm leading-7 text-white/60">
          Use your email and password to sign in.
        </p>
      </div>
    </section>
  )
}

export default Login
