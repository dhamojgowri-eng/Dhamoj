import React, { useState, useEffect } from 'react';
import {
  Server,
  Cpu,
  Terminal,
  Copy,
  Check,
  Play,
  RotateCcw,
  FileCode,
  BookOpen,
  Sparkles,
  Radio,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Send,
  Layers,
  MessageSquare,
  Database,
  Code2,
  Activity,
} from 'lucide-react';
import { playChime, playSuccessChime } from '../utils/audio.ts';

interface McpServerTabProps {
  soundEnabled: boolean;
  language: 'EN' | 'HI';
  showToast: (msg: string, type?: 'info' | 'success' | 'amber') => void;
}

export const McpServerTab: React.FC<McpServerTabProps> = ({
  soundEnabled,
  language,
  showToast,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'tools' | 'resources' | 'prompts' | 'sse' | 'config'>('tools');
  const [selectedTool, setSelectedTool] = useState<string>('solve_doubt');
  const [toolArgs, setToolArgs] = useState<Record<string, any>>({
    solve_doubt: { question: 'Evaluate ∫ (0 to π/4) ln(1 + tan x) dx', classLevel: 'Class 12', language: 'EN' },
    search_textbooks: { query: 'Calculus', publisher: 'NCERT', subject: 'Mathematics' },
    get_formula_sheet: { category: 'IIT JEE' },
    generate_mock_test: { paperKey: 'jee_2021' },
    get_exam_schedules: {},
    check_grammar: { sentence: 'Neither the teacher nor the students was present in the examination hall.' },
  });

  const [executingTool, setExecutingTool] = useState<boolean>(false);
  const [toolResult, setToolResult] = useState<any>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // SSE Monitor State
  const [sseConnected, setSseConnected] = useState<boolean>(false);
  const [sseLogs, setSseLogs] = useState<string[]>([]);
  const [sseEventSource, setSseEventSource] = useState<EventSource | null>(null);

  // Resources state
  const [selectedResource, setSelectedResource] = useState<string>('studys://textbooks/catalog');
  const [resourceContent, setResourceContent] = useState<any>(null);
  const [loadingResource, setLoadingResource] = useState<boolean>(false);

  // Prompts state
  const [selectedPrompt, setSelectedPrompt] = useState<string>('solve-math-doubt');
  const [promptArg, setPromptArg] = useState<string>('∫ (0 to π/4) ln(1 + tan x) dx');
  const [promptResult, setPromptResult] = useState<any>(null);
  const [loadingPrompt, setLoadingPrompt] = useState<boolean>(false);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const sseUrl = `${baseUrl}/api/mcp/sse`;
  const rpcUrl = `${baseUrl}/api/mcp`;

  const toolsList = [
    {
      id: 'solve_doubt',
      name: 'solve_doubt',
      desc: 'Solves academic problems with steps, 5-second shortcuts & Hindi explanation',
      params: ['question', 'classLevel', 'language'],
    },
    {
      id: 'search_textbooks',
      name: 'search_textbooks',
      desc: 'Searches NCERT and 10 reference publishers (RD Sharma, Cengage, Narayana, etc.)',
      params: ['query', 'publisher', 'subject'],
    },
    {
      id: 'get_formula_sheet',
      name: 'get_formula_sheet',
      desc: 'Retrieves exam formulas, shortcut equations & memory mnemonics',
      params: ['category'],
    },
    {
      id: 'generate_mock_test',
      name: 'generate_mock_test',
      desc: 'Generates timed practice mock papers with +4/-1 scoring and answer keys',
      params: ['paperKey'],
    },
    {
      id: 'get_exam_schedules',
      name: 'get_exam_schedules',
      desc: 'Returns upcoming CBSE, State Board, JEE & NEET datesheets',
      params: [],
    },
    {
      id: 'check_grammar',
      name: 'check_grammar',
      desc: 'Evaluates English sentences for grammatical accuracy and student tips',
      params: ['sentence'],
    },
  ];

  const resourcesList = [
    { uri: 'studys://textbooks/catalog', name: 'Textbooks Catalog (11 Publishers)' },
    { uri: 'studys://formulas/database', name: 'Formula & Shortcut Collection' },
    { uri: 'studys://exam-schedules', name: 'Exam Schedules & Announcements' },
    { uri: 'studys://apk/specs', name: 'studys v7.10.54 Technical Specification' },
  ];

  const promptsList = [
    { id: 'solve-math-doubt', name: 'solve-math-doubt', desc: 'Detailed step-by-step calculus & algebra breakdown' },
    { id: 'generate-neet-quiz', name: 'generate-neet-quiz', desc: 'Generates high-yield NEET practice MCQs' },
    { id: 'hindi-medium-tutor', name: 'hindi-medium-tutor', desc: 'Bilingual Hindi + English explanation for science/maths' },
  ];

  // Execute MCP Tool via direct JSON-RPC 2.0
  const handleExecuteTool = async () => {
    setExecutingTool(true);
    setToolResult(null);
    playChime(540, 0.05, soundEnabled);

    try {
      const payload = {
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/call',
        params: {
          name: selectedTool,
          arguments: toolArgs[selectedTool] || {},
        },
      };

      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setToolResult(data);
      playSuccessChime(soundEnabled);
      showToast(`Executed MCP Tool "${selectedTool}" successfully!`, 'success');
    } catch (err: any) {
      setToolResult({ error: err.message || 'Execution error' });
      showToast('Error invoking tool.', 'amber');
    } finally {
      setExecutingTool(false);
    }
  };

  // Fetch MCP Resource
  const handleFetchResource = async (uri: string) => {
    setSelectedResource(uri);
    setLoadingResource(true);
    playChime(500, 0.04, soundEnabled);

    try {
      const payload = {
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'resources/read',
        params: { uri },
      };

      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResourceContent(data);
    } catch (err: any) {
      setResourceContent({ error: err.message });
    } finally {
      setLoadingResource(false);
    }
  };

  // Fetch MCP Prompt
  const handleFetchPrompt = async () => {
    setLoadingPrompt(true);
    playChime(520, 0.04, soundEnabled);

    try {
      const argKey = selectedPrompt === 'generate-neet-quiz' ? 'topic' : selectedPrompt === 'hindi-medium-tutor' ? 'concept' : 'problem';
      const payload = {
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'prompts/get',
        params: {
          name: selectedPrompt,
          arguments: { [argKey]: promptArg },
        },
      };

      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setPromptResult(data);
    } catch (err: any) {
      setPromptResult({ error: err.message });
    } finally {
      setLoadingPrompt(false);
    }
  };

  // Connect/Disconnect SSE Stream
  const toggleSseConnection = () => {
    if (sseConnected && sseEventSource) {
      sseEventSource.close();
      setSseEventSource(null);
      setSseConnected(false);
      setSseLogs((prev) => [`[${new Date().toLocaleTimeString()}] SSE Connection Closed.`, ...prev]);
      showToast('Disconnected from SSE stream.', 'info');
      return;
    }

    try {
      const es = new EventSource('/api/mcp/sse');
      setSseEventSource(es);
      setSseConnected(true);
      playChime(640, 0.08, soundEnabled);

      es.onopen = () => {
        setSseLogs((prev) => [
          `[${new Date().toLocaleTimeString()}] ✔ Connected to Model Context Protocol SSE stream at /api/mcp/sse`,
          ...prev,
        ]);
        showToast('Connected to MCP SSE stream!', 'success');
      };

      es.onmessage = (event) => {
        setSseLogs((prev) => [
          `[${new Date().toLocaleTimeString()}] 📥 Message: ${event.data}`,
          ...prev,
        ]);
      };

      es.addEventListener('endpoint', (event: any) => {
        setSseLogs((prev) => [
          `[${new Date().toLocaleTimeString()}] 🔗 Endpoint Event: Client POST endpoint set to ${event.data}`,
          ...prev,
        ]);
      });

      es.onerror = (e) => {
        console.warn('SSE event source error:', e);
        setSseLogs((prev) => [
          `[${new Date().toLocaleTimeString()}] ⚠ SSE Notice / Reconnecting...`,
          ...prev,
        ]);
      };
    } catch (e: any) {
      showToast('Failed to open SSE stream.', 'amber');
    }
  };

  // Clean up SSE on unmount
  useEffect(() => {
    return () => {
      if (sseEventSource) sseEventSource.close();
    };
  }, [sseEventSource]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    playSuccessChime(soundEnabled);
    showToast('Copied to clipboard!', 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const claudeDesktopConfig = JSON.stringify(
    {
      mcpServers: {
        studys: {
          url: sseUrl,
        },
      },
    },
    null,
    2
  );

  const cursorConfig = JSON.stringify(
    {
      mcpServers: {
        studys: {
          url: sseUrl,
        },
      },
    },
    null,
    2
  );

  return (
    <div className="space-y-6">
      {/* Top Banner: MCP Server Identity & Protocol Spec */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-5 text-white flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                MCP Server Active
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-xs font-mono text-indigo-200">
                Protocol: v2024-11-05
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
              <Server className="w-6 h-6 text-indigo-400" />
              <span>Model Context Protocol (MCP) Server</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Native MCP integration for Claude Desktop, Cursor, Windsurf, AI Studio, and custom AI agents.
              Exposes tools, educational resources, syllabus datasets, and prompts over standard SSE and JSON-RPC.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveSubTab('config')}
              className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Code2 className="w-4 h-4" />
              <span>Client Configs</span>
            </button>
            <button
              type="button"
              onClick={() => toggleSseConnection()}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                sseConnected
                  ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Radio className={`w-4 h-4 ${sseConnected ? 'animate-pulse text-white' : ''}`} />
              <span>{sseConnected ? 'SSE Connected' : 'Test SSE Stream'}</span>
            </button>
          </div>
        </div>

        {/* Live Endpoints Pill Bar */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-3 font-mono">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-indigo-400 font-bold">SSE Endpoint:</span>
              <span className="text-slate-100 bg-slate-800 px-2 py-0.5 rounded">/api/mcp/sse</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-indigo-400 font-bold">Messages:</span>
              <span className="text-slate-100 bg-slate-800 px-2 py-0.5 rounded">/api/mcp/messages</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-indigo-400 font-bold">JSON-RPC 2.0:</span>
              <span className="text-slate-100 bg-slate-800 px-2 py-0.5 rounded">/api/mcp</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard(sseUrl, 'sse-url')}
            className="text-[11px] text-indigo-300 hover:text-white flex items-center gap-1 cursor-pointer font-sans font-semibold"
          >
            {copiedKey === 'sse-url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Full SSE URL</span>
          </button>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'tools', label: 'MCP Tools (6)', icon: Cpu },
          { id: 'resources', label: 'MCP Resources (4)', icon: Database },
          { id: 'prompts', label: 'MCP Prompts (3)', icon: MessageSquare },
          { id: 'sse', label: 'Live SSE Stream Monitor', icon: Activity },
          { id: 'config', label: 'Claude & Cursor Setup', icon: Code2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveSubTab(tab.id as any);
                playChime(500, 0.04, soundEnabled);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                active
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: MCP TOOLS PLAYGROUND */}
      {activeSubTab === 'tools' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Tool Selection List */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Available MCP Tools (Callable by AI Agents)
            </h3>
            <div className="space-y-2">
              {toolsList.map((tool) => {
                const isSelected = selectedTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => {
                      setSelectedTool(tool.id);
                      setToolResult(null);
                      playChime(480, 0.04, soundEnabled);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition flex items-start justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-500 shadow-2xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                          {tool.name}
                        </span>
                        <span className="text-[10px] text-indigo-700 font-bold">
                          {tool.params.length} params
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-snug">{tool.desc}</p>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 text-slate-400 shrink-0 mt-1 transition ${
                        isSelected ? 'rotate-90 text-indigo-600' : ''
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Interactive Tool Execution Playground */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  MCP Tool Playground
                </span>
                <h4 className="font-mono text-base font-extrabold text-slate-900">
                  {selectedTool}
                </h4>
              </div>
              <button
                type="button"
                onClick={handleExecuteTool}
                disabled={executingTool}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{executingTool ? 'Executing...' : 'Execute Tool'}</span>
              </button>
            </div>

            {/* Input Arguments Configurator */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 block">
                Tool Input Parameters (JSON-RPC `arguments`):
              </span>

              {selectedTool === 'solve_doubt' && (
                <div className="space-y-2 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      question (string, required):
                    </label>
                    <input
                      type="text"
                      value={toolArgs.solve_doubt.question}
                      onChange={(e) =>
                        setToolArgs((prev) => ({
                          ...prev,
                          solve_doubt: { ...prev.solve_doubt, question: e.target.value },
                        }))
                      }
                      className="w-full text-xs rounded-lg border border-slate-300 p-2 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">classLevel:</label>
                      <input
                        type="text"
                        value={toolArgs.solve_doubt.classLevel}
                        onChange={(e) =>
                          setToolArgs((prev) => ({
                            ...prev,
                            solve_doubt: { ...prev.solve_doubt, classLevel: e.target.value },
                          }))
                        }
                        className="w-full text-xs rounded-lg border border-slate-300 p-2 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">language:</label>
                      <select
                        value={toolArgs.solve_doubt.language}
                        onChange={(e) =>
                          setToolArgs((prev) => ({
                            ...prev,
                            solve_doubt: { ...prev.solve_doubt, language: e.target.value },
                          }))
                        }
                        className="w-full text-xs rounded-lg border border-slate-300 p-2 font-mono"
                      >
                        <option value="EN">EN (Bilingual)</option>
                        <option value="HI">HI (Hindi Medium)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {selectedTool === 'search_textbooks' && (
                <div className="space-y-2 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">query:</label>
                    <input
                      type="text"
                      value={toolArgs.search_textbooks.query}
                      onChange={(e) =>
                        setToolArgs((prev) => ({
                          ...prev,
                          search_textbooks: { ...prev.search_textbooks, query: e.target.value },
                        }))
                      }
                      className="w-full text-xs rounded-lg border border-slate-300 p-2 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">publisher:</label>
                      <input
                        type="text"
                        value={toolArgs.search_textbooks.publisher}
                        onChange={(e) =>
                          setToolArgs((prev) => ({
                            ...prev,
                            search_textbooks: { ...prev.search_textbooks, publisher: e.target.value },
                          }))
                        }
                        className="w-full text-xs rounded-lg border border-slate-300 p-2 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">subject:</label>
                      <input
                        type="text"
                        value={toolArgs.search_textbooks.subject}
                        onChange={(e) =>
                          setToolArgs((prev) => ({
                            ...prev,
                            search_textbooks: { ...prev.search_textbooks, subject: e.target.value },
                          }))
                        }
                        className="w-full text-xs rounded-lg border border-slate-300 p-2 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedTool === 'get_formula_sheet' && (
                <div className="text-xs">
                  <label className="block text-slate-600 font-semibold mb-1">category:</label>
                  <select
                    value={toolArgs.get_formula_sheet.category}
                    onChange={(e) =>
                      setToolArgs((prev) => ({
                        ...prev,
                        get_formula_sheet: { ...prev.get_formula_sheet, category: e.target.value },
                      }))
                    }
                    className="w-full text-xs rounded-lg border border-slate-300 p-2 font-mono"
                  >
                    <option value="ALL">ALL Categories</option>
                    <option value="IIT JEE">IIT JEE</option>
                    <option value="NEET">NEET</option>
                    <option value="Govt Exams">Govt Exams</option>
                  </select>
                </div>
              )}

              {selectedTool === 'generate_mock_test' && (
                <div className="text-xs">
                  <label className="block text-slate-600 font-semibold mb-1">paperKey:</label>
                  <select
                    value={toolArgs.generate_mock_test.paperKey}
                    onChange={(e) =>
                      setToolArgs((prev) => ({
                        ...prev,
                        generate_mock_test: { ...prev.generate_mock_test, paperKey: e.target.value },
                      }))
                    }
                    className="w-full text-xs rounded-lg border border-slate-300 p-2 font-mono"
                  >
                    <option value="jee_2021">jee_2021 (JEE Mains PYQ)</option>
                    <option value="jee_adv">jee_adv (JEE Advanced Objective)</option>
                    <option value="neet_2021">neet_2021 (NEET UG PYQ)</option>
                    <option value="govt_ssc">govt_ssc (SSC CGL / Banking / NDA)</option>
                  </select>
                </div>
              )}

              {selectedTool === 'check_grammar' && (
                <div className="text-xs">
                  <label className="block text-slate-600 font-semibold mb-1">sentence:</label>
                  <input
                    type="text"
                    value={toolArgs.check_grammar.sentence}
                    onChange={(e) =>
                      setToolArgs((prev) => ({
                        ...prev,
                        check_grammar: { ...prev.check_grammar, sentence: e.target.value },
                      }))
                    }
                    className="w-full text-xs rounded-lg border border-slate-300 p-2 font-mono"
                  />
                </div>
              )}

              {selectedTool === 'get_exam_schedules' && (
                <p className="text-xs text-slate-500 italic">No required parameters.</p>
              )}
            </div>

            {/* Live JSON-RPC Response Output */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5 text-indigo-600" />
                  <span>JSON-RPC 2.0 Response (`CallToolResult`):</span>
                </span>
                {toolResult && (
                  <button
                    type="button"
                    onClick={() => copyToClipboard(JSON.stringify(toolResult, null, 2), 'tool-res')}
                    className="text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'tool-res' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>Copy JSON</span>
                  </button>
                )}
              </div>

              <pre className="p-3.5 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-72 custom-scrollbar border border-slate-800">
                {toolResult
                  ? JSON.stringify(toolResult, null, 2)
                  : `// Click "Execute Tool" to invoke ${selectedTool} via JSON-RPC 2.0\n{\n  "jsonrpc": "2.0",\n  "method": "tools/call",\n  "params": {\n    "name": "${selectedTool}",\n    "arguments": ${JSON.stringify(toolArgs[selectedTool] || {}, null, 2)}\n  }\n}`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MCP RESOURCES */}
      {activeSubTab === 'resources' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Registered Resources
            </h3>
            {resourcesList.map((res) => {
              const isSelected = selectedResource === res.uri;
              return (
                <button
                  key={res.uri}
                  type="button"
                  onClick={() => handleFetchResource(res.uri)}
                  className={`w-full text-left p-3 rounded-xl border transition cursor-pointer ${
                    isSelected ? 'bg-indigo-50 border-indigo-500 shadow-2xs' : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <code className="text-xs font-bold text-slate-900 block truncate">{res.uri}</code>
                  <span className="text-[11px] text-slate-500">{res.name}</span>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-mono text-xs font-bold text-indigo-700">
                Resource URI: {selectedResource}
              </span>
              <button
                type="button"
                onClick={() => handleFetchResource(selectedResource)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reload</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 text-indigo-300 font-mono text-[11px] overflow-x-auto max-h-96 custom-scrollbar border border-slate-800">
              {loadingResource
                ? '// Reading resource over MCP protocol...'
                : resourceContent
                ? JSON.stringify(resourceContent, null, 2)
                : '// Click a resource on the left to read its contents via resources/read'}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: MCP PROMPTS */}
      {activeSubTab === 'prompts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Template Prompts
            </h3>
            {promptsList.map((p) => {
              const isSelected = selectedPrompt === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setSelectedPrompt(p.id);
                    setPromptResult(null);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition cursor-pointer ${
                    isSelected ? 'bg-indigo-50 border-indigo-500 shadow-2xs' : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className="font-mono text-xs font-bold text-slate-900 block">{p.name}</span>
                  <span className="text-[11px] text-slate-500 leading-snug">{p.desc}</span>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-mono text-xs font-bold text-indigo-700">
                Prompt: {selectedPrompt}
              </span>
              <button
                type="button"
                onClick={handleFetchPrompt}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>Get Rendered Prompt</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Prompt Argument ({selectedPrompt === 'generate-neet-quiz' ? 'topic' : selectedPrompt === 'hindi-medium-tutor' ? 'concept' : 'problem'}):
              </label>
              <input
                type="text"
                value={promptArg}
                onChange={(e) => setPromptArg(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 p-2 font-mono"
              />
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 text-amber-300 font-mono text-[11px] overflow-x-auto max-h-72 custom-scrollbar border border-slate-800">
              {loadingPrompt
                ? '// Rendering prompt template...'
                : promptResult
                ? JSON.stringify(promptResult, null, 2)
                : '// Click "Get Rendered Prompt" to view populated messages array'}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: LIVE SSE MONITOR */}
      {activeSubTab === 'sse' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                <span>Real-Time SSE Stream Monitor</span>
              </h3>
              <p className="text-xs text-slate-500">
                Live stream connecting directly to <code>GET /api/mcp/sse</code> using the HTML5 EventSource API.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleSseConnection}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                  sseConnected ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                }`}
              >
                {sseConnected ? 'Disconnect SSE' : 'Connect SSE Stream'}
              </button>
              <button
                type="button"
                onClick={() => setSseLogs([])}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
              >
                Clear Log
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs max-h-80 overflow-y-auto custom-scrollbar border border-slate-800 space-y-1">
            {sseLogs.length === 0 ? (
              <span className="text-slate-500 italic">
                No events received yet. Click "Connect SSE Stream" to establish an active session.
              </span>
            ) : (
              sseLogs.map((log, idx) => (
                <div key={idx} className="leading-relaxed">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 5: CLAUDE DESKTOP & CURSOR CONFIG */}
      {activeSubTab === 'config' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Claude Desktop Config */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                  <span>Claude Desktop Configuration</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  File: <code>~/Library/Application Support/Claude/claude_desktop_config.json</code> (macOS)
                </p>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(claudeDesktopConfig, 'claude')}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'claude' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Config</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800">
              {claudeDesktopConfig}
            </pre>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Paste this snippet into your Claude Desktop configuration to enable Claude to solve doubts, query NCERT textbooks, and retrieve competitive formulas from your live app.
            </p>
          </div>

          {/* Cursor Configuration */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  Cursor & Windsurf Setup
                </h4>
                <p className="text-[11px] text-slate-500">
                  File: <code>.cursor/mcp.json</code> or Settings &gt; MCP
                </p>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(cursorConfig, 'cursor')}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'cursor' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Config</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-xl bg-slate-950 text-cyan-400 font-mono text-xs overflow-x-auto border border-slate-800">
              {cursorConfig}
            </pre>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Add this MCP server in Cursor settings to allow Cursor agent to call your app's educational tools and resources.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
