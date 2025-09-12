import React from "react";

export default function Charts() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Charts</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {["Daily Value", "Drawdown", "NAV"].map((name) => (
          <div key={name} className="bg-white rounded-lg shadow p-4">
            <p className="font-medium">{name}</p>
            <div className="h-40 bg-gray-100 rounded mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}


