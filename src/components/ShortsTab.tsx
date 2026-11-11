import React, { useState, useRef, useEffect } from 'react';
import { Film, Heart, ChevronUp, ChevronDown, CheckCircle, AlertCircle, BookOpenCheck } from 'lucide-react';
import { DNShort } from '../types.ts';
import { DN_SHORTS_DATA, ENGLISH_COURSES, GRAMMAR_QUESTIONS } from '../data/mockData.ts';
import { playChime, playSuccessChime } from '../utils/audio.ts';

interface ShortsTabProps {
  soundEnabled: boolean;
  language: 'EN' | 'HI';
  showToast: (msg: string, type?: 'info' | 'success' | 'amber') => void;
}

export const ShortsTab: React.FC<ShortsTabProps> = ({ soundEnabled, language, showToast }) => {
  const [shortsList, setShortsList] = useState<DNShort[]>(DN_SHORTS_DATA);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [grammarAnswerIdx, setGrammarAnswerIdx] = useState<number | null>(null);
  const [grammarQuestionIdx, setGrammarQuestionIdx] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const tickRef = useRef<number>(0);

  const currentShort = shortsList[activeIndex];
  const currentGrammarQ = GRAMMAR_QUESTIONS[grammarQuestionIdx];

  // Canvas loop for short
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      tickRef.current += 0.03;
      const t = tickRef.current;

      // Dark futuristic reel background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Concentric circles pulse
      for (let r = 1; r <= 4; r++) {
        ctx.beginPath();
        const radius = ((t * 26 + r * 44) % 210) + 20;
        ctx.arc(canvas.width / 2, canvas.height / 2 - 20, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.15)';
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }

      // Top Tag
      ctx.fillStyle = currentShort.accent || '#f43f5e';
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`STUDYS SHORTS • ${currentShort.category.toUpperCase()}`, canvas.width / 2, 44);

      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Inter, sans-serif';
      const maxTitle = 42;
      const titleStr = currentShort.title.length > maxTitle ? currentShort.title.slice(0, maxTitle) + '...' : currentShort.title;
      ctx.fillText(titleStr, canvas.width / 2, 88);

      // Highlight Equation / Trick Card
      ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
      ctx.fillRect(36, 120, canvas.width - 72, 72);
      ctx.strokeStyle = currentShort.accent || '#f43f5e';
      ctx.lineWidth = 2;
      ctx.strokeRect(36, 120, canvas.width - 72, 72);

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(currentShort.equation, canvas.width / 2, 162);

      ctx.textAlign = 'left';
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activeIndex]);

  const changeShort = (delta: number) => {
    setActiveIndex((prev) => (prev + delta + shortsList.length) % shortsList.length);
    playChime(580, 0.05, soundEnabled);
  };

  const toggleLikeShort = () => {
    setShortsList((prev) =>
      prev.map((s, idx) => {
        if (idx === activeIndex) {
          const next = !s.liked;
          const newLikes = next ? s.likes + 1 : s.likes - 1;
          if (next) showToast(`Liked short: "${s.title.slice(0, 30)}..."`, 'success');
          return { ...s, liked: next, likes: newLikes };
        }
        return s;
      })
    );
    playChime(660, 0.06, soundEnabled);
  };

  const checkGrammar = (idx: number) => {
    setGrammarAnswerIdx(idx);
    const isCorrect = currentGrammarQ.options[idx].correct;
    if (isCorrect) {
      playSuccessChime(soundEnabled);
      showToast('Correct! Well done.', 'success');
    } else {
      playChime(340, 0.08, soundEnabled);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: studys Shorts Stage */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[11px] font-bold">
                  NEW IN v7.10.54
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Film className="w-5 h-5 text-rose-600" />
                  <span>studys Shorts (60s Tricks)</span>
                </h2>
              </div>
              <p className="text-xs text-slate-600">
                Short educational videos on Maths Tricks, Science, Motivation & Formulas
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => changeShort(-1)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>
              <button
                type="button"
                onClick={() => changeShort(1)}
                className="px-2.5 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-500 text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <span>Next</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Shorts Reel Canvas */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 text-white border border-slate-800 shadow-lg">
            <canvas
              ref={canvasRef}
              width={540}
              height={330}
              className="w-full h-72 sm:h-80 block"
            />
            <div className="p-4 bg-gradient-to-t from-slate-950 via-slate-900/95 to-transparent flex items-end justify-between gap-4">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/30 border border-rose-400/40 text-rose-200 text-xs font-bold">
                  {currentShort.category}
                </span>
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  {currentShort.title}
                </h3>
                <p className="text-xs text-slate-300">{currentShort.caption}</p>
              </div>

              <button
                type="button"
                onClick={toggleLikeShort}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                  currentShort.liked
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${currentShort.liked ? 'fill-white' : ''}`} />
                <span>{(currentShort.likes / 1000).toFixed(1)}K</span>
              </button>
            </div>
          </div>

          {/* Shorts Playlist Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {shortsList.map((item, idx) => {
              const active = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveIndex(idx);
                    playChime(560, 0.04, soundEnabled);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    active ? 'bg-rose-50 border-rose-500 shadow-2xs' : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <span className="text-[10px] font-bold text-rose-600 block">
                    {item.category}
                  </span>
                  <span className="text-xs font-bold text-slate-900 line-clamp-2">
                    {item.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 6 Cols: Spoken English & Grammar Courses */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Language & Communication Courses
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-1.5">
              <BookOpenCheck className="w-5 h-5 text-emerald-600" />
              <span>Spoken English & English Grammar</span>
            </h2>
            <p className="text-xs text-slate-600">
              Interactive video lessons & grammar checks for Hindi & English medium students
            </p>
          </div>

          <div className="space-y-3">
            {ENGLISH_COURSES.map((c, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 hover:border-slate-300 transition"
              >
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <h3 className="font-bold text-sm text-slate-900">{c.title}</h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {c.lessons}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{c.summary}</p>
                <span className="text-[11px] text-slate-500 block">Target: {c.level}</span>
              </div>
            ))}
          </div>

          {/* Interactive Mini Grammar Check */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Interactive Grammar Check
              </span>
              <div className="flex items-center gap-1">
                {GRAMMAR_QUESTIONS.map((_, qIdx) => (
                  <button
                    key={qIdx}
                    type="button"
                    onClick={() => {
                      setGrammarQuestionIdx(qIdx);
                      setGrammarAnswerIdx(null);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                      grammarQuestionIdx === qIdx
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    Q{qIdx + 1}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-sm font-semibold text-slate-900">
              {currentGrammarQ.prompt}
            </p>

            <div className="space-y-2">
              {currentGrammarQ.options.map((opt, idx) => {
                const picked = grammarAnswerIdx === idx;
                let optStyle = 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800';
                if (grammarAnswerIdx !== null) {
                  if (opt.correct) {
                    optStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
                  } else if (picked) {
                    optStyle = 'bg-rose-50 border-rose-500 text-rose-950';
                  }
                }
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => checkGrammar(idx)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs font-semibold transition cursor-pointer flex items-center justify-between ${optStyle}`}
                  >
                    <span>
                      {String.fromCharCode(65 + idx)}. {opt.text}
                    </span>
                    {grammarAnswerIdx !== null && opt.correct && (
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>

            {grammarAnswerIdx !== null && (
              <p
                className={`text-xs font-semibold p-2.5 rounded-lg border leading-relaxed ${
                  currentGrammarQ.options[grammarAnswerIdx].correct
                    ? 'text-emerald-900 bg-emerald-50 border-emerald-200'
                    : 'text-rose-900 bg-rose-50 border-rose-200'
                }`}
              >
                {currentGrammarQ.options[grammarAnswerIdx].feedback}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
