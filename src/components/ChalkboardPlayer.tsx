import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Bookmark, BookmarkCheck, Zap, Globe, Sparkles } from 'lucide-react';
import { DoubtItem } from '../types.ts';
import { playChime, playTeacherStepChime } from '../utils/audio.ts';

interface ChalkboardPlayerProps {
  doubt: DoubtItem;
  isSaved: boolean;
  onToggleSave: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  language: 'EN' | 'HI';
}

export const ChalkboardPlayer: React.FC<ChalkboardPlayerProps> = ({
  doubt,
  isSaved,
  onToggleSave,
  soundEnabled,
  onToggleSound,
  language,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  const animFrameRef = useRef<number | null>(null);
  const stepProgressRef = useRef<number>(0);
  const currentStepRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(true);
  const speedRef = useRef<number>(1);
  const soundRef = useRef<boolean>(soundEnabled);

  // Sync refs
  useEffect(() => {
    currentStepRef.current = currentStepIndex;
  }, [currentStepIndex]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    speedRef.current = playbackSpeed;
  }, [playbackSpeed]);

  useEffect(() => {
    soundRef.current = soundEnabled;
  }, [soundEnabled]);

  // Reset when doubt changes
  useEffect(() => {
    setCurrentStepIndex(0);
    currentStepRef.current = 0;
    stepProgressRef.current = 0;
    setIsPlaying(true);
    isPlayingRef.current = true;
    playTeacherStepChime(0, soundEnabled);
  }, [doubt.id]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastStepAnnounced = -1;

    const render = () => {
      const steps = doubt.steps || [];
      const totalSteps = steps.length || 1;

      if (isPlayingRef.current) {
        stepProgressRef.current += 0.0055 * speedRef.current;
        if (stepProgressRef.current >= 1) {
          stepProgressRef.current = 0;
          const nextStep = (currentStepRef.current + 1) % totalSteps;
          currentStepRef.current = nextStep;
          setCurrentStepIndex(nextStep);

          if (nextStep !== lastStepAnnounced) {
            playTeacherStepChime(nextStep, soundRef.current);
            lastStepAnnounced = nextStep;
          }
        }
      }

      // Draw Chalkboard Surface
      ctx.fillStyle = '#091426';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle Mathematics Grid
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.07)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 38) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 38) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Top Status Header
      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 12.5px Inter, sans-serif';
      ctx.fillText(
        `STUDYS 100% FREE CHALKBOARD TEACHER • ${doubt.examTag.toUpperCase()}`,
        20,
        28
      );

      // Chalkboard Equation Box
      ctx.fillStyle = 'rgba(30, 41, 59, 0.88)';
      ctx.fillRect(20, 40, canvas.width - 40, 44);
      ctx.strokeStyle = '#fb7185';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(20, 40, canvas.width - 40, 44);

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 15px monospace';
      ctx.fillText(doubt.equation, 34, 68);

      // Render Steps
      const activeIdx = currentStepRef.current;
      for (let i = 0; i <= activeIdx; i++) {
        const stepText = steps[i] || '';
        const yBase = 114 + i * 52;
        const isCurrent = i === activeIdx;

        ctx.fillStyle = isCurrent ? 'rgba(244, 63, 94, 0.18)' : 'rgba(15, 23, 42, 0.6)';
        ctx.fillRect(20, yBase - 18, canvas.width - 40, 44);

        if (isCurrent) {
          ctx.strokeStyle = 'rgba(251, 113, 133, 0.5)';
          ctx.lineWidth = 1;
          ctx.strokeRect(20, yBase - 18, canvas.width - 40, 44);
        }

        ctx.fillStyle = isCurrent ? '#38bdf8' : '#e2e8f0';
        ctx.font = isCurrent ? 'bold 13px Inter, sans-serif' : '12px Inter, sans-serif';

        const charsToShow = isCurrent
          ? Math.max(14, Math.floor(stepText.length * Math.min(1, stepProgressRef.current * 1.3)))
          : stepText.length;
        const visible = stepText.slice(0, charsToShow);

        const maxLine = 82;
        if (visible.length <= maxLine) {
          ctx.fillText(visible, 32, yBase);
        } else {
          ctx.fillText(visible.slice(0, maxLine), 32, yBase - 5);
          ctx.fillText(visible.slice(maxLine, maxLine * 2), 32, yBase + 13);
        }
      }

      // Bottom Timeline Bar
      const totalProg = (activeIdx + stepProgressRef.current) / totalSteps;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(20, canvas.height - 14, canvas.width - 40, 5);
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(20, canvas.height - 14, (canvas.width - 40) * Math.min(1, totalProg), 5);

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [doubt.id]);

  const handleStepJump = (idx: number) => {
    setCurrentStepIndex(idx);
    currentStepRef.current = idx;
    stepProgressRef.current = 0;
    playTeacherStepChime(idx, soundEnabled);
  };

  const handleReplay = () => {
    setCurrentStepIndex(0);
    currentStepRef.current = 0;
    stepProgressRef.current = 0;
    setIsPlaying(true);
    isPlayingRef.current = true;
    playChime(620, 0.08, soundEnabled);
  };

  return (
    <div className="space-y-4">
      {/* Chalkboard Screen Canvas */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
        <canvas
          ref={canvasRef}
          width={760}
          height={350}
          className="w-full h-64 sm:h-80 block cursor-pointer"
          onClick={() => {
            setIsPlaying((prev) => !prev);
            playChime(500, 0.05, soundEnabled);
          }}
        />

        {/* Player Bottom Control Bar */}
        <div className="bg-slate-900/95 border-t border-slate-800 px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-white">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsPlaying((prev) => !prev);
                playChime(520, 0.05, soundEnabled);
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <button
              type="button"
              onClick={handleReplay}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition cursor-pointer"
              title="Replay Video Chalkboard"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onToggleSound}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition flex items-center gap-1 cursor-pointer"
              title="Toggle Audio Feedback"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
              <span className="hidden sm:inline">{soundEnabled ? 'Sound ON' : 'Muted'}</span>
            </button>
          </div>

          {/* Step Jump Pills */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-slate-400 mr-1 hidden sm:inline">Steps:</span>
            {doubt.steps.map((_, idx) => {
              const active = idx === currentStepIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleStepJump(idx)}
                  className={`px-2 py-0.5 rounded text-xs font-bold transition cursor-pointer ${
                    active ? 'bg-amber-400 text-slate-950 ring-1 ring-amber-300' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  S{idx + 1}
                </button>
              );
            })}
          </div>

          {/* Speed Controls */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 text-[11px] mr-1 hidden sm:inline">Speed:</span>
            {[1, 1.5, 2].map((spd) => {
              const active = playbackSpeed === spd;
              return (
                <button
                  key={spd}
                  type="button"
                  onClick={() => {
                    setPlaybackSpeed(spd);
                    playChime(450, 0.04, soundEnabled);
                  }}
                  className={`px-2 py-0.5 rounded text-xs font-bold transition cursor-pointer ${
                    active ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {spd}x
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Concept, Shortcut & Hindi Medium Explanation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Shortcut Trick Card */}
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/90 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-900 mb-1">
            <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>5-Second Shortcut & Key Concept</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
            {doubt.shortcut}
          </p>
        </div>

        {/* Hindi Medium Card */}
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/90 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-900 mb-1">
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>हिंदी माध्यम सारांश (Hindi Medium Explanation)</span>
          </div>
          <p className="text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
            {doubt.hindiSummary}
          </p>
        </div>
      </div>
    </div>
  );
};
