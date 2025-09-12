import React from "react";

export default function Portfolios() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Portfolios</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {["Folio 1", "Folio 2", "Folio 3"].map((name) => (
          <div key={name} className="bg-white rounded-lg shadow p-4">
            <p className="font-medium">{name}</p>
            <p className="text-sm text-gray-500">Portfolio summary...</p>
          </div>
        ))}
      </div>
    </div>
  );
}


