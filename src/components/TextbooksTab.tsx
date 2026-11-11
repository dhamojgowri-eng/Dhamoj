import React, { useState } from 'react';
import { BookOpen, Search, Video, FileText, CheckCircle2 } from 'lucide-react';
import { Textbook, DoubtItem } from '../types.ts';
import { TEXTBOOKS_DATABASE, PUBLISHERS, SUBJECTS } from '../data/mockData.ts';
import { playChime } from '../utils/audio.ts';

interface TextbooksTabProps {
  onOpenBookSolution: (doubtId: string, format: 'video' | 'pdf', bookTitle: string) => void;
  selectedClass: string;
  soundEnabled: boolean;
  language: 'EN' | 'HI';
}

export const TextbooksTab: React.FC<TextbooksTabProps> = ({
  onOpenBookSolution,
  selectedClass,
  soundEnabled,
  language,
}) => {
  const [selectedPublisher, setSelectedPublisher] = useState<string>('ALL');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredBooks = TEXTBOOKS_DATABASE.filter((book) => {
    const matchPub = selectedPublisher === 'ALL' || book.publisher === selectedPublisher;
    const matchSub = selectedSubject === 'ALL' || book.subject === selectedSubject;
    const matchClass =
      selectedClass === 'ALL' || book.classes.some((c) => c.toLowerCase().includes(selectedClass.toLowerCase()));
    const matchQuery =
      !searchQuery ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.publisher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.subject.toLowerCase().includes(searchQuery.toLowerCase());

    return matchPub && matchSub && matchClass && matchQuery;
  });

  return (
    <div className="space-y-5">
      {/* Search & Filter Control Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-rose-600" />
              <span>
                {language === 'HI'
                  ? 'NCERT, संदर्भ पुस्तकें व कोचिंग संस्थान समाधान (11 पब्लिशर्स)'
                  : 'NCERT, Reference Textbooks & Coaching Solutions'}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {language === 'HI'
                ? 'कक्षा 6–12, CBSE, बिहार, UP, राजस्थान, MP और तेलंगाना बोर्ड के संपूर्ण वीडियो व PDF समाधान'
                : 'Video & PDF solutions for Classes 6–12 across CBSE, Bihar, UP, Rajasthan, MP & Telangana Boards'}
            </p>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search publisher, subject, or chapter..."
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 pl-9 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        {/* 11 Verified Publisher Filter Pills */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            11 Academic Publishers & Coaching Institutes:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PUBLISHERS.map((pub) => {
              const active = selectedPublisher === pub;
              return (
                <button
                  key={pub}
                  type="button"
                  onClick={() => {
                    setSelectedPublisher(pub);
                    playChime(480, 0.04, soundEnabled);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    active
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {pub === 'ALL' ? 'All 11 Publishers' : pub}
                </button>
              );
            })}
          </div>
        </div>

        {/* Subject Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 uppercase">Subject:</span>
          <div className="flex flex-wrap gap-1.5">
            {SUBJECTS.map((sub) => {
              const active = selectedSubject === sub;
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => {
                    setSelectedSubject(sub);
                    playChime(460, 0.04, soundEnabled);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    active
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {sub === 'ALL' ? 'All Subjects' : sub}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                  {book.publisher}
                </span>
                <span className="text-xs font-semibold text-slate-500">{book.format}</span>
              </div>
              <h3 className="font-extrabold text-base text-slate-900">{book.title}</h3>
              <p className="text-xs text-slate-600">
                Classes / Target:{' '}
                <strong className="text-slate-800">{book.classes.join(', ')}</strong>
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Chapters</span>
                  <strong className="text-slate-800">{book.chapters} Chapters</strong>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Video + PDF Solved</span>
                  <strong className="text-emerald-700">{book.solvedCount}</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500">
                🌐 {book.langs}
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => onOpenBookSolution(book.linkedDoubtId, 'video', book.title)}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Video</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenBookSolution(book.linkedDoubtId, 'pdf', book.title)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
