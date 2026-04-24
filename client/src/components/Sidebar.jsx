import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ activePanel, setActivePanel }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logoutUser } = useAuth();

  const handleLogout = async () => {
    try {
      const api = (await import("../api/axios")).default;
      await api.post("/auth/logout");
    } catch (_) {
      /* ignore */
    } finally {
      logoutUser();
      navigate("/login");
    }
  };

  const currentActive = location.pathname.includes("/guide") ? "guide" : activePanel;

  const handleNavigation = (panel) => {
    if (panel === "guide") {
      navigate("/guide");
    } else {
      if (location.pathname !== "/dashboard") {
        navigate("/dashboard");
      } else {
        if (setActivePanel) {
          setActivePanel(panel);
        }
      }
    }
  };

  return (
    <aside className="flex flex-col border-b border-white/10 bg-white/5 p-4 backdrop-blur-2xl lg:h-screen lg:overflow-y-auto lg:border-b-0 lg:border-r">
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
          onClick={() => handleNavigation("flags")}
          className={`rounded-2xl px-4 py-3 text-left transition ${
            currentActive === "flags"
              ? "border border-violet-500/35 bg-violet-500/20 text-white"
              : "text-white/60 hover:bg-white/5 hover:text-white"
          }`}
        >
          Feature Flags
        </button>

        <button
          type="button"
          onClick={() => handleNavigation("recovery")}
          className={`rounded-2xl px-4 py-3 text-left transition ${
            currentActive === "recovery"
              ? "border border-violet-500/35 bg-violet-500/20 text-white"
              : "text-white/60 hover:bg-white/5 hover:text-white"
          }`}
        >
          Recovery Codes
        </button>

        <button
          type="button"
          onClick={() => handleNavigation("guide")}
          className={`rounded-2xl px-4 py-3 text-left transition ${
            currentActive === "guide"
              ? "border border-violet-500/35 bg-violet-500/20 text-white"
              : "text-white/60 hover:bg-white/5 hover:text-white"
          }`}
        >
          How to Use
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
  );
};

export default Sidebar;
