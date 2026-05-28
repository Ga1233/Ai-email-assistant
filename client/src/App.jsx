import { useState } from "react";
import Home from "./pages/Home";
import History from "./pages/History";

function App() {
  const [page, setPage] = useState("home");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Navbar */}
      <nav className="bg-slate-900/80 backdrop-blur border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">AI</div>
            <span className="text-white font-semibold text-lg">Email Assistant</span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setPage("home")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                page === "home"
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              Generate
            </button>
            <button
              onClick={() => setPage("history")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                page === "history"
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              History
            </button>
          </div>
        </div>
      </nav>

      {page === "home" ? (
        <Home onViewHistory={() => setPage("history")} />
      ) : (
        <History onBack={() => setPage("home")} />
      )}
    </div>
  );
}

export default App;
