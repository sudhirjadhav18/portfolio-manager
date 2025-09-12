import React from "react";

export default function Summary() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Summary</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {["Total Value", "YTD Return", "Max Drawdown", "Sharpe Ratio"].map((kpi) => (
          <div key={kpi} className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">{kpi}</p>
            <p className="text-2xl font-semibold mt-1">—</p>
          </div>
        ))}
      </div>
    </div>
  );
}


