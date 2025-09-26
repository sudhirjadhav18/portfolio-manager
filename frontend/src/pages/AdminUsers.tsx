import React from "react";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { AdminUserRow } from "../datamodels/AdminUserRow";
import { useAuth } from "../modules/auth/useAuth";

export default function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editing, setEditing] = useState<AdminUserRow | null>(null);
  const [formBusy, setFormBusy] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    api
      .get("/api/auth/users")
      .then((res) => {
        if (!isMounted) return;
        const rows = (res.data.users ?? []).map((u: AdminUserRow) => AdminUserRow.fromApi(u));
        setUsers(rows);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err?.response?.data?.message || "Failed to load users");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Admin - Users</h1>
      <div className="bg-white rounded-lg shadow p-4">
        {user?.role === "Admin" && (
          <div className="mb-4 flex gap-2">
            <button onClick={() => { setEditing(null); setShowForm(true); }} className="px-3 py-2 rounded bg-primary-600 text-white">New User</button>
          </div>
        )}
        {loading && <div>Loading users...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {!loading && !error && (
          <div className="space-y-6">
            {/* Admins */}
            <Section title="Admins">
              <UserTable rows={users.filter(u => u.isactive !== false && u.role === "Admin")} />
            </Section>

            {/* Clients */}
            <Section title="Clients">
              <UserTable rows={users.filter(u => u.isactive !== false && u.role !== "Admin")} />
            </Section>

            {/* Inactive */}
            <Section title="Inactive">
              <UserTable rows={users.filter(u => u.isactive === false)} inactive />
            </Section>
          </div>
        )}
        {showForm && (
          <UserForm
            key={editing?.id || "new"}
            initial={editing ?? undefined}
            busy={formBusy}
            onCancel={() => { if (!formBusy) setShowForm(false); }}
            onSubmit={async (payload) => {
              setFormBusy(true);
              try {
                if (editing) {
                  const res = await api.put(`/api/auth/users/${editing.id}`, payload);
                  if (res.data?.ok) {
                    setUsers(prev => prev.map(u => u.id === editing.id ? AdminUserRow.fromApi(res.data.user) : u));
                    setShowForm(false);
                  }
                } else {
                  const res = await api.post(`/api/auth/users`, payload);
                  if (res.data?.ok) {
                    setUsers(prev => [...prev, AdminUserRow.fromApi(res.data.user)]);
                    setShowForm(false);
                  }
                }
              } catch (e) {
                alert(e?.response?.data?.message || "Failed to save user");
              } finally {
                setFormBusy(false);
              }
            }}
          />
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-medium mb-2">{title}</h2>
      {children}
    </div>
  );
}

function UserTable({ rows, inactive = false }: { rows: AdminUserRow[]; inactive?: boolean }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((u) => (
            <tr key={u.id} className={inactive ? "opacity-50" : undefined}>
              <td className="px-4 py-2 whitespace-nowrap">{u.name}</td>
              <td className="px-4 py-2 whitespace-nowrap">{u.username}</td>
              <td className="px-4 py-2 whitespace-nowrap">{u.email ?? "-"}</td>
              <td className="px-4 py-2 whitespace-nowrap">
                {u.role === "Admin" ? (
                  <span title="Admin" aria-label="Admin" className="inline-flex items-center gap-1 text-amber-600">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M12 2l3 7h7l-5.5 4.1L18 21l-6-4-6 4 1.5-7.9L2 9h7z" />
                    </svg>
                    Admin
                  </span>
                ) : (
                  <span className="text-gray-500">Client</span>
                )}
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td className="px-4 py-6 text-center text-gray-500" colSpan={4}>No users found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function UserForm({ initial, onCancel, onSubmit, busy }: { initial?: AdminUserRow; onCancel: () => void; onSubmit: (payload: { username: string; email: string; name: string; password?: string; roleId?: string; isActive?: boolean }) => Promise<void>; busy: boolean }) {
  const [username, setUsername] = useState<string>(initial?.username ?? "");
  const [email, setEmail] = useState<string>(initial?.email ?? "");
  const [name, setName] = useState<string>(initial?.name ?? "");
  const [password, setPassword] = useState<string>("");
  const [roleId, setRoleId] = useState<string>(initial?.role === "Admin" ? "1" : "2");
  const [isActive, setIsActive] = useState<boolean>(initial?.isactive !== false);

  const isEdit = Boolean(initial);

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold">{isEdit ? "Edit User" : "New User"}</h3>
        <form className="grid grid-cols-1 gap-4" autoComplete="off">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input name="new-username" autoComplete="off" className="w-full rounded-md border border-gray-300 focus:border-primary-500 focus:ring-primary-500" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input name="new-email" autoComplete="off" type="email" className="w-full rounded-md border border-gray-300 focus:border-primary-500 focus:ring-primary-500" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input name="new-name" autoComplete="off" className="w-full rounded-md border border-gray-300 focus:border-primary-500 focus:ring-primary-500" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password {isEdit && <span className="text-gray-400">(leave blank to keep)</span>}</label>
            <input name="new-password" autoComplete="new-password" type="password" className="w-full rounded-md border border-gray-300 focus:border-primary-500 focus:ring-primary-500" value={password} onChange={e => setPassword(e.target.value)} placeholder={isEdit ? "" : undefined} required={!isEdit} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select name="new-role" autoComplete="off" className="w-full rounded-md border border-gray-300 focus:border-primary-500 focus:ring-primary-500" value={roleId} onChange={e => setRoleId(e.target.value)}>
              <option value="1">Admin</option>
              <option value="2">Client</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input id="active" name="new-active" autoComplete="off" type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
            <label htmlFor="active">Active</label>
          </div>
        </form>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} disabled={busy} className="px-3 py-2 rounded border">Cancel</button>
          <button
            onClick={() => onSubmit({ username, email, name, password: password || undefined, roleId, isActive })}
            disabled={busy}
            className="px-3 py-2 rounded bg-primary-600 text-white"
          >{busy ? "Saving..." : "Save"}</button>
        </div>
      </div>
    </div>
  );
}


