import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ─── ffms.js source that admins will copy into their tenant app ─── */
const FFMS_CODE = `/**
 * FFMS (Feature Flag Management System) Core SDK
 *
 * This file contains the complete logic for fetching, storing,
 * and evaluating feature flags.can be dropped into any client application.
 */

let tenantFlags = [];

/**
 * Fetch all feature flags for a tenant from the FFMS server.
 * @param {string} clientKey – your tenant's unique client key
 */
export const fetchTenantFlags = async (clientKey) => {
  const flagsApiUrl =
    import.meta.env?.VITE_FLAGS_API_URL ||
    import.meta.env?.VITE_API_URL ||
    "http://localhost:5000";

  if (!clientKey) {
    throw new Error("Missing tenant client key");
  }

  const response = await fetch(\`\${flagsApiUrl}/api/flags\`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-client-key": clientKey,
    },
  });

  if (!response.ok) {
    throw new Error(
      \`Failed to fetch tenant flags: \${response.status} \${response.statusText}\`
    );
  }

  const data = await response.json();
  return data;
};

/**
 * Deterministic hashing – maps a string to a 0-99 bucket.
 * Used for percentage-based rollouts.
 */
const getStableBucket = (input) => {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash % 100;
};

/**
 * Evaluate whether a single flag is ON for a given user.
 * Handles the enabled check + rollout percentage logic.
 */
export const isFeatureEnabled = (flag, userId) => {
  if (!flag) return false;

  const enabled = flag.enabled ?? flag.isEnabled ?? false;
  if (!enabled) return false;

  const rollout =
    flag.rolloutPercentage == null ? 100 : Number(flag.rolloutPercentage);

  if (rollout >= 100) return true;
  if (!Number.isFinite(rollout) || rollout <= 0) return false;
  if (!userId) return false;

  const bucketInput = \`\${flag.flagKey}:\${userId}\`;
  const bucket = getStableBucket(bucketInput);

  return bucket < rollout;
};

/**
 * Load flags from the server and cache them in-memory.
 */
export const loadFeatureFlags = async (clientKey) => {
  const data = await fetchTenantFlags(clientKey);
  tenantFlags = Array.isArray(data) ? data : data.flags || [];
  return tenantFlags;
};

export const getAllFeatureFlags = () => {
  return [...tenantFlags];
};

export const getFeatureFlag = (flagKey) => {
  return tenantFlags.find((flag) => flag.flagKey === flagKey) || null;
};

export const checkFeatureFlag = (flagKey, userId) => {
  const flag = getFeatureFlag(flagKey);
  return isFeatureEnabled(flag, userId);
};`;

/* ──────────────── integration steps data ──────────────── */
const STEPS = [
  {
    number: "01",
    title: "Create a services folder",
    description:
      "Inside your frontend project's source directory, create a new folder called \"services\" (or any name you prefer). This folder will house the FFMS SDK file.",
    snippet: `your-app/
├── src/
│   ├── services/      ← create this folder
│   ├── App.js
│   └── ...`,
  },
  {
    number: "02",
    title: "Create the ffms.js file",
    description:
      'Inside the services folder you just created, add a new file named "ffms.js". This will be the single source of truth for all feature-flag logic in your app.',
    snippet: `your-app/
├── src/
│   ├── services/
│   │   └── ffms.js    ← create this file
│   ├── App.js
│   └── ...`,
  },
  {
    number: "03",
    title: "Paste the FFMS SDK code",
    description:
      "Copy the entire code from the code block above and paste it into the ffms.js file you just created. This code is framework-agnostic – it works with React, Vue, Angular or even vanilla JS.",
  },
  {
    number: "04",
    title: "Set your environment variable",
    description:
      "Add the FFMS server URL as an environment variable in your project. The SDK reads VITE_FLAGS_API_URL (or VITE_API_URL) at runtime. Point it to your deployed FFMS backend.",
    snippet: `# .env  (or .env.local)
VITE_FLAGS_API_URL=https://your-ffms-backend.vercel.app
VITE_CLIENT_KEY=your-tenant-client-key`,
  },
  {
    number: "05",
    title: "Load flags on app startup",
    description:
      "Import loadFeatureFlags from your new ffms.js file and call it as early as possible in your app's lifecycle (for example, inside your root component's mount/init hook). Pass your tenant client key so the SDK knows which flags to fetch.",
    snippet: `import { loadFeatureFlags } from "./services/ffms";

// Call this once when your app boots up
await loadFeatureFlags("your-tenant-client-key");`,
  },
  {
    number: "06",
    title: "Check flags before rendering features",
    description:
      "Wherever you want to conditionally show or hide a feature, import isFeatureEnabled (or checkFeatureFlag for a shorthand) and pass the flag object and the current user's ID. The SDK handles the rollout-percentage math for you.",
    snippet: `import { checkFeatureFlag } from "./services/ffms";

const showNewUI = checkFeatureFlag("new_checkout_ui", currentUserId);

if (showNewUI) {
  // render the new checkout experience
} else {
  // render the classic checkout
}`,
  },
  {
    number: "07",
    title: "Keep flags fresh",
    description:
      "For long-running sessions, consider re-fetching flags on a timer (e.g. every 30-60 seconds) so your users pick up changes you make in the admin dashboard without needing a page reload.",
    snippet: `// Poll for flag updates every 30 seconds
setInterval(async () => {
  await loadFeatureFlags("your-tenant-client-key");
}, 30_000);`,
  },
  {
    number: "08",
    title: "You're live! 🚀",
    description:
      "That's everything. Go to the FlagIt Admin Dashboard, create or toggle flags, adjust rollout percentages, and your tenant app will respond accordingly. No redeployment needed.",
  },
];

/* ──────────────────── component ──────────────────── */
const GuidePage = () => {
  const navigate = useNavigate();
  const { user, logoutUser, accessToken } = useAuth();
  const [copied, setCopied] = useState(false);
  const [expandedStep, setExpandedStep] = useState(null);

  const handleLogout = async () => {
    try {
      // best-effort server logout
      const api = (await import("../api/axios")).default;
      await api.post("/auth/logout");
    } catch (_) {
      /* ignore */
    } finally {
      logoutUser();
      navigate("/login");
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(FFMS_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback: select-all so the user can Ctrl+C */
    }
  };

  return (
    <section className="min-h-screen bg-[#05050d] text-white lg:grid lg:grid-cols-[260px_1fr] lg:h-screen lg:overflow-hidden">
      {/* ─── sidebar (same as Dashboard) ─── */}
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
            onClick={() => navigate("/dashboard")}
            className="rounded-2xl px-4 py-3 text-left transition text-white/60 hover:bg-white/5 hover:text-white"
          >
            Feature Flags
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="rounded-2xl px-4 py-3 text-left transition text-white/60 hover:bg-white/5 hover:text-white"
          >
            Recovery Codes
          </button>

          <button
            type="button"
            className="rounded-2xl px-4 py-3 text-left transition border border-violet-500/35 bg-violet-500/20 text-white"
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

      {/* ─── main content ─── */}
      <main className="p-4 md:p-7 lg:h-screen lg:overflow-y-auto">
        {/* header card */}
        <header className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-2xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-violet-200/85">
                Integration guide
              </p>
              <h1 className="mt-1 text-xl font-semibold tracking-[-0.02em]">
                How to Use FlagIt in Your App
              </h1>
              <p className="mt-2 text-white/60">
                Drop-in SDK &amp; step-by-step setup for any frontend
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 font-semibold text-white transition hover:bg-white/[0.08]"
            >
              Back
            </button>
          </div>
        </header>

        {/* ─── SDK code block ─── */}
        <section className="mt-5 rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-violet-200/85">
                Core SDK
              </p>
              <h2 className="mt-2 text-xl font-bold tracking-[-0.03em]">
                ffms.js
              </h2>
              <p className="mt-1 text-sm text-white/55">
                Copy this entire file into your project — works with any tech
                stack.
              </p>
            </div>

            <button
              type="button"
              onClick={copyCode}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 px-5 py-3 font-semibold text-white shadow-[0_0_28px_rgba(124,58,237,0.38)] transition hover:-translate-y-0.5"
            >
              {copied ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                  Copy Code
                </>
              )}
            </button>
          </div>

          {/* scrollable code */}
          <div className="mt-5 max-h-[480px] overflow-auto rounded-2xl border border-white/10 bg-[#0a0a18] p-5">
            <pre className="text-[13px] leading-6 text-emerald-300/90 whitespace-pre">
              <code>{FFMS_CODE}</code>
            </pre>
          </div>
        </section>

        {/* ─── step-by-step guide ─── */}
        <section className="mt-5 rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-violet-200/85">
              Step-by-step
            </p>
            <h2 className="mt-2 text-xl font-bold tracking-[-0.03em]">
              Integration Guide
            </h2>
            <p className="mt-1 text-sm text-white/55">
              Follow these steps to integrate FFMS into any frontend application.
            </p>
          </div>

          <div className="mt-6 grid gap-4">
            {STEPS.map((step, idx) => {
              const isOpen = expandedStep === idx;
              return (
                <div
                  key={step.number}
                  className={`rounded-[24px] border transition-colors ${
                    isOpen
                      ? "border-violet-500/35 bg-white/[0.06]"
                      : "border-white/10 bg-white/[0.04] hover:border-violet-500/20 hover:bg-white/[0.05]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedStep(isOpen ? null : idx)
                    }
                    className="flex w-full items-center gap-4 p-5 text-left"
                  >
                    <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 text-sm font-extrabold shadow-[0_0_28px_rgba(124,58,237,0.38)]">
                      {step.number}
                    </span>
                    <div className="flex-1">
                      <strong className="block text-base">{step.title}</strong>
                    </div>

                    {/* chevron */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 text-white/40 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="border-t border-white/10 px-5 pb-5 pt-4">
                      <p className="leading-7 text-white/70">
                        {step.description}
                      </p>

                      {step.snippet && (
                        <div className="mt-4 overflow-auto rounded-2xl border border-white/10 bg-[#0a0a18] p-4">
                          <pre className="text-[13px] leading-6 text-emerald-300/90 whitespace-pre">
                            <code>{step.snippet}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* bottom tip */}
        <div className="mt-5 rounded-[28px] border border-violet-500/20 bg-violet-500/[0.06] p-5 backdrop-blur-2xl">
          <p className="text-sm leading-6 text-violet-200/85">
            <strong>💡 Tip:</strong> The ffms.js SDK uses only the native{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">
              fetch
            </code>{" "}
            API – no external dependencies required. It works with React, Vue,
            Angular, Next.js or any vanilla JavaScript app.
          </p>
        </div>
      </main>
    </section>
  );
};

export default GuidePage;
