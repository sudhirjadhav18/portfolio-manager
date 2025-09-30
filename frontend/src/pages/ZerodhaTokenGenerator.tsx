import React, { useState } from "react";
import axios from "../api/axios";

export default function ZerodhaTokenGenerator() {
  const [apiKey, setApiKey] = useState("");
  const [requestToken, setRequestToken] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loginUrl = apiKey ? `https://kite.trade/connect/login?api_key=${encodeURIComponent(apiKey)}&v=3` : "";

  const handleGenerate = async () => {
    setError("");
    setAccessToken("");
    setUserId("");
    setLoading(true);
    try {
      const res = await axios.post("/api/zerodha/generate-token", { requestToken });
      setAccessToken(res.data.access_token);
      setUserId(res.data.user_id);
    } catch (e: any) {
      setError(e?.response?.data?.error || "Failed to generate token");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4">Zerodha Access Token Generator</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Zerodha API Key</label>
        <input
          type="text"
          className="w-full border rounded p-2"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          placeholder="Paste your Zerodha API key here"
        />
      </div>
      <a
        href={loginUrl || undefined}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 mb-4 ${!apiKey ? "opacity-50 pointer-events-none" : ""}`}
      >
        Open Zerodha Login to Get Request Token
      </a>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Request Token</label>
        <input
          type="text"
          className="w-full border rounded p-2"
          value={requestToken}
          onChange={e => setRequestToken(e.target.value)}
          placeholder="Paste request token here"
        />
      </div>
      <button
        onClick={handleGenerate}
        disabled={loading || !requestToken}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? "Generating..." : "Generate Access Token"}
      </button>
      {accessToken && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <div><strong>Access Token:</strong> <span className="break-all">{accessToken}</span></div>
          <div><strong>User ID:</strong> {userId}</div>
        </div>
      )}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>
      )}
      <div className="mt-4 text-xs text-gray-500">
        <p>Paste your Zerodha API key above, click the button to open login, then copy the request token from the redirect URL and paste it below.</p>
      </div>
    </div>
  );
}
