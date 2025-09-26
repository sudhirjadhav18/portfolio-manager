import React, { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../modules/auth/useAuth";

export default function AccountSettings() {
  const { user, refreshUser } = useAuth();
  const [email, setEmail] = useState<string>(user?.email ?? "");
  const [name, setName] = useState<string>(user?.name ?? "");
  const [password, setPassword] = useState<string>("");
  const [busy, setBusy] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSave = async () => {
    setBusy(true);
    setMessage(null);
    try {
      await api.put("/api/auth/me", { email, name, password: password || undefined });
      await refreshUser();
      setPassword("");
      setMessage("Saved successfully.");
    } catch (e: unknown) {
      let msg = "Failed to save";
      if (e && typeof e === "object" && "response" in e) {
        const resp = (e as any).response;
        if (resp && resp.data && typeof resp.data === "object" && "message" in resp.data) {
          msg = String((resp.data as any).message);
        }
      }
      setMessage(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Account Settings</h1>
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 max-w-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input value={user?.username ?? ""} disabled className="w-full rounded-md border border-gray-300 bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-gray-300 focus:border-primary-500 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border border-gray-300 focus:border-primary-500 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-gray-400">(leave blank to keep)</span></label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-md border border-gray-300 focus:border-primary-500 focus:ring-primary-500" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onSave} disabled={busy} className="px-3 py-2 rounded bg-primary-600 text-white">{busy ? "Saving..." : "Save"}</button>
          {message && <span className="text-sm text-gray-600">{message}</span>}
        </div>
      </div>
    </div>
  );
}


