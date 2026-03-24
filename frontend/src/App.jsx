import React, { useState, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, UploadCloud, Search, CheckCircle2, AlertCircle,
  BarChart2, Activity, Mail, Calendar, Phone, Database, Link, DollarSign, Tag, Edit3
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';
import { cn } from './lib/utils';
import './index.css';

const API_URL = "http://localhost:8000/api/v1";

// --- Reusable UI Components ---

const Card = ({ children, className }) => (
  <div className={cn("glass-panel rounded-2xl p-6", className)}>
    {children}
  </div>
);

const Button = ({ children, onClick, disabled, variant = "primary", className, type = "button" }) => {
  const baseStyle = "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(120,50,255,0.3)] hover:shadow-[0_0_30px_rgba(120,50,255,0.5)]",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-border hover:bg-secondary text-foreground",
    ghost: "hover:bg-white/5 text-foreground"
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cn(baseStyle, variants[variant], className)}>
      {children}
    </button>
  );
};

// --- Main App Component ---

function App() {
  const [activeTab, setActiveTab] = useState("single");

  return (
    <div className="min-h-screen flex w-full bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/30 backdrop-blur-xl flex flex-col pt-8">
        <div className="px-6 mb-12 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-400 flex items-center justify-center shadow-[0_0_15px_rgba(120,50,255,0.5)]">
            <Activity size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            ParallelText AI
          </h1>
        </div>

        <nav className="flex flex-col gap-2 px-4">
          <TabButton active={activeTab === "single"} onClick={() => setActiveTab("single")} icon={FileText}>
            Single Analysis
          </TabButton>
          <TabButton active={activeTab === "batch"} onClick={() => setActiveTab("batch")} icon={UploadCloud}>
            Batch Analysis
          </TabButton>
          <TabButton active={activeTab === "search"} onClick={() => setActiveTab("search")} icon={Search}>
            Search DB
          </TabButton>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8 lg:p-12 w-full h-full">
          <AnimatePresence mode="wait">
            {activeTab === "single" && <SingleAnalysisView key="single" />}
            {activeTab === "batch" && <BatchAnalysisView key="batch" />}
            {activeTab === "search" && <SearchView key="search" />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// --- Views ---

function SingleAnalysisView() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isEditing, setIsEditing] = useState(true);

  const processText = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const resp = await axios.post(`${API_URL}/process-text?content=${encodeURIComponent(text)}`);
      setResult(resp.data);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to analyze text.");
    } finally {
      setLoading(false);
    }
  };

  // Fake chart data for the sentiment needle visualization
  const score = result?.sentiment_score || 0;
  const chartData = [
    { name: 'Negative', value: -1 },
    { name: 'Neutral', value: 0 },
    { name: 'Positive', value: 1 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Real-time Analysis</h2>
        <p className="text-muted-foreground mt-2 text-lg">Harness parallel processing to mine sentiment and entities instantly.</p>
      </header>

      <Card className="flex flex-col gap-4">
        {isEditing ? (
          <textarea
            className="w-full h-48 bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
            placeholder="Paste or type your text here to begin analysis..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        ) : (
          <RichTextDisplay text={text} entities={result?.detected_patterns} />
        )}
        
        <div className="flex justify-between items-center mt-2">
          {!isEditing ? (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit3 size={18} /> Edit Text
            </Button>
          ) : <div />}
          <Button onClick={processText} disabled={loading || !text || (!isEditing && text)}>
            {loading ? <span className="animate-spin text-xl">⍥</span> : <BarChart2 size={18} />}
            {loading ? "Processing..." : "Run Analysis"}
          </Button>
        </div>
      </Card>

      {result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Sentiment Score Card */}
          <Card className="col-span-1 lg:col-span-2 flex flex-col relative overflow-hidden">
            <h3 className="text-lg font-semibold text-white/90 mb-4 flex items-center gap-2">
              <Activity size={18} className="text-primary" /> Overall Sentiment
            </h3>

            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-6xl font-black tabular-nums tracking-tighter"
                style={{ color: score > 0 ? '#4ade80' : score < 0 ? '#f87171' : '#9ca3af' }}>
                {score > 0 ? '+' : ''}{score.toFixed(2)}
              </div>
              <div className="text-sm text-white/50 mt-2 uppercase tracking-widest font-bold">
                {score > 0.3 ? 'Positive' : score < -0.3 ? 'Negative' : 'Neutral'}
              </div>
            </div>

            <div className="h-24 w-full mt-4 opacity-50 pointer-events-none">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#f87171" stopOpacity={0.8} />
                      <stop offset="50%" stopColor="#9ca3af" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#4ade80" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="none" fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Metadata Card */}
          <Card className="flex flex-col">
            <h3 className="text-lg font-semibold text-white/90 mb-4">Metadata</h3>
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex justify-between items-center">
                <span className="text-white/60">Processed Chunks</span>
                <span className="font-mono text-xl text-primary">{result.chunk_count}</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex justify-between items-center">
                <span className="text-white/60">Entities Found</span>
                <span className="font-mono text-xl text-primary">
                  {Object.values(result.detected_patterns).flat().length}
                </span>
              </div>
            </div>
          </Card>

          {/* Entities Card */}
          <Card className="col-span-1 md:col-span-2 lg:col-span-3">
            <h3 className="text-lg font-semibold text-white/90 mb-6 border-b border-white/10 pb-4">Extracted Entities & Keywords</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <EntityBox title="Keywords" icon={Tag} items={result.detected_patterns.keywords || []} isKeyword />
              <EntityBox title="Emails" icon={Mail} items={result.detected_patterns.email || []} />
              <EntityBox title="Dates" icon={Calendar} items={result.detected_patterns.date || []} />
              <EntityBox title="Phones" icon={Phone} items={result.detected_patterns.phone || []} />
              <EntityBox title="URLs" icon={Link} items={result.detected_patterns.url || []} />
              <EntityBox title="Currency" icon={DollarSign} items={result.detected_patterns.currency || []} />
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}

function EntityBox({ title, icon: Icon, items, isKeyword = false }) {
  return (
    <div className={cn("bg-black/20 rounded-xl p-4 border border-white/5 transition-all hover:bg-white/5", isKeyword && "border-primary/30 shadow-[0_0_15px_rgba(120,50,255,0.1)]")}>
      <div className={cn("flex items-center gap-2 mb-3", isKeyword ? "text-primary font-bold" : "text-white/70")}>
        <Icon size={16} /> <span className="font-medium">{title}</span>
        <span className="ml-auto bg-white/10 px-2 py-0.5 rounded-full text-xs text-white pb-1">{items.length}</span>
      </div>
      {items.length === 0 ? (
        <div className="text-sm text-white/30 italic">No {title.toLowerCase()} found.</div>
      ) : (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="text-sm text-white/90 bg-white/5 px-3 py-1.5 rounded-md font-mono break-all border border-white/5">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function BatchAnalysisView() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const fileInputRef = useRef(null);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setSummary(null);
    setRecords([]);
    setPage(1);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const resp = await axios.post(`${API_URL}/process-csv`, formData);
      const { csv_data, summary, records, filename } = resp.data;

      // Extract top keywords from records for batch view
      let allKeywords = [];
      records.forEach(r => {
        if (r['Top Keywords']) {
          allKeywords.push(...r['Top Keywords'].split(', '));
        }
      });
      // Basic count
      const kwCounts = {};
      allKeywords.forEach(kw => { if(kw) kwCounts[kw] = (kwCounts[kw] || 0) + 1; });
      const topBatchKeywords = Object.entries(kwCounts).sort((a,b)=>b[1]-a[1]).slice(0, 8).map(x=>x[0]);

      setSummary({ ...summary, topKeywords: topBatchKeywords });
      setRecords(records || []);
    } catch (err) {
      console.error(err);
      alert("Failed to process CSV file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Batch Processing</h2>
        <p className="text-muted-foreground mt-2 text-lg">Upload massive dataset CSVs and let the parallel workers handle the load.</p>
      </header>

      <Card className="flex flex-col items-center justify-center p-12 border-dashed border-2 border-white/20 bg-white/[0.02]">
        <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-6">
          <UploadCloud size={40} />
        </div>
        <h3 className="text-xl font-medium mb-2">Drag & Drop your CSV here</h3>
        <p className="text-white/50 mb-8 max-w-md text-center">
          The system will automatically find a text column, distribute rows across cores, and yield a downloadable scored CSV.
        </p>

        <input
          type="file"
          accept=".csv"
          className="hidden"
          ref={fileInputRef}
          onChange={(e) => setFile(e.target.files[0])}
        />

        {file ? (
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/10">
              <CheckCircle2 className="text-green-400" size={18} />
              <span className="text-sm truncate max-w-[200px]">{file.name}</span>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setFile(null)}>Clear</Button>
              <Button onClick={handleUpload} disabled={loading}>
                {loading ? "Processing..." : "Process Dataset"}
              </Button>
            </div>
          </div>
        ) : (
          <Button onClick={() => fileInputRef.current?.click()}>
            Browse Files
          </Button>
        )}
      </Card>

      {summary && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 text-center">
            <h4 className="text-white/60 mb-2 uppercase tracking-wide text-sm font-semibold">Rows Processed</h4>
            <span className="text-5xl font-black text-white">{summary.total_rows}</span>
          </Card>
          <Card className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 text-center">
            <h4 className="text-white/60 mb-2 uppercase tracking-wide text-sm font-semibold">Avg Sentiment</h4>
            <span className={cn("text-5xl font-black", summary.avg_sentiment > 0.2 ? "text-green-400" : summary.avg_sentiment < -0.2 ? "text-red-400" : "text-gray-400")}>
              {summary.avg_sentiment > 0 ? '+' : ''}{summary.avg_sentiment.toFixed(2)}
            </span>
          </Card>
          <Card className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 text-center">
            <h4 className="text-white/60 mb-2 uppercase tracking-wide text-sm font-semibold">Entities Found</h4>
            <span className="text-5xl font-black text-primary drop-shadow-[0_0_10px_rgba(120,50,255,0.8)]">{summary.total_entities}</span>
          </Card>
          {summary.topKeywords && summary.topKeywords.length > 0 && (
            <Card className="col-span-1 md:col-span-3 bg-white/5 border border-white/10 mt-6">
              <h4 className="text-white/60 mb-4 uppercase tracking-wide text-sm font-semibold flex items-center gap-2">
                <Tag size={16} className="text-primary" /> Top Processed Keywords
              </h4>
              <div className="flex flex-wrap gap-3">
                {summary.topKeywords.map(kw => (
                  <span key={kw} className="bg-primary/20 text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-medium border border-primary/30 shadow-[0_0_10px_rgba(120,50,255,0.2)]">
                    {kw}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* Sentiment Distribution Chart */}
          {records.length > 0 && (
            <Card className="col-span-1 md:col-span-3 mt-6 h-64">
              <h4 className="text-white/60 mb-4 uppercase tracking-wide text-sm font-semibold">Sentiment Distribution</h4>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={[
                  { name: 'Positive', count: records.filter(r => r['Sentiment Score'] > 0.1).length, fill: '#4ade80' },
                  { name: 'Neutral', count: records.filter(r => r['Sentiment Score'] >= -0.1 && r['Sentiment Score'] <= 0.1).length, fill: '#9ca3af' },
                  { name: 'Negative', count: records.filter(r => r['Sentiment Score'] < -0.1).length, fill: '#f87171' }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#ffffff50" axisLine={false} tickLine={false} />
                  <YAxis stroke="#ffffff50" axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#ffffff05'}} contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}
        </motion.div>
      )}

      {records.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="overflow-hidden p-0 border border-white/10 bg-black/40 mt-8 relative">
            <div className="p-4 border-b border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center bg-white/5">
              <h3 className="font-semibold text-white/90">Detailed Extracted Results</h3>
              <div className="flex items-center gap-4 text-sm">
                <Button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  variant="outline"
                  className="px-3 py-1 h-auto"
                >
                  Prev
                </Button>
                <span className="text-white/60 font-medium">Page {page} of {Math.ceil(records.length / pageSize)}</span>
                <Button
                  disabled={page >= Math.ceil(records.length / pageSize)}
                  onClick={() => setPage(p => p + 1)}
                  variant="outline"
                  className="px-3 py-1 h-auto"
                >
                  Next
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    {Object.keys(records[0] || {}).map((key) => (
                      <th key={key} className="p-4 font-semibold text-white/80 whitespace-nowrap">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {records.slice((page - 1) * pageSize, page * pageSize).map((row, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      {Object.values(row).map((val, idx) => (
                        <td key={idx} className="p-4 text-white/70 max-w-xs truncate" title={String(val)}>
                          {String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}

function SearchView() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const resp = await axios.get(`${API_URL}/search?q=${encodeURIComponent(query)}`);
      setResults(resp.data);
    } catch (err) {
      console.error(err);
      alert("Failed to search database.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Database Index Search</h2>
        <p className="text-muted-foreground mt-2 text-lg">Quickly retrieve historical records based on content keywords.</p>
      </header>

      <Card>
        <form onSubmit={search} className="flex gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40">
              <Search size={18} />
            </div>
            <input
              type="text"
              className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="Query database records..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading || !query}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </form>
      </Card>

      {results.length > 0 && (
        <Card className="overflow-hidden p-0 border border-white/10 bg-black/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="p-4 font-semibold text-white/80 w-1/2">Content Fragment</th>
                  <th className="p-4 font-semibold text-white/80 text-center">Score</th>
                  <th className="p-4 font-semibold text-white/80">Extracted Patterns</th>
                  <th className="p-4 font-semibold text-white/80 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {results.map((row) => (
                  <tr key={row.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <p className="line-clamp-2 text-sm text-white/70">{row.content}</p>
                    </td>
                    <td className="p-4 text-center">
                      <span className={cn(
                        "inline-flex items-center px-2 py-1 rounded text-xs font-bold",
                        (row.sentiment_score || 0) > 0 ? "bg-green-500/20 text-green-400" :
                          (row.sentiment_score || 0) < 0 ? "bg-red-500/20 text-red-400" : "bg-gray-500/20 text-gray-400"
                      )}>
                        {(row.sentiment_score || 0) > 0 ? '+' : ''}
                        {(row.sentiment_score || 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-white/50">
                      <div className="flex gap-2 flex-wrap">
                        {Object.entries(row.detected_patterns).map(([k, v]) => (
                          v && v.length > 0 && (
                            <span key={k} className="bg-primary/20 text-primary px-2 py-1 rounded">
                              {v.length} {k}s
                            </span>
                          )
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right text-xs text-white/50 whitespace-nowrap">
                      {new Date(row.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {!loading && query && results.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-white/40">
          <Database size={48} className="mb-4 opacity-20" />
          <p>No records found matching your query.</p>
        </div>
      )}
    </motion.div>
  );
}

// --- Helpers ---

function TabButton({ active, icon: Icon, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 relative group text-left",
        active ? "text-white" : "text-white/50 hover:text-white hover:bg-white/5"
      )}
    >
      {active && (
        <motion.div
          layoutId="active-tab"
          className="absolute inset-0 bg-primary/10 rounded-xl"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <Icon size={18} className={cn("relative z-10 transition-colors", active ? "text-primary" : "text-white/40 group-hover:text-white/70")} />
      <span className="relative z-10">{children}</span>
    </button>
  );
}

function RichTextDisplay({ text, entities }) {
  if (!text) return null;

  let terms = [];
  if (entities) {
    Object.entries(entities).forEach(([key, values]) => {
      values.forEach(v => {
        if (v && v.trim().length > 0) {
          terms.push({ text: v, type: key });
        }
      });
    });
  }

  if (terms.length === 0) {
    return <div className="whitespace-pre-wrap text-white/80 p-4 min-h-[12rem] text-lg font-medium">{text}</div>;
  }

  // Deduplicate terms and sort by length descending to prevent partial replacements
  const uniqueTermsMap = new Map();
  terms.forEach(t => uniqueTermsMap.set(t.text.toLowerCase(), t));
  const uniqueTerms = Array.from(uniqueTermsMap.values()).sort((a, b) => b.text.length - a.text.length);

  const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const termRegexStr = uniqueTerms.map(t => escapeRegExp(t.text)).join('|');
  const termRegex = new RegExp(`(${termRegexStr})`, 'gi');

  const fragments = text.split(termRegex);

  return (
    <div className="whitespace-pre-wrap text-white/90 leading-relaxed text-lg font-medium p-6 bg-black/40 rounded-xl border border-white/10 min-h-[12rem] shadow-inner max-h-96 overflow-y-auto w-full">
      {fragments.map((frag, i) => {
        if (!frag) return null;
        const lowerFrag = frag.toLowerCase();
        const term = uniqueTerms.find(t => t.text.toLowerCase() === lowerFrag);
        if (term) {
          let colorClass = "bg-primary/30 text-primary-foreground font-bold px-1.5 py-0.5 rounded";
          if (term.type === 'email') colorClass = "bg-blue-500/30 text-blue-300 font-bold px-1.5 py-0.5 rounded border border-blue-500/30";
          if (term.type === 'date') colorClass = "bg-purple-500/30 text-purple-300 font-bold px-1.5 py-0.5 rounded border border-purple-500/30";
          if (term.type === 'phone') colorClass = "bg-green-500/30 text-green-300 font-bold px-1.5 py-0.5 rounded border border-green-500/30";
          if (term.type === 'url') colorClass = "bg-pink-500/30 text-pink-300 font-bold px-1.5 py-0.5 rounded underline underline-offset-2";
          if (term.type === 'currency') colorClass = "bg-yellow-500/30 text-yellow-300 font-bold px-1.5 py-0.5 rounded border border-yellow-500/30";
          if (term.type === 'keywords') colorClass = "underline decoration-primary decoration-2 underline-offset-4 font-bold text-white bg-primary/20 px-1 rounded";

          return (
            <span key={i} className={cn("transition-colors hover:brightness-125 cursor-default", colorClass)} title={term.type.toUpperCase()}>
              {frag}
            </span>
          );
        }
        return <span key={i}>{frag}</span>;
      })}
    </div>
  );
}

export default App;
