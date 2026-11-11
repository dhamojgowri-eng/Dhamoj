import React from 'react';
import { Sparkles, Check, X, ShieldCheck } from 'lucide-react';

interface FreePassModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPro: boolean;
  onTogglePro: () => void;
}

export const FreePassModal: React.FC<FreePassModalProps> = ({
  isOpen,
  onClose,
  isPro,
  onTogglePro,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            studys 100% Free • v7.10.54
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 font-bold text-lg cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
          studys is 100% Free of Cost (₹0 Forever)
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Every feature on <strong>studys</strong> is completely free of cost for all students—enjoy uninterrupted 24/7 step-by-step video chalkboard solutions, unlimited IIT JEE & NEET mock tests, and downloadable NCERT & coaching PDF notes with zero subscription fees.
        </p>

        <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% Free Forever (₹0/day — No Paid Subscription Required)</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Zero Disruptive Ads across all Video Chalkboard & PDF Solutions</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Unlimited Access to NCERT, RD Sharma, Cengage, FITJEE & VMC Modules</span>
          </li>
        </ul>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer transition"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onTogglePro}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xs cursor-pointer transition"
          >
            Keep 100% Free Ad-Free Mode Active (₹0)
          </button>
        </div>
      </div>
    </div>
  );
};
