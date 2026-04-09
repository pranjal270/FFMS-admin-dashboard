import React, { useState , useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from "../api/axios"

const Dashboard = () => {
  const navigate = useNavigate()
  const { user , logoutUser, isloading , accessToken } = useAuth()

  const [activePanel, setActivePanel] = useState("flags")
  const [recoveryCodes, setRecoveryCodes] = useState([])
  const [isGeneratingCodes, setIsGeneratingCodes] = useState(false)
  const [recoveryError, setRecoveryError] = useState("")


  const [flags, setFlags]  = useState([])
  const [flagsLoading, setFlagsLoading] = useState(false)
  const [flagsError, setFlagsError] = useState("")

  const [showCreateCard, setShowCreateCard] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)

  const [createForm, setCreateForm] = useState({
    flagKey : "",
    name : "",
    description:"",
    rolloutPercentage : ""
  })

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout")
    } catch (err) {
      console.error("Logout error", err)
    } finally {
      logoutUser()
      navigate("/login")
    }
  }

  const fetchFlags = async () => {
    try {
      setFlagsLoading(true)
      setFlagsError("")

      const res = await api.get('/flagit/flags')
      console.log(res)
      setFlags(res.data.flags || [])

    } catch (error) {
      console.error("Fetch flags error", err);
      setFlagsError(err.response?.data?.message || "Failed to fetch flags");
    } finally {
      setFlagsLoading(false)
    }
  }   
  


  useEffect(() => {
    fetchFlags();
    // if (!isloading && accessToken && activePanel === "flags") {
    //   fetchFlags();
    // }
  }, [activePanel, accessToken, isloading]);
  
  

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

  const handleCreateFlag = async () => {
    try {
      setCreateLoading(true)
      setFlagsError("")

      const res =  await api.post("/flagit/flags/create", {
        flagKey: createForm.flagKey,
        name: createForm.name,
        description: createForm.description,
        rolloutPercentage: Number(createForm.rolloutPercentage)

      })


      setCreateForm({
        flagKey: "",
        name: "",
        description: "",
        rolloutPercentage: "",
      });

      setShowCreateCard(false);
      await fetchFlags();

      // Naya flag create hote hi uski detail page pe bhej do
      if (res.data?.flag?._id) {
        navigate(`/dashboard/flags/${res.data.flag._id}`);
      }

    } catch (err) {
      setFlagsError(err.response?.data?.message || "Failed to create flag");
    } finally {
      setCreateLoading(false);
    }
  }


return (
    <section className="min-h-screen bg-[#05050d] text-white lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="flex flex-col border-b border-white/10 bg-white/5 p-4 backdrop-blur-2xl lg:min-h-screen lg:border-b-0 lg:border-r">
        <div className="mb-8 flex items-center gap-3.5">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 font-extrabold shadow-[0_0_28px_rgba(124,58,237,0.38)]">
            F
          </div>
          <div>
            <strong className="block text-base tracking-[-0.02em]">FlagIt</strong>
            <span className="block text-xs text-white/55">Admin Console</span>
          </div>
        </div>

        <nav className="grid gap-2">
          <button
            type="button"
            onClick={() => setActivePanel("flags")}
            className={`rounded-2xl px-4 py-3 text-left transition ${
              activePanel === "flags"? "border border-violet-500/35 bg-violet-500/20 text-white"
                : "text-white/60 hover:bg-white/5 hover:text-white"}`}
          >
            Feature Flags
          </button>

          <button
            type="button"
            onClick={() => setActivePanel("recovery")}
            className={`rounded-2xl px-4 py-3 text-left transition ${activePanel === "recovery"
                ? "border border-violet-500/35 bg-violet-500/20 text-white"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            Recovery Codes
          </button>

          <button
            type="button"
            onClick={() => setActivePanel("overview")}
            className={`rounded-2xl px-4 py-3 text-left transition 
              ${activePanel === "overview"? "border border-violet-500/35 bg-violet-500/20 text-white"
                : "text-white/60 hover:bg-white/5 hover:text-white"}`}
          >
            Overview
          </button>
        </nav>

        <div className="mt-auto grid gap-4 pt-8">
          <div className="rounded-2xl bg-white/5 p-4">
            <strong>{user?.email}</strong>
            <span className="mt-1 block text-xs text-white/55">
              Tenant: {user?.tenantId}
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
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-violet-200/85">
                Admin workspace
              </p>
              <h1 className="mt-1 text-xl font-semibold tracking-[-0.02em]">
                Workspace: {user?.tenantId}
              </h1>
              <p className="mt-2 text-white/60">
                All feature flags of {user?.tenantId}
              </p>
            </div>

            {activePanel === "flags" && (
              <button
                type="button"
                onClick={() => setShowCreateCard((prev) => !prev)}
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 px-5 py-3 font-semibold text-white shadow-[0_0_28px_rgba(124,58,237,0.38)] transition hover:-translate-y-0.5"
              >
                {showCreateCard ? "Close" : "Add Flag"}
              </button>
            )}
          </div>
        </header>

        {activePanel === "overview" && (
          <section className="mt-5 grid gap-4">
            <article className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
              <p className="text-xs uppercase tracking-[0.18em] text-violet-200/85">
                Session
              </p>
              <h2 className="mt-2 text-xl font-bold tracking-[-0.03em]">
                You are managing project: {user?.tenantId}
              </h2>
              <p className="mt-2 text-white/60">
                All dashboard operations are automatically scoped to {user?.tenantId}.
              </p>
            </article>

            <article className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
              <p className="text-xs uppercase tracking-[0.18em] text-violet-200/85">
                Flow
              </p>
              <h3 className="mt-2 text-lg font-semibold tracking-[-0.03em]">
                How this dashboard works
              </h3>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                  <strong className="text-base">1. Login</strong>
                  <span className="mt-1 block text-sm text-white/55">
                    Admin logs in and can handle {user?.tenantId} feature flags.
                  </span>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                  <strong className="text-base">2. Manage Flags</strong>
                  <span className="mt-1 block text-sm text-white/55">
                    Only {user?.tenantId} flags are listed here.
                  </span>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                  <strong className="text-base">3. Open Detail</strong>
                  <span className="mt-1 block text-sm text-white/55">
                    Click any flag to open dedicated edit page.
                  </span>
                </div>
              </div>
            </article>
          </section>
        )}

        {activePanel === "flags" && (
          <section className="mt-5 rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
            {showCreateCard && (
              <div className="mb-6 grid gap-4 rounded-[24px] border border-violet-500/20 bg-white/[0.04] p-5">
                <h3 className="text-lg font-semibold">Create New Flag</h3>

                <input
                  value={createForm.flagKey}
                  onChange={(e) =>
                    setCreateForm((prev) => ({ ...prev, flagKey: e.target.value }))
                  }
                  placeholder="flag_key"
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none"
                />

                <input
                  value={createForm.name}
                  onChange={(e) =>
                    setCreateForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Feature name"
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none"
                />

                <input
                  value={createForm.description}
                  onChange={(e) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Description"
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none"
                />

                <input
                  type="number"
                  value={createForm.rolloutPercentage}
                  onChange={(e) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      rolloutPercentage: e.target.value,
                    }))
                  }
                  placeholder="Rollout percentage"
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none"
                />

                <button
                  type="button"
                  onClick={handleCreateFlag}
                  disabled={createLoading}
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 px-5 py-3 font-semibold text-white shadow-[0_0_28px_rgba(124,58,237,0.38)] transition hover:-translate-y-0.5 disabled:opacity-70"
                >
                  {createLoading ? "Creating..." : "Create Flag"}
                </button>
              </div>
            )}

            {flagsError && (
              <p className="mb-4 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {flagsError}
              </p>
            )}

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-violet-200/85">
                  Feature workspace
                </p>
                <h2 className="mt-2 text-xl font-bold tracking-[-0.03em]">
                  {user?.tenantId} Flags
                </h2>
              </div>
            </div>

            {flagsLoading ? (
              <div className="mt-5 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-6">
                <p className="text-sm text-white/60">Loading flags...</p>
              </div>
            ) : flags.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-6">
                <h3 className="text-lg font-semibold">No feature flags added yet</h3>
                <p className="mt-1 text-sm text-white/60">
                  Your tenant flag management will appear here.
                </p>
              </div>
            ) : (
              <div className="mt-5 grid gap-4">
                {flags.map((flag) => (
                <div
                    key={flag._id}
                    className="flex items-center justify-between rounded-[24px] border border-white/10 bg-white/[0.04] p-5 transition hover:border-violet-500/35 hover:bg-white/[0.06]"
                  >
                <button
                  type="button"
                  onClick={() => navigate(`/dashboard/flags/${flag._id}`)}
                  className="flex-1 text-left"
                >
                  <strong className="text-base">{flag.name}</strong>
                  <span className="mt-1 block text-sm text-white/55">
                    {flag.flagKey}
                  </span>
                  <span className="mt-1 block text-xs text-white/40">
                    Rollout: {flag.rolloutPercentage}% | Status:{" "}
                    {flag.isEnabled ? "Enabled" : "Disabled"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={async (e) => {
                    e.stopPropagation();

                    try {
                        setFlagsError("");
                        const res = await api.patch(`/flagit/flags/${flag._id}/toggle`);

                        setFlags((prev) =>
                          prev.map((item) => (item._id === flag._id ? res.data.flag : item))
                        );
                      } catch (err) {
                        setFlagsError(err.response?.data?.message || "Failed to toggle flag");
                      }
                    }}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      flag.isEnabled
                        ? "border border-emerald-400/20 bg-emerald-500/20 text-emerald-300"
                        : "border border-white/10 bg-white/10 text-white/70"
                    }`}
                  >
                    {flag.isEnabled ? "ON" : "OFF"}
                  </button>


                  <button
                    type="button"
                    onClick={() => navigate(`/dashboard/flags/${flag._id}`)}
                    className="rounded-full border border-violet-500/30 bg-violet-500/15 px-4 py-2 text-sm text-violet-100"
                  >
                    Open
                  </button>
                </div>

              ))}
            </div>

            )}
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
  );
}


export default Dashboard;
