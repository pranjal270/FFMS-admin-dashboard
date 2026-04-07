import React from 'react'
import {useNavigate} from 'react-router-dom'

const Home = () => {
   const navigate = useNavigate()
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#05050d] px-4 py-7 text-white sm:px-[5%]">
      <div className="pointer-events-none absolute left-[-8%] top-[6%] h-[32rem] w-[32rem] rounded-full bg-violet-600/20 blur-[72px]" />
      <div className="pointer-events-none absolute bottom-[4%] right-[-8%] h-[32rem] w-[32rem] rounded-full bg-sky-500/20 blur-[72px]" />

      <header className="relative z-10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 font-extrabold shadow-[0_0_28px_rgba(124,58,237,0.38)]">
            
          </div>
          <div>
            <strong className="block text-base tracking-[-0.02em]">FlagIt Admin</strong>
            <span className="block text-xs text-white/55">
              Feature Flag Management System
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 px-5 py-3 font-semibold text-white shadow-[0_0_28px_rgba(124,58,237,0.38)] transition hover:-translate-y-0.5"
        >
          Login
        </button>
      </header>

      <div className="relative z-10 mx-auto mt-[10vh] w-full max-w-[900px] text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-violet-200/85">
          FlagIt
        </p>

        <h1 className="mt-5 font-sans text-[clamp(2.4rem,5vw,4.4rem)] font-bold leading-[1] tracking-[-0.045em]">
          Release with confidence.
          <span className="block italic text-violet-200">
            Control every feature from one place.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-[40rem] text-[15px] leading-7 text-white/65 sm:text-base">
          FlagIt gives your team a clean command center for launches, access
          control, and fast product decisions, without losing visibility across
          your apps.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-xs font-medium text-white/80 sm:text-sm">
            Centralized controls
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-xs font-medium text-white/80 sm:text-sm">
            Secure sign in
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-xs font-medium text-white/80 sm:text-sm">
            Recovery code backup
          </span>
        </div>
      </div>
    </section>
  )
}
export default Home