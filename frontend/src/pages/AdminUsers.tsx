import React from "react";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminUsers() {
  const [users, setUsers] = useState<Array<{ id: string; email: string; name: string; role: string | null; isactive?: boolean }>>([]);
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
        setUsers(res.data.users ?? []);
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

function UserTable({ rows, inactive = false }: { rows: Array<{ id: string; email: string; name: string; role: string | null }>; inactive?: boolean }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((u) => (
            <tr key={u.id} className={inactive ? "opacity-50" : undefined}>
              <td className="px-4 py-2 whitespace-nowrap">{u.name}</td>
              <td className="px-4 py-2 whitespace-nowrap">{u.email}</td>
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
              <td className="px-4 py-6 text-center text-gray-500" colSpan={3}>No users found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}


