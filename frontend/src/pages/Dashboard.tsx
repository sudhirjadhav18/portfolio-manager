import React from "react";
import { useAuth } from "../modules/auth/useAuth";

function Dashboard() {
  const { user } = useAuth();

  if (!user) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-gray-600">Welcome, {user.name}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {["Portfolio Value", "Daily P/L", "Win Rate", "Open Positions"].map((kpi) => (
          <div key={kpi} className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">{kpi}</p>
            <p className="text-2xl font-semibold mt-1">—</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="font-medium">Recent Activity</p>
          <div className="h-48 bg-gray-100 rounded mt-2" />
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="font-medium">Holdings</p>
          <div className="h-48 bg-gray-100 rounded mt-2" />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;


