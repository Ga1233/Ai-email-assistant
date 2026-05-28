import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const TONES = ["Professional", "Friendly", "Formal", "Confident", "Apology", "Follow-up"];

function Home({ onViewHistory }) {
  const [email, setEmail] = useState("");
  const [tone, setTone] = useState("Professional");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const generateReply = async () => {
    if (!email.trim()) {
      setError("Please paste an email to reply to.");
      return;
    }
    setError("");
    setReply("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/api/generate-email`, {
        email,
        tone,
      });
      setReply(res.data.generatedReply);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to generate reply. Make sure the server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyReply = () => {
    if (!reply) return;
    navigator.clipboard.writeText(reply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setEmail("");
    setReply("");
    setError("");
    setCopied(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">
          AI Email Reply Generator
        </h1>
        <p className="text-slate-400 text-lg">
          Paste an email, choose a tone, and get a perfect reply instantly.
        </p>
      </div>

      {/* Card */}
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5">
        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Original Email
          </label>
          <textarea
            className="w-full bg-slate-800/60 border border-white/10 text-white placeholder-slate-500 p-4 rounded-xl h-44 resize-none focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Paste the email you want to reply to here..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Tone Selector */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Reply Tone
          </label>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  tone === t
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-white/10"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={generateReply}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating Reply...
            </>
          ) : (
            "✨ Generate Reply"
          )}
        </button>
      </div>

      {/* Reply Output */}
      {reply && (
        <div className="mt-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-lg">Generated Reply</h2>
            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-lg border border-white/10">
              Tone: {tone}
            </span>
          </div>
          <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
            {reply}
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={copyReply}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                copied
                  ? "bg-green-600 text-white"
                  : "bg-slate-700 hover:bg-slate-600 text-white border border-white/10"
              }`}
            >
              {copied ? "✓ Copied!" : "Copy Reply"}
            </button>
            <button
              onClick={clearAll}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-slate-700 hover:bg-slate-600 text-slate-300 border border-white/10 transition-all"
            >
              Clear All
            </button>
            <button
              onClick={onViewHistory}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/20 transition-all"
            >
              View History
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
