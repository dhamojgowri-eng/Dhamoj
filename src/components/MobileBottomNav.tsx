import React from 'react';
import { Camera, BookOpen, Target, Film, Gift } from 'lucide-react';
import { playChime } from '../utils/audio.ts';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  soundEnabled: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  soundEnabled,
}) => {
  const tabs = [
    { id: 'ask', icon: Camera, label: 'Ask Doubt' },
    { id: 'books', icon: BookOpen, label: 'Books' },
    { id: 'exams', icon: Target, label: 'JEE/NEET' },
    { id: 'shorts', icon: Film, label: 'Shorts' },
    { id: 'pro_apk', icon: Gift, label: 'Refer/APK' },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-slate-200 grid grid-cols-5 py-1.5 px-1 shadow-lg"
      aria-label="Mobile Navigation"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveTab(tab.id);
              playChime(500, 0.04, soundEnabled);
            }}
            className={`flex flex-col items-center justify-center py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
              active ? 'text-rose-600 font-extrabold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5]' : ''}`} />
            <span className="mt-0.5">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
