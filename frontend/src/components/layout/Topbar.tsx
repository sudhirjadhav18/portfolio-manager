import React from "react";
import { useAuth } from "../../modules/auth/useAuth";

export default function Topbar() {
  const { user, logout } = useAuth();
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-2">
        <button className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-100" aria-label="Open sidebar">
          ☰
        </button>
        <span className="text-sm text-gray-500">Welcome back</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-800">{user?.name}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>
        <button onClick={logout} className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md">Logout</button>
      </div>
    </header>
  );
}


