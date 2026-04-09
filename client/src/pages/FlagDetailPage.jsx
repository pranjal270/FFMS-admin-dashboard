import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const FlagDetailPage = () => {
  const navigate = useNavigate();
  const { flagId } = useParams();
  const { user , isloading , accessToken } = useAuth();

  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    rolloutPercentage: 100,
  });

  // URL ke flagId ke basis pe current selected flag nikaal rahe hain
  const selectedFlag = useMemo(() => {
    return flags.find((flag) => flag._id === flagId) || null;
  }, [flags, flagId]);

  // Initial load pe loader show hoga
  // later save/toggle pe background refresh ke liye loader skip kar sakte hain
  const fetchFlags = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setMessage("");

      const res = await api.get("/flagit/flags");
      setFlags(res.data.flags || []);
    } catch (err) {
      console.error("Fetch flags error", err);
      setMessage(err.response?.data?.message || "Failed to load flag");
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    if (!isloading && accessToken) {
      fetchFlags(true);
    }
  }, [flagId, accessToken, isloading]);

  // Selected flag milne ke baad form values sync kar do
  useEffect(() => {
    if (selectedFlag) {
      setForm({
        name: selectedFlag.name || "",
        description: selectedFlag.description || "",
        rolloutPercentage: selectedFlag.rolloutPercentage ?? 100,
      });
    }
  }, [selectedFlag]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");

      const res = await api.patch(`/flagit/flags/${flagId}`, {
        name: form.name,
        description: form.description,
        rolloutPercentage: Number(form.rolloutPercentage),
      });

      // Full refetch ke bajay local state update kar rahe hain
      // isse page flashing / reload-jaisa effect avoid hota hai
      setFlags((prev) =>
        prev.map((item) => (item._id === flagId ? res.data.flag : item))
      );

      setMessage("Flag updated successfully");
    } catch (err) {
      console.error("Update flag error", err);
      setMessage(err.response?.data?.message || "Failed to update flag");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async () => {
    try {
      setMessage("");

      const res = await api.patch(`/flagit/flags/${flagId}/toggle`);

      // Toggle response se selected flag ko local state me update kar do
      setFlags((prev) =>
        prev.map((item) => (item._id === flagId ? res.data.flag : item))
      );

      setMessage("Flag toggled successfully");
    } catch (err) {
      console.error("Toggle flag error", err);
      setMessage(err.response?.data?.message || "Failed to toggle flag");
    }
  };

  const handleDelete = async () => {
    try {
      setMessage("");
      await api.delete(`/flagit/flags/${flagId}`);
      navigate("/dashboard");
    } catch (err) {
      console.error("Delete flag error", err);
      setMessage(err.response?.data?.message || "Failed to delete flag");
    }
  };

  if (isloading || loading) {
  return (
    <section className="min-h-screen bg-[#05050d] p-6 text-white">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
        Loading flag details...
      </div>
    </section>
  );
}

if (!selectedFlag) {
  return (
    <section className="min-h-screen bg-[#05050d] p-6 text-white">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
        <h2 className="text-lg font-semibold">Flag not found</h2>
        <p className="mt-2 text-white/60">
          Either this flag does not exist or it does not belong to your tenant.
        </p>
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mt-5 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 px-5 py-3 font-semibold text-white"
        >
          Back to Dashboard
        </button>
      </div>
    </section>
  );
}


  return (
    <section className="min-h-screen bg-[#05050d] p-4 text-white md:p-7">
      <div className="mx-auto max-w-5xl">
        <header className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-2xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-violet-200/85">
                Feature detail
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-[-0.02em]">
                {selectedFlag.name}
              </h1>
              <p className="mt-2 text-white/60">
                Tenant: {user?.tenantId} | Flag Key: {selectedFlag.flagKey}
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

        {message && (
          <p className="mt-5 rounded-2xl bg-white/5 px-4 py-3 text-sm text-violet-200">
            {message}
          </p>
        )}

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
          <section className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
            <p className="text-xs uppercase tracking-[0.18em] text-violet-200/85">
              Edit feature flag
            </p>

            <div className="mt-5 grid gap-4">
              <div>
                <label className="mb-2 block text-sm text-white/70">Feature Name</label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Rollout Percentage
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={form.rolloutPercentage}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      rolloutPercentage: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 px-5 py-3 font-semibold text-white shadow-[0_0_28px_rgba(124,58,237,0.38)] transition hover:-translate-y-0.5 disabled:opacity-70"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </section>

          <aside className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
            <p className="text-xs uppercase tracking-[0.18em] text-violet-200/85">
              Quick actions
            </p>

            <div className="mt-5 grid gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <span className="block text-sm text-white/55">Current Status</span>
                <strong className="mt-1 block text-lg">
                  {selectedFlag.isEnabled ? "Enabled" : "Disabled"}
                </strong>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <span className="block text-sm text-white/55">Current Rollout</span>
                <strong className="mt-1 block text-lg">
                  {selectedFlag.rolloutPercentage}%
                </strong>
              </div>

              <button
                type="button"
                onClick={handleToggle}
                className="rounded-2xl border border-violet-500/30 bg-violet-500/15 px-5 py-3 font-semibold text-violet-100 transition hover:bg-violet-500/20"
              >
                {selectedFlag.isEnabled ? "Turn Off" : "Turn On"}
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3 font-semibold text-red-300 transition hover:bg-red-500/15"
              >
                Delete Flag
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default FlagDetailPage;
