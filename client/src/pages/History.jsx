import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function History({ onBack }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/history`);
      setHistory(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/history/${id}`);
      setHistory((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete item.");
    }
  };

  const clearAll = async () => {
    if (!confirm("Clear all history? This cannot be undone.")) return;
    try {
      await axios.delete(`${API_URL}/api/history`);
      setHistory([]);
    } catch (error) {
      console.error(error);
      alert("Failed to clear history.");
    }
  };

  const copyText = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Email History</h1>
          <p className="text-slate-400 text-sm">
            {history.length} {history.length === 1 ? "reply" : "replies"} generated this session
          </p>
        </div>
        <div className="flex gap-3">
          {history.length > 0 && (
            <button
              onClick={clearAll}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all"
            >
              Clear All
            </button>
          )}
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition-all"
          >
            ← Generate New
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center gap-2 text-slate-400">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading history...
          </div>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
          <div className="text-5xl mb-4">📭</div>
          <h2 className="text-white font-semibold text-xl mb-2">No history yet</h2>
          <p className="text-slate-400 mb-6">Generate your first email reply to see it here.</p>
          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all"
          >
            Generate a Reply
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {history.map((item) => (
            <div
              key={item._id}
              className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 shadow-xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="bg-blue-600/20 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-lg text-xs font-medium">
                  {item.tone}
                </span>
                <span className="text-slate-500 text-xs">
                  {new Date(item.createdAt).toLocaleString()}
                </span>
              </div>

              {/* Original Email */}
              <div className="mb-4">
                <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Original Email
                </h3>
                <div className="bg-slate-800/60 border border-white/5 rounded-xl p-3 text-slate-300 text-sm leading-relaxed max-h-32 overflow-y-auto">
                  {item.originalEmail}
                </div>
              </div>

              {/* Generated Reply */}
              <div className="mb-4">
                <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Generated Reply
                </h3>
                <div className="bg-emerald-900/20 border border-emerald-500/10 rounded-xl p-3 text-slate-200 text-sm leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap">
                  {item.generatedReply}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => copyText(item._id, item.generatedReply)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    copiedId === item._id
                      ? "bg-green-600 text-white"
                      : "bg-slate-700 hover:bg-slate-600 text-white border border-white/10"
                  }`}
                >
                  {copiedId === item._id ? "✓ Copied!" : "Copy Reply"}
                </button>
                <button
                  onClick={() => deleteItem(item._id)}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;
