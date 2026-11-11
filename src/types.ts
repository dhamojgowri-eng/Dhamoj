export interface DoubtItem {
  id: string;
  title: string;
  classLevel: string;
  examTag: string;
  bookSource: string;
  subject: string;
  equation: string;
  steps: string[];
  shortcut: string;
  hindiSummary: string;
  boardTip: string;
  isUserCreated?: boolean;
}

export interface Textbook {
  id: string;
  publisher: string;
  title: string;
  classes: string[];
  subject: string;
  chapters: number;
  solvedCount: string;
  langs: string;
  format: string;
  linkedDoubtId: string;
}

export interface MockQuestion {
  q: string;
  hi: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface MockPaper {
  title: string;
  category: string;
  questions: MockQuestion[];
}

export interface FormulaItem {
  id: string;
  title: string;
  cat: string;
  formula: string;
  doubtId: string;
}

export interface ExamSchedule {
  id: string;
  exam: string;
  date: string;
  status: string;
  reminded: boolean;
}

export interface DNShort {
  id: string;
  category: string;
  title: string;
  caption: string;
  likes: number;
  liked: boolean;
  equation: string;
  accent: string;
}

export interface EnglishCourse {
  title: string;
  level: string;
  lessons: string;
  summary: string;
}

export interface GrammarQuestion {
  prompt: string;
  options: {
    text: string;
    correct: boolean;
    feedback: string;
  }[];
}

export interface FaqItem {
  q: string;
  a: string;
}
