import React from "react";
import { NavLink } from "react-router-dom";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
    isActive ? "bg-primary-600 text-white" : "text-gray-700 hover:bg-gray-100"
  }`;

export default function Sidebar() {
  return (
    <aside className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200">
      <div className="h-16 flex items-center px-4 border-b">
        <span className="text-xl font-semibold text-primary-700">Portfolio Manager</span>
      </div>
      <nav className="p-4 space-y-6">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase px-2 mb-2">Main</p>
          <div className="space-y-1">
            <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
            <NavLink to="/summary" className={navLinkClass}>Summary</NavLink>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase px-2 mb-2">Portfolios</p>
          <div className="space-y-1">
            <NavLink to="/portfolios" className={navLinkClass}>All Portfolios</NavLink>
            <NavLink to="/charts" className={navLinkClass}>Charts</NavLink>
            <NavLink to="/screener" className={navLinkClass}>Screener</NavLink>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase px-2 mb-2">Account</p>
          <div className="space-y-1">
            <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
            <NavLink to="/account-settings" className={navLinkClass}>Account Settings</NavLink>
            <NavLink to="/admin/users" className={navLinkClass}>Admin - Users</NavLink>
          </div>
        </div>
      </nav>
    </aside>
  );
}


