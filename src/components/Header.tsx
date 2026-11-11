import React from 'react';
import { Sparkles, Globe, BookmarkCheck, ExternalLink, ShieldCheck } from 'lucide-react';
import { playChime } from '../utils/audio.ts';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedClass: string;
  setSelectedClass: (cls: string) => void;
  selectedBoard: string;
  setSelectedBoard: (board: string) => void;
  language: 'EN' | 'HI';
  setLanguage: (lang: 'EN' | 'HI') => void;
  isPro: boolean;
  openProModal: () => void;
  savedCount: number;
  soundEnabled: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedClass,
  setSelectedClass,
  selectedBoard,
  setSelectedBoard,
  language,
  setLanguage,
  isPro,
  openProModal,
  savedCount,
  soundEnabled,
}) => {
  const toggleLanguage = () => {
    const next = language === 'EN' ? 'HI' : 'EN';
    setLanguage(next);
    playChime(580, 0.08, soundEnabled);
  };

  const navItems = [
    { id: 'ask', icon: '📸', label: language === 'HI' ? '24/7 डाउट पूछें' : '24/7 Ask Doubt' },
    { id: 'books', icon: '📚', label: language === 'HI' ? 'NCERT व 11 पब्लिशर्स' : 'NCERT & Textbooks (11 Pubs)' },
    { id: 'exams', icon: '🎯', label: language === 'HI' ? 'JEE, NEET व Govt एग्ज़ाम' : 'IIT JEE, NEET & Govt Exams' },
    { id: 'shorts', icon: '🎬', label: language === 'HI' ? 'studys शॉर्ट्स व स्पोकन इंग्लिश' : 'studys Shorts & English' },
    { id: 'mcp', icon: '🔌', label: language === 'HI' ? 'MCP सर्वर (Tools & SSE)' : 'MCP Server (Tools & SSE)' },
    { id: 'pro_apk', icon: '🎁', label: language === 'HI' ? 'रेफर (₹1000) व APK विवरण' : 'CEO Refer (₹1000) & APK Info' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2">
        {/* Brand Identity */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('ask');
            playChime(520, 0.06, soundEnabled);
          }}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center text-white font-extrabold text-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
            <span>ST</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">studys</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                v7.10.54
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                100% FREE FOREVER
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate max-w-xs sm:max-w-md">
              {language === 'HI'
                ? 'NCERT • IIT JEE • NEET • कक्षा 6–12 • 100% निःशुल्क 24/7 डाउट सॉल्विंग'
                : 'NCERT • IIT JEE • NEET • Classes 6–12 • 100% Free 24/7 Doubt Solving'}
            </p>
          </div>
        </button>

        {/* Global Controls: Class, Board, Hindi/English, Free Pass */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Class / Exam Filter */}
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              playChime(480, 0.05, soundEnabled);
            }}
            className="text-xs sm:text-sm font-medium bg-slate-100 hover:bg-slate-200/80 text-slate-800 rounded-lg px-2.5 py-1.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
          >
            <option value="ALL">All Classes & Exams</option>
            <option value="Class 12">Class 12</option>
            <option value="Class 11">Class 11</option>
            <option value="Class 10">Class 10</option>
            <option value="Class 9">Class 9</option>
            <option value="Class 8">Class 8</option>
            <option value="Class 7">Class 7</option>
            <option value="Class 6">Class 6</option>
            <option value="IIT JEE">IIT JEE (Mains & Adv)</option>
            <option value="NEET">NEET UG</option>
            <option value="Govt Exams">Govt Exams (SSC/IBPS/NDA/CTET)</option>
          </select>

          {/* Board Selector */}
          <select
            value={selectedBoard}
            onChange={(e) => {
              setSelectedBoard(e.target.value);
              playChime(480, 0.05, soundEnabled);
            }}
            className="text-xs sm:text-sm font-medium bg-slate-100 hover:bg-slate-200/80 text-slate-800 rounded-lg px-2.5 py-1.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
          >
            <option value="CBSE">CBSE Board</option>
            <option value="Bihar Board">Bihar Board</option>
            <option value="UP Board">UP Board</option>
            <option value="Rajasthan Board">Rajasthan Board</option>
            <option value="MP Board">MP Board</option>
            <option value="Telangana Board">Telangana Board</option>
          </select>

          {/* Bilingual Language Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 transition shadow-xs cursor-pointer"
            title="Toggle between English and Hindi Medium"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === 'HI' ? 'हिंदी माध्यम' : 'EN / हिंदी'}</span>
          </button>

          {/* studys Free Pass Button */}
          <button
            type="button"
            onClick={openProModal}
            className="text-xs sm:text-sm font-bold px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-900" />
            <span>studys Free Pass</span>
            <span className="text-[11px] bg-slate-900/15 px-1.5 py-0.5 rounded font-extrabold">₹0 Free</span>
          </button>
        </div>
      </div>

      {/* Desktop Navigation Bar */}
      <div className="hidden lg:block border-t border-slate-100 bg-slate-50/80">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <nav className="flex items-center space-x-1 py-1.5" aria-label="Main Navigation">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    playChime(500, 0.05, soundEnabled);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition flex items-center gap-2 cursor-pointer ${
                    active
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200/70 hover:text-slate-900'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <BookmarkCheck className="w-3.5 h-3.5 text-rose-600" />
              Saved Doubts: <strong className="text-rose-600 ml-0.5">{savedCount}</strong>
            </span>
            <span>•</span>
            <a
              href="https://doubtnut.en.aptoide.com/app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-600 hover:underline font-medium inline-flex items-center gap-1"
            >
              Aptoide Official APK ↗
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
