import React, { useState } from 'react';
import { Gift, Copy, Check, ShieldCheck, ChevronDown, DownloadCloud, FileCode2, Search } from 'lucide-react';
import { APTOIDE_FAQS, ANDROID_PERMISSIONS } from '../data/mockData.ts';
import { playChime, playSuccessChime } from '../utils/audio.ts';

interface ReferAndApkTabProps {
  soundEnabled: boolean;
  language: 'EN' | 'HI';
  showToast: (msg: string, type?: 'info' | 'success' | 'amber') => void;
}

export const ReferAndApkTab: React.FC<ReferAndApkTabProps> = ({
  soundEnabled,
  language,
  showToast,
}) => {
  const [friendCount, setFriendCount] = useState<number>(3);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [permissionFilter, setPermissionFilter] = useState<string>('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const referralCode = 'STUDYS-FREE-71054';
  const totalCashback = friendCount * 1000;

  const copyReferralCode = () => {
    const text = `Join studys (100% Free NCERT, IIT JEE, NEET learning app) using my code ${referralCode} and get free 24/7 video solutions! https://doubtnut.en.aptoide.com/app`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    playSuccessChime(soundEnabled);
    showToast(`Copied Referral Code ${referralCode} & invite message!`, 'success');
    setTimeout(() => setIsCopied(false), 2200);
  };

  const filteredPermissions = ANDROID_PERMISSIONS.filter((p) =>
    p.toLowerCase().includes(permissionFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: CEO Refer & Earn + FAQ */}
        <div className="lg:col-span-6 space-y-5">
          {/* Refer & Earn Banner Card */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 p-5 text-white space-y-1">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase backdrop-blur-xs">
                What's New in v7.10.54
              </span>
              <h2 className="text-xl font-extrabold flex items-center gap-1.5">
                <Gift className="w-5 h-5 text-amber-200" />
                <span>studys Community Refer & Earn</span>
              </h2>
              <p className="text-xs sm:text-sm text-rose-100">
                All <strong>studys</strong> courses are 100% free of cost for users — invite friends and earn up to <strong>₹1,000 Paytm Cashback</strong> on community milestones!
              </p>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Simulated Friends Invited: <span className="text-rose-600 font-extrabold text-sm">{friendCount}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={friendCount}
                    onChange={(e) => {
                      setFriendCount(parseInt(e.target.value, 10));
                      playChime(460, 0.03, soundEnabled);
                    }}
                    className="w-full mt-2 accent-rose-600 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-500">Up to ₹1,000 cashback per friend admission</p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col justify-center">
                  <span className="text-xs font-semibold text-emerald-800">Estimated Cashback</span>
                  <span className="text-2xl font-extrabold text-emerald-700">
                    ₹{totalCashback.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-emerald-700">Direct to Paytm / UPI</span>
                </div>
              </div>

              {/* Referral Code Copy Box */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-100 border border-slate-200">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block">Your Referral Code:</span>
                  <code className="font-mono font-bold text-sm text-slate-900">{referralCode}</code>
                </div>
                <button
                  type="button"
                  onClick={copyReferralCode}
                  className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Copied!' : 'Copy Code & Link'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Verified Aptoide FAQ Accordion */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="font-extrabold text-base text-slate-900">
              Frequently Asked Questions (Verified Aptoide Listing)
            </h3>
            <div className="space-y-2">
              {APTOIDE_FAQS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200 bg-slate-50/70 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full text-left p-3 font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between cursor-pointer hover:bg-slate-100/60 transition"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-rose-600 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="p-3 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-200/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 6 Cols: Aptoide Technical Spec & 33 Permissions */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  Trusted • Malware-Scanned by Aptoide
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 mt-1">
                  studys (100% Free Edition) — Technical Specification
                </h2>
                <p className="text-xs text-slate-500">
                  Listing:{' '}
                  <a
                    href="https://doubtnut.en.aptoide.com/app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rose-600 underline font-medium"
                  >
                    https://doubtnut.en.aptoide.com/app
                  </a>
                </p>
              </div>
              <div className="text-right">
                <div className="text-xl font-extrabold text-slate-900">4.17 ★</div>
                <div className="text-[11px] text-slate-500">6 Reviews • PEGI-3</div>
              </div>
            </div>

            {/* Spec Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Package ID</span>
                <strong className="font-mono text-slate-900">com.doubtnutapp</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Latest Version</span>
                <strong className="text-slate-900">7.10.54 (25.5 MB)</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Downloads</span>
                <strong className="text-slate-900">10M+ (10 Millions)</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Android Compatibility</span>
                <strong className="text-slate-900">5.1+ (Lollipop)</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Developer</span>
                <strong className="text-slate-900">Aditya Shankar / DoubtNut</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Headquarters</span>
                <strong className="text-slate-900">Gurgaon, Haryana (91)</strong>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="flex flex-wrap justify-between gap-1">
                <span className="text-slate-500">SHA1 Signature:</span>
                <code className="font-mono text-[11px] text-slate-800 break-all">
                  51:1D:FF:90:D8:B9:B8:26:9A:36:CA:1E:5E:8B:88:03:41:72:D3:FA
                </code>
              </div>
              <div className="flex flex-wrap justify-between gap-1">
                <span className="text-slate-500">Privacy Policy:</span>
                <a
                  href="https://doubtnut.com/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-600 hover:underline"
                >
                  https://doubtnut.com/privacy-policy
                </a>
              </div>
            </div>

            {/* Version History Table */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Available APK Versions on Aptoide
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="p-2">Version</th>
                      <th className="p-2">Release Date</th>
                      <th className="p-2">Size</th>
                      <th className="p-2">Downloads</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-2 font-bold text-rose-600">7.10.54 (Latest)</td>
                      <td className="p-2">20/03/2025 (Updated 22/05/2026)</td>
                      <td className="p-2">25.5 MB</td>
                      <td className="p-2 font-semibold">10M</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold">7.10.51</td>
                      <td className="p-2">27/03/2025</td>
                      <td className="p-2">26.5 MB</td>
                      <td className="p-2">10M</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold">7.8.63</td>
                      <td className="p-2">12/05/2020</td>
                      <td className="p-2">18.5 MB</td>
                      <td className="p-2">10M</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 33 Android Permissions Inspector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <FileCode2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>33 Android Permissions Inspector</span>
                </span>
                <div className="relative">
                  <Search className="w-3 h-3 absolute left-2 top-2 text-slate-400" />
                  <input
                    type="text"
                    value={permissionFilter}
                    onChange={(e) => setPermissionFilter(e.target.value)}
                    placeholder="Filter permissions..."
                    className="text-xs border border-slate-300 rounded-lg pl-6 pr-2 py-1 w-36 sm:w-48 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="max-h-40 overflow-y-auto custom-scrollbar p-2.5 rounded-lg bg-slate-900 text-slate-200 font-mono text-[11px] space-y-1">
                {filteredPermissions.map((p, idx) => (
                  <div
                    key={p}
                    className="flex items-center justify-between py-0.5 border-b border-slate-800/80"
                  >
                    <span className="truncate mr-2">
                      {idx + 1}. {p}
                    </span>
                    <span className="text-emerald-400 text-[10px] shrink-0 font-sans font-bold">
                      GRANTED
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
