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
  const [uploading, setUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<{ current: number; total: number } | null>(null);
  const [showJsonPopup, setShowJsonPopup] = React.useState(false);
  const [jsonText, setJsonText] = React.useState("");
  const [jsonError, setJsonError] = React.useState("");

  const handleDownloadStocks = () => setShowJsonPopup(true);

  const handleJsonSubmit = async () => {
    setJsonError("");
    setUploading(true);
    setUploadProgress(null);
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed?.data || !Array.isArray(parsed.data)) {
        setJsonError("Invalid JSON: missing data array");
        setUploading(false);
        return;
      }
      const stocks = parsed.data.map((item: any) => ({
        symbol: item.symbol,
        ltp: item.lastPrice,
        priority: item.priority
      })).filter(s => s.symbol && s.ltp !== undefined);
      if (stocks.length === 0) {
        setJsonError("No valid stocks found in JSON");
        setUploading(false);
        return;
      }
      await api.post("/api/screener/upload-stocks", { stocks });
      setUploadProgress({ current: stocks.length, total: stocks.length });
      setShowJsonPopup(false);
      setJsonText("");
      await load();
    } catch (e) {
      setJsonError("Invalid JSON format");
      console.error(e);
    }
    setUploading(false);
    setUploadProgress(null);
  };
  const [rows, setRows] = React.useState<Row[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

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

  const toggleSelected = async (id: string, next: boolean) => {
    const prev = rows;
    setRows((r) => r.map((x) => (x.id === id ? { ...x, isSelected: next } : x)));
    try {
      await api.patch(`/api/screener/${id}/toggle`, { isSelected: next });
      // Do not reload or sort the list
    } catch (e) {
      console.error(e);
      setRows(prev);
    }
  };

  const enriched = React.useMemo(() => {
    return rows.map((r) => {
      const ltp = Number(r.ltp);
      const p6 = Number(r.price_6m);
      const p1 = Number(r.price_1yr);
      const pct6 = computePercent(ltp, p6);
      const pct1 = computePercent(ltp, p1);
      const combined = (pct6 + pct1) / 2;
      return { ...r, pct6, pct1, combined };
    });
  }, [rows]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Screener</h1>
        <div className="flex gap-2">
          <button
            onClick={handleDownloadStocks}
            className="px-3 py-2 rounded bg-green-600 text-white"
          >
            Download Stocks
          </button>
          <button
            onClick={async () => {
              setLoading(true);
              await load();
            }}
            className="px-3 py-2 rounded bg-gray-600 text-white"
            title="Refresh stocks view"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2"><span className="loader border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin"></span>Refreshing...</span>
            ) : (
              "Refresh"
            )}
          </button>
        </div>
      </div>

      {showJsonPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            {uploading && (
              <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-10">
                <div className="mb-2 text-indigo-600 font-semibold">Uploading stocks...</div>
                {uploadProgress && (
                  <div className="mb-2">{`Progress: ${uploadProgress.current} / ${uploadProgress.total}`}</div>
                )}
                <div className="loader border-4 border-indigo-600 border-t-transparent rounded-full w-8 h-8 animate-spin"></div>
              </div>
            )}
            <h2 className="text-lg font-semibold mb-2">Paste JSON Data</h2>
            <div className="mb-2 text-sm text-gray-700">
              <span>Copy JSON from </span>
              <a
                href="https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20LARGEMIDCAP%20250"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Nifty Large MidCap 250
              </a>
              <span> and paste below.</span>
            </div>
            <textarea
              className="w-full h-40 border rounded p-2 mb-2"
              value={jsonText}
              onChange={e => setJsonText(e.target.value)}
              placeholder="Paste JSON here..."
            />
            {jsonError && <div className="text-red-600 mb-2">{jsonError}</div>}
            <div className="flex gap-2 justify-end">
              <button className="px-3 py-2 rounded bg-gray-300" onClick={() => setShowJsonPopup(false)}>Cancel</button>
              <button className="px-3 py-2 rounded bg-green-600 text-white" onClick={handleJsonSubmit}>Submit</button>
            </div>
          </div>
        </div>
      )}

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


