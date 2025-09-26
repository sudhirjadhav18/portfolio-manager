import React from "react";
import api from "../api/axios";

type Row = {
  id: number;
  stockId: number;
  code: string;
  name: string;
  ltp: string;
  price_6m: string;
  price_1yr: string;
  isSelected: boolean;
};

function computePercent(current: number, past: number): number {
  if (!past || !isFinite(past)) return 0;
  return ((current - past) / past) * 100;
}

export default function Screener() {
  const [rows, setRows] = React.useState<Row[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [seeding, setSeeding] = React.useState<boolean>(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<Row[]>("/api/screener");
      setRows(data);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const seed = async () => {
    setSeeding(true);
    try {
      await api.post("/api/screener/seed");
      await load();
    } finally {
      setSeeding(false);
    }
  };

  const toggleSelected = async (id: string, next: boolean) => {
    const prev = rows;
    setRows((r) => r.map((x) => (x.id === id ? { ...x, isSelected: next } : x)));
    try {
      await api.patch(`/api/screener/${id}/toggle`, { isSelected: next });
      await load();
    } catch (e) {
      console.error(e);
      setRows(prev);
    }
  };

  const enriched = React.useMemo(() => {
    return rows
      .map((r) => {
        const ltp = Number(r.ltp);
        const p6 = Number(r.price_6m);
        const p1 = Number(r.price_1yr);
        const pct6 = computePercent(ltp, p6);
        const pct1 = computePercent(ltp, p1);
        const combined = (pct6 + pct1) / 2;
        return { ...r, pct6, pct1, combined };
      })
      .sort((a, b) => {
        if (a.isSelected !== b.isSelected) return a.isSelected ? -1 : 1;
        return b.combined - a.combined;
      });
  }, [rows]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Screener</h1>
        <button
          onClick={seed}
          disabled={seeding}
          className="px-3 py-2 rounded bg-indigo-600 text-white disabled:opacity-50"
          title="Clears tables and inserts 50 dummy stocks"
        >
          {seeding ? "Seeding..." : "Seed 50 Dummy Stocks"}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-2">Stock</th>
              <th className="text-right px-4 py-2">LTP</th>
              <th className="text-right px-4 py-2">6 month Price</th>
              <th className="text-right px-4 py-2">1 year Price</th>
              <th className="text-right px-4 py-2">6 Month %</th>
              <th className="text-right px-4 py-2">1 Year %</th>
              <th className="text-right px-4 py-2">Combined %</th>
              <th className="text-center px-4 py-2">Shortlisted</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-6" colSpan={8}>Loading...</td>
              </tr>
            ) : enriched.length === 0 ? (
              <tr>
                <td className="px-4 py-6" colSpan={8}>No data. Use Seed to generate dummy stocks.</td>
              </tr>
            ) : (
              enriched.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="font-medium">{r.code}</div>
                    <div className="text-gray-500">{r.name}</div>
                  </td>
                  <td className="px-4 py-2 text-right">{Number(r.ltp).toFixed(2)}</td>
                  <td className="px-4 py-2 text-right">{Number(r.price_6m).toFixed(2)}</td>
                  <td className="px-4 py-2 text-right">{Number(r.price_1yr).toFixed(2)}</td>
                  <td className="px-4 py-2 text-right {r.pct6 >= 0 ? 'text-green-600' : 'text-red-600'}">{r.pct6.toFixed(2)}%</td>
                  <td className="px-4 py-2 text-right {r.pct1 >= 0 ? 'text-green-600' : 'text-red-600'}">{r.pct1.toFixed(2)}%</td>
                  <td className="px-4 py-2 text-right font-semibold">{r.combined.toFixed(2)}%</td>
                  <td className="px-4 py-2 text-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={r.isSelected}
                        onChange={(e) => toggleSelected(r.id, e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-300 peer-checked:bg-indigo-600 relative">
                        <div className="absolute top-0.5 left-0.5 h-5 w-5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                      </div>
                    </label>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


