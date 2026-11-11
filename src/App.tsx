import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { AskDoubtTab } from './components/AskDoubtTab.tsx';
import { TextbooksTab } from './components/TextbooksTab.tsx';
import { ExamsTab } from './components/ExamsTab.tsx';
import { ShortsTab } from './components/ShortsTab.tsx';
import { ReferAndApkTab } from './components/ReferAndApkTab.tsx';
import { McpServerTab } from './components/McpServerTab.tsx';
import { FreePassModal } from './components/FreePassModal.tsx';
import { MobileBottomNav } from './components/MobileBottomNav.tsx';
import { INITIAL_DOUBTS } from './data/mockData.ts';
import { DoubtItem } from './types.ts';
import { playChime } from './utils/audio.ts';

interface Toast {
  id: string;
  msg: string;
  type: 'info' | 'success' | 'amber';
}

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('ask');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [selectedBoard, setSelectedBoard] = useState<string>('CBSE');
  const [language, setLanguage] = useState<'EN' | 'HI'>('EN');
  const [isPro, setIsPro] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [proModalOpen, setProModalOpen] = useState<boolean>(false);

  const [doubts, setDoubts] = useState<DoubtItem[]>(INITIAL_DOUBTS);
  const [activeDoubt, setActiveDoubt] = useState<DoubtItem>(INITIAL_DOUBTS[0]);
  const [savedDoubts, setSavedDoubts] = useState<string[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Load persistent bookmarks & pro status
  useEffect(() => {
    try {
      const raw = localStorage.getItem('studys_app_state_v71054');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.savedDoubts)) setSavedDoubts(parsed.savedDoubts);
        if (typeof parsed.isPro === 'boolean') setIsPro(parsed.isPro);
        if (typeof parsed.soundEnabled === 'boolean') setSoundEnabled(parsed.soundEnabled);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Save persistent state
  useEffect(() => {
    try {
      localStorage.setItem(
        'studys_app_state_v71054',
        JSON.stringify({
          savedDoubts,
          isPro,
          soundEnabled,
        })
      );
    } catch {
      // Ignore localStorage errors
    }
  }, [savedDoubts, isPro, soundEnabled]);

  const showToast = (msg: string, type: 'info' | 'success' | 'amber' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const handleToggleSaveDoubt = (doubtId: string) => {
    setSavedDoubts((prev) => {
      const exists = prev.includes(doubtId);
      if (exists) {
        showToast('Removed from saved bookmarks.', 'info');
        return prev.filter((id) => id !== doubtId);
      } else {
        showToast('Saved to your studys bookmarks!', 'success');
        playChime(640, 0.08, soundEnabled);
        return [...prev, doubtId];
      }
    });
  };

  const handleAddNewDoubt = (newDoubt: DoubtItem) => {
    setDoubts((prev) => [newDoubt, ...prev]);
    setActiveDoubt(newDoubt);
  };

  const handleOpenBookSolution = (doubtId: string, format: 'video' | 'pdf', bookTitle: string) => {
    const found = doubts.find((d) => d.id === doubtId) || doubts[0];
    setActiveDoubt(found);
    setActiveTab('ask');
    showToast(`Opened ${format.toUpperCase()} solution from ${bookTitle}`, 'success');
  };

  const handleOpenTrickSolution = (doubtId: string, format: 'video' | 'pdf', title: string) => {
    const found = doubts.find((d) => d.id === doubtId) || doubts[0];
    setActiveDoubt(found);
    setActiveTab('ask');
    showToast(`Launched Video Chalkboard Trick for: ${title}`, 'success');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-20 lg:pb-6 font-sans">
      {/* Toast Notification Stack */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => {
          const bg =
            t.type === 'success'
              ? 'bg-emerald-700'
              : t.type === 'amber'
              ? 'bg-amber-600'
              : 'bg-slate-900';
          return (
            <div
              key={t.id}
              className={`${bg} text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl shadow-lg border border-white/15 pointer-events-auto transition duration-200 animate-in fade-in slide-in-from-top-2`}
            >
              {t.msg}
            </div>
          );
        })}
      </div>

      {/* Top Application Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        selectedBoard={selectedBoard}
        setSelectedBoard={setSelectedBoard}
        language={language}
        setLanguage={setLanguage}
        isPro={isPro}
        openProModal={() => setProModalOpen(true)}
        savedCount={savedDoubts.length}
        soundEnabled={soundEnabled}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-5 space-y-6">
        {/* Active Curriculum Pill Strip */}
        <div className="bg-white rounded-xl border border-slate-200 p-3 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <span className="font-semibold text-slate-700">Active Curriculum:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-semibold border border-rose-200">
              {selectedClass === 'ALL' ? 'All Classes & Exams' : selectedClass}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
              {selectedBoard}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              {language === 'HI' ? 'हिंदी माध्यम (Hindi Medium)' : 'English + Hindi Medium'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 hidden sm:inline">
              10M+ Downloads • 4.17★ Rating • 25.5 MB
            </span>
            <button
              type="button"
              onClick={() => setActiveTab('pro_apk')}
              className="text-rose-600 font-semibold hover:underline cursor-pointer"
            >
              APK Details ↗
            </button>
          </div>
        </div>

        {/* Tab 1: 24/7 Ask a Doubt & Interactive Chalkboard Video / PDF Studio */}
        {activeTab === 'ask' && (
          <AskDoubtTab
            doubts={doubts}
            activeDoubt={activeDoubt}
            onSelectDoubt={setActiveDoubt}
            onAddNewDoubt={handleAddNewDoubt}
            savedDoubts={savedDoubts}
            onToggleSave={handleToggleSaveDoubt}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled((prev) => !prev)}
            language={language}
            selectedClass={selectedClass}
            showToast={showToast}
          />
        )}

        {/* Tab 2: NCERT, Reference Textbooks & Coaching Modules (11 Publishers) */}
        {activeTab === 'books' && (
          <TextbooksTab
            onOpenBookSolution={handleOpenBookSolution}
            selectedClass={selectedClass}
            soundEnabled={soundEnabled}
            language={language}
          />
        )}

        {/* Tab 3: IIT JEE, NEET & Govt Exams Prep Hub + Live Mock Test */}
        {activeTab === 'exams' && (
          <ExamsTab
            onOpenTrickSolution={handleOpenTrickSolution}
            soundEnabled={soundEnabled}
            language={language}
            showToast={showToast}
          />
        )}

        {/* Tab 4: studys Shorts & Spoken English / Grammar */}
        {activeTab === 'shorts' && (
          <ShortsTab
            soundEnabled={soundEnabled}
            language={language}
            showToast={showToast}
          />
        )}

        {/* Tab: Model Context Protocol (MCP) Server Explorer & Playground */}
        {activeTab === 'mcp' && (
          <McpServerTab
            soundEnabled={soundEnabled}
            language={language}
            showToast={showToast}
          />
        )}

        {/* Tab 5: CEO Refer & Earn (₹1000) + Aptoide APK v7.10.54 Technical Info */}
        {activeTab === 'pro_apk' && (
          <ReferAndApkTab
            soundEnabled={soundEnabled}
            language={language}
            showToast={showToast}
          />
        )}
      </main>

      {/* Free Pass Modal */}
      <FreePassModal
        isOpen={proModalOpen}
        onClose={() => setProModalOpen(false)}
        isPro={isPro}
        onTogglePro={() => {
          setIsPro(true);
          showToast('studys 100% Free Pass confirmed (₹0 forever)!', 'success');
          setProModalOpen(false);
        }}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundEnabled={soundEnabled}
      />
    </div>
  );
}
