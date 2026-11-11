import React, { useState, useEffect } from 'react';
import { Target, Clock, Award, CheckCircle2, XCircle, AlertCircle, Bell, BellRing, Play } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MOCK_PAPERS, FORMULAE_LIST, EXAM_SCHEDULES, GOVT_EXAMS } from '../data/mockData.ts';
import { playChime, playSuccessChime } from '../utils/audio.ts';

interface ExamsTabProps {
  onOpenTrickSolution: (doubtId: string, format: 'video' | 'pdf', title: string) => void;
  soundEnabled: boolean;
  language: 'EN' | 'HI';
  showToast: (msg: string, type?: 'info' | 'success' | 'amber') => void;
}

export const ExamsTab: React.FC<ExamsTabProps> = ({
  onOpenTrickSolution,
  soundEnabled,
  language,
  showToast,
}) => {
  const [selectedExamCategory, setSelectedExamCategory] = useState<string>('ALL');
  const [activePaperKey, setActivePaperKey] = useState<string>('jee_2021');
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(900); // 15 mins
  const [schedules, setSchedules] = useState(EXAM_SCHEDULES);

  const activePaper = MOCK_PAPERS[activePaperKey];
  const currentQuestion = activePaper.questions[questionIndex];

  // Countdown timer
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted, activePaperKey]);

  const handleSelectPaper = (key: string) => {
    setActivePaperKey(key);
    setQuestionIndex(0);
    setAnswers({});
    setIsSubmitted(false);
    setSecondsRemaining(900);
    playChime(500, 0.05, soundEnabled);
  };

  const handleSelectOption = (optIdx: number) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [questionIndex]: optIdx }));
    playChime(540, 0.04, soundEnabled);
  };

  const handleSubmitTest = () => {
    setIsSubmitted(true);
    let correct = 0;
    let attempted = 0;

    activePaper.questions.forEach((q, idx) => {
      const userAns = answers[idx];
      if (typeof userAns === 'number') {
        attempted++;
        if (userAns === q.answer) correct++;
      }
    });

    const score = correct * 4 - (attempted - correct);
    const maxScore = activePaper.questions.length * 4;

    if (score >= maxScore * 0.75) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
      playSuccessChime(soundEnabled);
    } else {
      playChime(600, 0.1, soundEnabled);
    }

    showToast(`Test Submitted! You scored ${score} / ${maxScore} Marks.`, 'success');
  };

  const handleResetTest = () => {
    setAnswers({});
    setIsSubmitted(false);
    setQuestionIndex(0);
    setSecondsRemaining(900);
    showToast('Mock test reset. Timer set to 15:00.', 'info');
    playChime(480, 0.05, soundEnabled);
  };

  const toggleScheduleReminder = (id: string) => {
    setSchedules((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const next = !s.reminded;
          showToast(
            next ? `Alert active for: ${s.exam.slice(0, 35)}...` : 'Reminder alert removed.',
            'info'
          );
          return { ...s, reminded: next };
        }
        return s;
      })
    );
    playChime(560, 0.05, soundEnabled);
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Filter formulas
  const filteredFormulas = FORMULAE_LIST.filter(
    (f) => selectedExamCategory === 'ALL' || f.cat === selectedExamCategory
  );

  return (
    <div className="space-y-6">
      {/* Top Exam Category Selector & Govt Exams Strip */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-rose-600" />
              <span>
                {language === 'HI'
                  ? 'प्रतियोगी प्रवेश व सरकारी परीक्षा तैयारी हब'
                  : 'Competitive Entrance & Government Exam Prep Hub'}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Previous Year Papers (JEE Mains 2019–2021, JEE Adv, NEET 2018–2021, SSC/Banking), Mock Tests & Formulae
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'ALL', label: 'All Exams' },
              { id: 'IIT JEE', label: 'IIT JEE (Mains & Adv)' },
              { id: 'NEET', label: 'NEET UG (2018–2021)' },
              { id: 'Govt Exams', label: '11 Govt Exams (SSC/IBPS/NDA)' },
            ].map((cat) => {
              const active = selectedExamCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedExamCategory(cat.id);
                    if (cat.id === 'IIT JEE') handleSelectPaper('jee_2021');
                    else if (cat.id === 'NEET') handleSelectPaper('neet_2021');
                    else if (cat.id === 'Govt Exams') handleSelectPaper('govt_ssc');
                    playChime(480, 0.04, soundEnabled);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    active ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 11 Govt Exams Badge Strip */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="font-bold text-slate-700 mr-1">Supported Govt & Defence Exams:</span>
          {GOVT_EXAMS.map((e) => (
            <span key={e} className="px-2 py-0.5 rounded bg-white border border-slate-200 font-medium text-slate-800">
              {e}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Interactive Mock Test Paper Simulator */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                Live Exam Simulator (+4 / -1 Marking)
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                {activePaper.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={activePaperKey}
                onChange={(e) => handleSelectPaper(e.target.value)}
                className="text-xs font-semibold rounded-lg border border-slate-300 px-2.5 py-1.5 bg-slate-50 cursor-pointer"
              >
                <option value="jee_2021">JEE Mains (2019–2021 PYQ)</option>
                <option value="jee_adv">JEE Advanced Objective</option>
                <option value="neet_2021">NEET UG (2018–2021 PYQ)</option>
                <option value="govt_ssc">Govt: SSC CGL / IBPS / NDA</option>
              </select>

              <div
                className={`px-2.5 py-1 rounded-lg text-white font-mono text-xs font-bold flex items-center gap-1 ${
                  secondsRemaining < 120 ? 'bg-rose-600 animate-pulse' : 'bg-slate-900'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTimer(secondsRemaining)}</span>
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>
                  Question {questionIndex + 1} of {activePaper.questions.length}
                </span>
                <span className="text-emerald-700 font-bold">+4 Correct • -1 Incorrect</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-900">
                {currentQuestion.q}
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-600">
                {currentQuestion.hi}
              </p>
            </div>

            {/* Multiple Choice Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentQuestion.options.map((opt, oIdx) => {
                const isSelected = answers[questionIndex] === oIdx;
                const isCorrect = currentQuestion.answer === oIdx;

                let btnStyle = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800';
                if (isSubmitted) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-1 ring-emerald-500';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-50 border-rose-500 text-rose-950 ring-1 ring-rose-500';
                  }
                } else if (isSelected) {
                  btnStyle = 'bg-rose-50 border-rose-500 text-rose-900 font-bold ring-1 ring-rose-400';
                }

                return (
                  <button
                    key={oIdx}
                    type="button"
                    onClick={() => handleSelectOption(oIdx)}
                    disabled={isSubmitted}
                    className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition flex items-center gap-2.5 cursor-pointer disabled:cursor-default ${btnStyle}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isSelected ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span className="leading-snug">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Test Controls: Prev, Next, Reset, Submit */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={questionIndex === 0}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
              >
                ← Prev
              </button>
              <button
                type="button"
                onClick={() =>
                  setQuestionIndex((prev) => Math.min(activePaper.questions.length - 1, prev + 1))
                }
                disabled={questionIndex === activePaper.questions.length - 1}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
              >
                Next →
              </button>
              <button
                type="button"
                onClick={handleResetTest}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Reset Paper
              </button>
            </div>

            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmitTest}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white text-xs sm:text-sm font-bold shadow-xs hover:opacity-95 cursor-pointer"
              >
                Submit & View Solutions
              </button>
            ) : (
              <span className="text-xs font-bold text-emerald-700">Test Evaluated</span>
            )}
          </div>

          {/* Result Scorecard Banner */}
          {isSubmitted && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-extrabold text-sm sm:text-base text-emerald-950 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-700" />
                  <span>
                    Mock Test Result:{' '}
                    {activePaper.questions.reduce((acc, q, idx) => {
                      const ans = answers[idx];
                      if (ans === q.answer) return acc + 4;
                      if (typeof ans === 'number') return acc - 1;
                      return acc;
                    }, 0)}{' '}
                    / {activePaper.questions.length * 4} Marks
                  </span>
                </h4>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                  Attempted: {Object.keys(answers).length}/{activePaper.questions.length}
                </span>
              </div>

              {/* Explanations List */}
              <div className="space-y-2 pt-1">
                {activePaper.questions.map((q, idx) => {
                  const userAns = answers[idx];
                  const isCorrect = userAns === q.answer;
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-white border border-emerald-200 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span>
                          Q{idx + 1}: Correct ({String.fromCharCode(65 + q.answer)}){' '}
                          {q.options[q.answer]}
                        </span>
                        {isCorrect ? (
                          <span className="text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+4)
                          </span>
                        ) : typeof userAns === 'number' ? (
                          <span className="text-rose-600 flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Incorrect (-1)
                          </span>
                        ) : (
                          <span className="text-slate-500">Unattempted (0)</span>
                        )}
                      </div>
                      <p className="text-slate-600">{q.explanation}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right 5 Cols: Formulae Collections & Date Sheets */}
        <div className="lg:col-span-5 space-y-5">
          {/* Formulae Collections */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900">
                📐 Formulae & Shortcut Tricks
              </h3>
              <span className="text-xs text-rose-600 font-semibold">Hindi & English</span>
            </div>
            <div className="space-y-2.5 max-h-64 overflow-y-auto custom-scrollbar pr-1">
              {filteredFormulas.map((f) => (
                <div
                  key={f.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                        {f.cat}
                      </span>
                      <strong className="text-xs font-bold text-slate-900">{f.title}</strong>
                    </div>
                    <code className="text-xs font-mono text-slate-700 block">{f.formula}</code>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenTrickSolution(f.doubtId, 'video', f.title)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-semibold shrink-0 hover:bg-slate-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Play className="w-3 h-3 text-amber-300" />
                    <span>Watch</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Date Sheets & Exam Announcements */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900">
                📅 Date Sheets & Announcements
              </h3>
              <span className="text-xs text-slate-500 font-medium">Live Schedule</span>
            </div>
            <div className="space-y-2.5">
              {schedules.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-900">{item.exam}</div>
                    <div className="text-[11px] text-slate-600">
                      {item.date} •{' '}
                      <span className="text-emerald-700 font-semibold">{item.status}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleScheduleReminder(item.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition flex items-center gap-1 cursor-pointer ${
                      item.reminded
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {item.reminded ? (
                      <>
                        <BellRing className="w-3 h-3 text-emerald-700" />
                        <span>Alert Set</span>
                      </>
                    ) : (
                      <>
                        <Bell className="w-3 h-3 text-slate-500" />
                        <span>Remind</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
