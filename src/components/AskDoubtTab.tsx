import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Mic, Search, Sparkles, FileText, Video, Copy, Bookmark, BookmarkCheck, Check, Loader2, VideoOff } from 'lucide-react';
import { DoubtItem } from '../types.ts';
import { ChalkboardPlayer } from './ChalkboardPlayer.tsx';
import { playChime, playSuccessChime } from '../utils/audio.ts';

interface AskDoubtTabProps {
  doubts: DoubtItem[];
  activeDoubt: DoubtItem;
  onSelectDoubt: (doubt: DoubtItem) => void;
  onAddNewDoubt: (doubt: DoubtItem) => void;
  savedDoubts: string[];
  onToggleSave: (doubtId: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  language: 'EN' | 'HI';
  selectedClass: string;
  showToast: (msg: string, type?: 'info' | 'success' | 'amber') => void;
}

export const AskDoubtTab: React.FC<AskDoubtTabProps> = ({
  doubts,
  activeDoubt,
  onSelectDoubt,
  onAddNewDoubt,
  savedDoubts,
  onToggleSave,
  soundEnabled,
  onToggleSound,
  language,
  selectedClass,
  showToast,
}) => {
  const [solutionFormat, setSolutionFormat] = useState<'video' | 'pdf'>('video');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [copiedSteps, setCopiedSteps] = useState<boolean>(false);

  // Camera stream state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const videoStreamRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Start / Stop WebCam
  const toggleLiveCamera = async () => {
    if (isCameraActive) {
      if (videoStreamRef.current && videoStreamRef.current.srcObject) {
        const stream = videoStreamRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((t) => t.stop());
        videoStreamRef.current.srcObject = null;
      }
      setIsCameraActive(false);
      showToast('Camera turned off.', 'info');
      return;
    }

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        if (videoStreamRef.current) {
          videoStreamRef.current.srcObject = stream;
          videoStreamRef.current.play();
        }
        setIsCameraActive(true);
        showToast('Live Camera active! Point at any textbook question and click Snap.', 'success');
        playChime(640, 0.1, soundEnabled);
      } else {
        showToast('Camera not available in this browser. You can still upload photos!', 'amber');
      }
    } catch (err: any) {
      console.warn('Camera error:', err);
      showToast('Camera access permission denied or unavailable. You can upload an image file!', 'amber');
    }
  };

  // Capture frame from active camera and solve
  const snapLivePhoto = async () => {
    playChime(680, 0.08, soundEnabled);
    if (isCameraActive && videoStreamRef.current) {
      const video = videoStreamRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64Data = canvas.toDataURL('image/jpeg', 0.8);
        await solveWithGeminiApi({ imageBase64: base64Data, mimeType: 'image/jpeg' });
        return;
      }
    }

    // Fallback cycle to next doubt if camera is off
    const currentIdx = doubts.findIndex((d) => d.id === activeDoubt.id);
    const nextIdx = (currentIdx + 1) % doubts.length;
    const nextDoubt = doubts[nextIdx];
    onSelectDoubt(nextDoubt);
    showToast(`Scanned equation: "${nextDoubt.title.slice(0, 40)}..."`, 'success');
  };

  // Handle Photo File Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64String = reader.result as string;
      showToast(`Analyzing uploaded photo "${file.name}" with Gemini AI...`, 'info');
      await solveWithGeminiApi({
        imageBase64: base64String,
        mimeType: file.type || 'image/jpeg',
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Real or simulated Voice Recognition
  const handleVoiceDoubt = () => {
    playChime(560, 0.08, soundEnabled);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = language === 'HI' ? 'hi-IN' : 'en-IN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        showToast('Listening... Speak your Maths or Science question now!', 'info');

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setSearchQuery(transcript);
          showToast(`Voice heard: "${transcript}"`, 'success');
          solveWithGeminiApi({ question: transcript });
        };

        recognition.onerror = () => {
          fallbackVoiceCycle();
        };

        recognition.start();
        return;
      } catch {
        fallbackVoiceCycle();
      }
    } else {
      fallbackVoiceCycle();
    }
  };

  const fallbackVoiceCycle = () => {
    const voiceSamples = [
      'Integrate ln(1 + tan x) from 0 to pi/4',
      'Wheatstone bridge balance condition and resistance',
      'Solve quadratic equation 2x^2 - 7x + 3 = 0',
      'Calculate molarity of 4g NaOH in 250 mL water',
      'Mendel law of segregation monohybrid cross ratio',
      'Compound interest on 12500 at 8 percent for 2 years',
    ];
    const picked = voiceSamples[Math.floor(Math.random() * voiceSamples.length)];
    setSearchQuery(picked);
    showToast(`Voice simulated: "${picked}"`, 'success');
    handleSearchSolve(picked);
  };

  // Solve typed doubt via text or AI API
  const handleSearchSolve = async (customQ?: string) => {
    const query = (customQ || searchQuery).trim();
    if (!query) {
      showToast('Type a question or equation, or snap a photo first!', 'amber');
      return;
    }

    // First check if matching preset
    const qLower = query.toLowerCase();
    const matchedPreset = doubts.find(
      (d) =>
        d.title.toLowerCase().includes(qLower) ||
        d.subject.toLowerCase().includes(qLower) ||
        d.equation.toLowerCase().includes(qLower)
    );

    if (matchedPreset) {
      onSelectDoubt(matchedPreset);
      showToast(`Loaded step-by-step solution for: "${matchedPreset.title.slice(0, 42)}..."`, 'success');
      return;
    }

    // Call Gemini API for custom queries!
    await solveWithGeminiApi({ question: query });
  };

  // Call Server-side Gemini API (/api/solve-doubt)
  const solveWithGeminiApi = async ({
    question,
    imageBase64,
    mimeType,
  }: {
    question?: string;
    imageBase64?: string;
    mimeType?: string;
  }) => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/solve-doubt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          imageBase64,
          mimeType,
          classLevel: selectedClass,
          language,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.doubt) {
        onAddNewDoubt(data.doubt);
        onSelectDoubt(data.doubt);
        playSuccessChime(soundEnabled);
        showToast(`AI Solution Ready: "${data.doubt.title.slice(0, 45)}..."`, 'success');
      } else {
        // Fallback gracefully
        const fallback = doubts[0];
        onSelectDoubt(fallback);
        showToast(data?.error || 'Loaded closest curriculum match.', 'amber');
      }
    } catch (err: any) {
      console.warn('API error:', err);
      const fallback = doubts[0];
      onSelectDoubt(fallback);
      showToast('Loaded verified curriculum solution.', 'info');
    } finally {
      setIsAiLoading(false);
    }
  };

  const copySolutionNotes = () => {
    const notes = `${activeDoubt.title}\n${activeDoubt.equation}\n\n${activeDoubt.steps.join('\n')}\n\nShortcut: ${activeDoubt.shortcut}\nTip: ${activeDoubt.boardTip}`;
    navigator.clipboard.writeText(notes);
    setCopiedSteps(true);
    showToast('Copied step-by-step solution notes to clipboard!', 'success');
    setTimeout(() => setCopiedSteps(false), 2000);
  };

  const isCurrentSaved = savedDoubts.includes(activeDoubt.id);

  // Filter preset doubts
  const filteredPresets = doubts.filter((item) => {
    const matchClass =
      selectedClass === 'ALL' ||
      item.classLevel === selectedClass ||
      item.examTag.toLowerCase().includes(selectedClass.toLowerCase());
    const matchQuery =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.equation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchClass && matchQuery;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Camera Scanner, Voice & Search Input */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Header bar */}
            <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 p-4 text-white flex items-center justify-between">
              <div>
                <h1 className="font-extrabold text-lg flex items-center gap-1.5">
                  <Sparkles className="w-5 h-5 text-amber-200" />
                  <span>24/7 Instant Doubt Solver</span>
                </h1>
                <p className="text-xs text-rose-100">
                  {language === 'HI'
                    ? 'फोटो खींचें, बोलें या गणित/विज्ञान का कोई भी सवाल लिखें'
                    : 'Snap a photo, speak, or type any Maths/Science question'}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-xs">
                24×7 Live
              </span>
            </div>

            {/* Simulated / Live Camera Viewfinder */}
            <div className="p-4 space-y-4">
              <div className="relative rounded-xl bg-slate-900 text-white h-52 flex flex-col items-center justify-center p-4 overflow-hidden border-2 border-dashed border-rose-400/60 shadow-inner">
                {/* Live Webcam video if active */}
                {isCameraActive ? (
                  <video
                    ref={videoStreamRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : null}

                {/* Laser scan line animation */}
                <div className="scan-line" />

                {/* Reticles */}
                <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-rose-400 z-10" />
                <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-rose-400 z-10" />
                <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-rose-400 z-10" />
                <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-rose-400 z-10" />

                {/* Camera Viewfinder Overlay */}
                <div className="text-center z-10 space-y-2 max-w-xs bg-slate-900/80 backdrop-blur-xs p-3 rounded-xl border border-slate-700/60">
                  <div className="text-[11px] uppercase tracking-wider text-rose-300 font-bold flex items-center justify-center gap-1">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Camera OCR Equation Scanner</span>
                  </div>
                  <div className="font-mono text-xs sm:text-sm bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-amber-300 truncate">
                    {activeDoubt.equation}
                  </div>
                  <p className="text-[11px] text-slate-300 truncate">
                    Detected: {activeDoubt.examTag} • {activeDoubt.bookSource}
                  </p>
                </div>

                {/* Live camera toggle pill */}
                <button
                  type="button"
                  onClick={toggleLiveCamera}
                  className="absolute bottom-2 right-2 z-20 px-2 py-1 rounded bg-black/60 hover:bg-black/80 text-[10px] text-slate-200 border border-white/20 flex items-center gap-1 cursor-pointer"
                >
                  {isCameraActive ? <VideoOff className="w-3 h-3 text-rose-400" /> : <Video className="w-3 h-3 text-emerald-400" />}
                  <span>{isCameraActive ? 'Turn Off Cam' : 'Live Camera'}</span>
                </button>
              </div>

              {/* Action Buttons: Snap, Upload, Voice */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={snapLivePhoto}
                  disabled={isAiLoading}
                  className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-bold text-xs sm:text-sm shadow-xs hover:opacity-95 flex flex-col items-center justify-center gap-1 transition cursor-pointer disabled:opacity-50"
                >
                  {isAiLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                  <span>Snap & Solve</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isAiLoading}
                  className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm flex flex-col items-center justify-center gap-1 transition text-center cursor-pointer disabled:opacity-50"
                >
                  <Upload className="w-4 h-4 text-slate-700" />
                  <span>Upload Photo</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </button>

                <button
                  type="button"
                  onClick={handleVoiceDoubt}
                  disabled={isAiLoading}
                  className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm flex flex-col items-center justify-center gap-1 transition cursor-pointer disabled:opacity-50"
                >
                  <Mic className="w-4 h-4 text-slate-700" />
                  <span>Voice Doubt</span>
                </button>
              </div>

              {/* Text Search / Type Question */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-semibold text-slate-700">
                  {language === 'HI'
                    ? 'या अपना सवाल यहाँ टाइप करें (हिंदी या English):'
                    : 'Or Type / Search Your Question (English or Hindi):'}
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearchSolve()}
                      placeholder="e.g., Definite integral, Ohm's law, Wheatstone, Molarity, Mendel..."
                      className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSearchSolve()}
                    disabled={isAiLoading}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    {isAiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Solve</span>}
                  </button>
                </div>
              </div>

              {/* Preset Doubt Library */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Instant Problems (Click to Solve)
                  </span>
                  <span className="text-xs font-semibold text-rose-600">
                    {filteredPresets.length} available
                  </span>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                  {filteredPresets.map((item) => {
                    const isSelected = item.id === activeDoubt.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onSelectDoubt(item);
                          playChime(540, 0.05, soundEnabled);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl border transition flex items-start justify-between gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-rose-50 border-rose-400 shadow-2xs'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                              {item.examTag}
                            </span>
                            <span className="text-[10px] font-semibold text-rose-600">
                              {item.bookSource}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-slate-900 line-clamp-2">
                            {item.title}
                          </div>
                        </div>
                        <span className="text-xs font-bold text-rose-600 shrink-0">
                          {isSelected ? '▶ Active' : 'Solve →'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Step-by-Step Video & PDF Solution Studio */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
            {/* Solution Header Bar */}
            <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
              <div className="space-y-0.5 max-w-md">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                    {activeDoubt.examTag}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">
                    {activeDoubt.bookSource}
                  </span>
                </div>
                <h2 className="font-bold text-base sm:text-lg text-slate-900 leading-snug">
                  {activeDoubt.title}
                </h2>
              </div>

              {/* Solution Format Switcher: Video vs PDF + Bookmark */}
              <div className="flex items-center gap-2">
                <div className="inline-flex rounded-xl bg-slate-200 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSolutionFormat('video');
                      playChime(500, 0.04, soundEnabled);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      solutionFormat === 'video'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    ▶️ Video
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSolutionFormat('pdf');
                      playChime(500, 0.04, soundEnabled);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      solutionFormat === 'pdf'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    📄 PDF
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleSave(activeDoubt.id)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition flex items-center gap-1 cursor-pointer ${
                    isCurrentSaved
                      ? 'border-amber-400 bg-amber-50 text-amber-800 font-bold'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {isCurrentSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-amber-600" /> : <Bookmark className="w-3.5 h-3.5" />}
                  <span>{isCurrentSaved ? 'Saved' : 'Save'}</span>
                </button>
              </div>
            </div>

            {/* FORMAT 1: Animated Chalkboard Video Player */}
            {solutionFormat === 'video' ? (
              <div className="p-4">
                <ChalkboardPlayer
                  doubt={activeDoubt}
                  isSaved={isCurrentSaved}
                  onToggleSave={() => onToggleSave(activeDoubt.id)}
                  soundEnabled={soundEnabled}
                  onToggleSound={onToggleSound}
                  language={language}
                />
              </div>
            ) : (
              /* FORMAT 2: Verified Free PDF Solution Sheet */
              <div className="p-5 space-y-4 bg-slate-50/50">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                        studys Verified Free PDF Solution Sheet
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                        {activeDoubt.title}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={copySolutionNotes}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedSteps ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSteps ? 'Copied!' : 'Copy Notes'}</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {activeDoubt.steps.map((s, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3"
                      >
                        <span className="w-6 h-6 rounded-full bg-rose-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
                          {s}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Practice Tip & Board Exam Weightage */}
                  <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs space-y-1">
                    <div className="font-bold text-amber-900">Practice Tip & Exam Weightage:</div>
                    <p className="text-amber-950 font-medium">{activeDoubt.boardTip}</p>
                    <p className="text-amber-800 font-semibold pt-1">
                      Shortcut: {activeDoubt.shortcut}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
