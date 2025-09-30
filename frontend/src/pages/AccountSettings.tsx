import React from "react";
import { Link } from "react-router-dom";

export default function AccountSettings() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Account Settings</h1>
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div>Manage your account preferences.</div>
        <div>
          <Link to="/zerodha-token" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Generate Zerodha Access Token
          </Link>
        </div>
      </div>
    </div>
  );
}


