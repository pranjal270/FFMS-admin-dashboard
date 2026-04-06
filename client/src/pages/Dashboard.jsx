import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from "../api/axios"

const Dashboard = () => {
  const navigate = useNavigate()
  const { setAccessToken } = useAuth()

  const [activePanel, setActivePanel] = useState("overview")
  const [recoveryCodes, setRecoveryCodes] = useState([])
  const [recoveryError, setRecoveryError] = useState("")
  const [isGeneratingCodes, setIsGeneratingCodes] = useState(false)
  const [showAppsMenu, setShowAppsMenu] = useState(false)
  const [selectedApp, setSelectedApp] = useState("Zayka")


  const handleLogout = async () => {
    try {
      await api.post("/auth/logout")
    } catch (err) {
      console.error("Logout error", err)
    } finally {
      setAccessToken(null)
      navigate("/login")
    }
  }

  const handleGenerateCodes = async () => {
    setIsGeneratingCodes(true)
    setRecoveryError("")

    try {
      const res = await api.get("/auth/generate-recovery-codes")
      setRecoveryCodes(res.data.recoveryCodes || [])
    } catch (err) {
      setRecoveryError(err.response?.data?.message || "Server error")
    } finally {
      setIsGeneratingCodes(false)
    }
  }

  return (
    <section className="min-h-screen bg-[#05050d] text-white lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="flex flex-col border-b border-white/10 bg-white/5 p-4 backdrop-blur-2xl lg:min-h-screen lg:border-b-0 lg:border-r">
        <div className="mb-8 flex items-center gap-3.5">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 font-extrabold shadow-[0_0_28px_rgba(124,58,237,0.38)]">
            
          </div>
          <div>
            <strong className="block text-base tracking-[-0.02em]">FlagIt</strong>
            <span className="block text-xs text-white/55">Admin Console</span>
          </div>
        </div>

        <nav className="grid gap-2">
          <button
            type="button"
            onClick={() => setActivePanel("overview")}
            className={`rounded-2xl px-4 py-3 text-left transition ${
              activePanel === "overview"
                ? "border border-violet-500/35 bg-violet-500/20 text-white"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            Overview
          </button>

          <button
            type="button"
            onClick={() => setActivePanel("flags")}
            className={`rounded-2xl px-4 py-3 text-left transition ${
              activePanel === "flags"
                ? "border border-violet-500/35 bg-violet-500/20 text-white"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            Zayka Flags
          </button>

          <button
            type="button"
            onClick={() => setActivePanel("recovery")}
            className={`rounded-2xl px-4 py-3 text-left transition ${
              activePanel === "recovery"
                ? "border border-violet-500/35 bg-violet-500/20 text-white"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            Recovery Codes
          </button>
        </nav>

        <div className="mt-auto grid gap-4 pt-8">
          <div className="rounded-2xl bg-white/5 p-4">
            <strong>admin@example.com</strong>
            <span className="mt-1 block text-xs text-white/55">
              Authenticated administrator
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-2xl bg-red-500/10 px-4 py-3 text-left text-red-300 transition hover:-translate-y-0.5"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="p-4 md:p-7">
        <header className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-2xl">
          <div className="flex items-center gap-4">
            <button
              type="button"
               onClick={() => setShowAppsMenu((prev) => !prev)}
              className="grid h-11 w-11 place-items-center gap-[3px] rounded-2xl bg-white/5"
            >
              <span className="h-0.5 w-4 rounded-full bg-white" />
              <span className="h-0.5 w-4 rounded-full bg-white" />
              <span className="h-0.5 w-4 rounded-full bg-white" />
            </button>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-violet-200/85">
                Admin workspace
              </p>
              <h1 className="mt-1 text-xl font-semibold tracking-[-0.02em]">
                 Workspace: {selectedApp}
              </h1>
              {showAppsMenu && (
  <div className="mt-4 grid w-full max-w-[420px] gap-3 rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur-2xl">
    {["Zayka", "Shopping", "Payments", "Offers"].map((app) => (
      <button
        key={app}
        type="button"
        onClick={() => {
          setSelectedApp(app)
          setShowAppsMenu(false)
        }}
        className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left text-white hover:bg-white/[0.08]"
      >
        <strong className="text-sm font-semibold">{app}</strong>
        <span className="mt-1 block text-xs text-white/55">
          {app === "Zayka"
            ? "Manage flags, rollout rules & experiments"
            : "Feature flag support coming soon"}
        </span>
      </button>
    ))}
  </div>
)}

              <p className="mt-2 text-white/60">Feature flags active here</p>
            </div>
          </div>
        </header>

        {activePanel === "overview" && (
          <section className="mt-5 grid gap-4">
            <article className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
              <p className="text-xs uppercase tracking-[0.18em] text-violet-200/85">
                Session
              </p>
              <h2 className="mt-2 text-xl font-bold tracking-[-0.03em]">
                 You are managing: {selectedApp}
              </h2>
                  <p className="mt-2 text-white/60">
      All changes will affect this environment
    </p>
            </article>

            <article className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
              <p className="text-xs uppercase tracking-[0.18em] text-violet-200/85">
                Applications
              </p>
              <h3 className="mt-2 text-lg font-semibold tracking-[-0.03em]">
                 Select an application
              </h3>
              <p className="mt-2 text-white/60">
  Manage feature flags per application
</p>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <button className="rounded-3xl border border-violet-500/35 bg-violet-500/20 p-4 text-left text-white">
                  <strong className="text-base">Zayka</strong>
                  <span className="mt-1 block text-sm text-white/55">
                    Feature flags active here
                  </span>
                </button>

                <button className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 text-left text-white">
                  <strong className="text-base">Shopping</strong>
                  <span className="mt-1 block text-sm text-white/55">
                    Coming soon
                  </span>
                </button>

                <button className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 text-left text-white">
                  <strong className="text-base">Payments</strong>
                  <span className="mt-1 block text-sm text-white/55">
                    Coming soon
                  </span>
                </button>

                <button className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 text-left text-white">
                  <strong className="text-base">Offers</strong>
                  <span className="mt-1 block text-sm text-white/55">
                    Coming soon
                  </span>
                </button>
              </div>
            </article>
          </section>
        )}

        {activePanel === "flags" && (
          <section className="mt-5 rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-violet-200/85">
                  Feature workspace
                </p>
                <h2 className="mt-2 text-xl font-bold tracking-[-0.03em]">
                  Zayka Flags
                </h2>
              </div>

              <button
                type="button"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 px-5 py-3 font-semibold text-white shadow-[0_0_28px_rgba(124,58,237,0.38)] transition hover:-translate-y-0.5"
              >
                Add Flag
              </button>
            </div>

            <div className="mt-5 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-6">
              <h3 className="text-lg font-semibold">No feature flags added yet</h3>
              <p className="mt-1 text-sm text-white/60">
                Zayka flag management will appear here.
              </p>
            </div>
          </section>
        )}

        {activePanel === "recovery" && (
          <section className="mt-5 rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-violet-200/85">
                  Security backup
                </p>
                <h2 className="mt-2 text-lg font-semibold tracking-[-0.02em]">
                  Recovery Codes
                </h2>
              </div>

              <button
                type="button"
                onClick={handleGenerateCodes}
                disabled={isGeneratingCodes}
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 px-5 py-3 font-semibold text-white shadow-[0_0_28px_rgba(124,58,237,0.38)] transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
              >
                {isGeneratingCodes ? "Generating..." : "Generate codes"}
              </button>
            </div>

            <p className="mt-4 max-w-2xl leading-7 text-white/60">
              Save these codes somewhere safe. They can be used as backup access if
              the admin forgets the password.
            </p>

            {recoveryError && (
              <p className="mt-4 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {recoveryError}
              </p>
            )}

            {recoveryCodes.length > 0 ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {recoveryCodes.map((code) => (
                  <div
                    key={code}
                    className="rounded-2xl border border-violet-500/30 bg-white/5 p-4 text-center text-sm font-bold tracking-[0.16em]"
                  >
                    {code}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-6">
                <h3 className="text-lg font-semibold">No recovery codes generated yet</h3>
                <p className="mt-2 text-sm text-white/60">
                  Generate them once after login and store them outside the system.
                </p>
              </div>
            )}
          </section>
        )}
      </main>
    </section>
  )
}

export default Dashboard
