import { DoubtItem, Textbook, MockPaper, FormulaItem, ExamSchedule, DNShort, EnglishCourse, GrammarQuestion, FaqItem } from '../types.ts';

export const INITIAL_DOUBTS: DoubtItem[] = [
  {
    id: 'd1',
    title: 'Evaluate ∫ (from 0 to π/4) ln(1 + tan x) dx',
    classLevel: 'Class 12',
    examTag: 'IIT JEE / Class 12 Maths',
    bookSource: 'NCERT Class 12 & Cengage Calculus',
    subject: 'Mathematics',
    equation: 'I = ∫₀^(π/4) ln(1 + tan x) dx = (π/8) ln 2',
    steps: [
      "Step 1: Apply King's Property of Definite Integrals: ∫₀ᵃ f(x) dx = ∫₀ᵃ f(a - x) dx.",
      'Step 2: Substitute x → (π/4 - x): I = ∫₀^(π/4) ln(1 + tan(π/4 - x)) dx.',
      'Step 3: Expand tan(π/4 - x) = (1 - tan x) / (1 + tan x), giving 1 + tan(π/4 - x) = 2 / (1 + tan x).',
      'Step 4: I = ∫₀^(π/4) [ln 2 - ln(1 + tan x)] dx = (π/4) ln 2 - I  ⇒  2I = (π/4) ln 2  ⇒  I = (π/8) ln 2.'
    ],
    shortcut: 'Standard Form Shortcut: Whenever ∫₀^(π/4) ln(1 + tan x) dx appears in JEE Mains or NDA, directly apply I = (Upper Limit / 2) × ln 2 = (π/8) ln 2 in 5 seconds!',
    hindiSummary: 'निश्चित समाकलन के गुणधर्म ∫₀ᵃ f(x)dx = ∫₀ᵃ f(a-x)dx का उपयोग करने पर 2I = (π/4) ln 2 प्राप्त होता है, अतः उत्तर I = (π/8) ln 2 है।',
    boardTip: 'Frequently asked in CBSE Class 12 Board Exams (4 Marks) and IIT JEE Mains (2019, 2021).'
  },
  {
    id: 'd2',
    title: 'Find equivalent resistance between A & B in a balanced Wheatstone Bridge (R₁=4Ω, R₂=4Ω, R₃=4Ω, R₄=4Ω, R_galv=10Ω)',
    classLevel: 'Class 12',
    examTag: 'NEET / Class 12 Physics',
    bookSource: 'NCERT Physics & Narayana / VMC Module',
    subject: 'Physics',
    equation: 'R₁/R₂ = R₃/R₄ = 1  ⇒  I_G = 0  ⇒  R_eq = 4 Ω',
    steps: [
      'Step 1: Check the bridge balance condition: R₁ / R₂ = 4Ω / 4Ω = 1 and R₃ / R₄ = 4Ω / 4Ω = 1.',
      'Step 2: Since R₁/R₂ = R₃/R₄, the Wheatstone bridge is balanced and no current flows through the central 10Ω resistor.',
      'Step 3: Remove the central 10Ω branch. Upper branch has R₁ + R₂ = 4 + 4 = 8Ω; lower branch has R₃ + R₄ = 4 + 4 = 8Ω.',
      'Step 4: Combine the two 8Ω parallel branches: R_eq = (8 × 8) / (8 + 8) = 4 Ω.'
    ],
    shortcut: 'Symmetrical Balanced Bridge Rule: If all 4 outer arms of a Wheatstone bridge have equal resistance R, then R_eq across opposite corners is always equal to R (here 4 Ω), regardless of the central resistor!',
    hindiSummary: 'संतुलित व्हीटस्टोन सेतु में मध्य प्रतिरोध (10Ω) में कोई धारा प्रवाहित नहीं होती। अतः R_eq = (8 × 8)/(8 + 8) = 4 Ω होगा।',
    boardTip: 'High-yield circuit problem in NEET (2018–2021), JEE Mains, and UP/Bihar/CBSE Class 12 Physics.'
  },
  {
    id: 'd3',
    title: 'Solve Quadratic Equation 2x² - 7x + 3 = 0 by Completing the Square & Quadratic Formula',
    classLevel: 'Class 10',
    examTag: 'Class 10 Board Exams',
    bookSource: 'NCERT Class 10, RD Sharma & KC Sinha',
    subject: 'Mathematics',
    equation: '2x² - 7x + 3 = 0  ⇒  x = 3  or  x = 1/2',
    steps: [
      'Step 1: Compare 2x² - 7x + 3 = 0 with ax² + bx + c = 0: a = 2, b = -7, c = 3.',
      'Step 2: Compute discriminant D = b² - 4ac = (-7)² - 4(2)(3) = 49 - 24 = 25 > 0 (two distinct real roots).',
      'Step 3: Apply Sridharacharya formula: x = [-b ± √D] / (2a) = [7 ± √25] / 4 = (7 ± 5) / 4.',
      'Step 4: Roots are x₁ = (7 + 5)/4 = 3 and x₂ = (7 - 5)/4 = 1/2.'
    ],
    shortcut: 'Middle-Term Split Check: Product ac = 6, Sum b = -7 ⇒ factors are -6 and -1. Divide by a=2 and flip signs: 6/2 = 3 and 1/2!',
    hindiSummary: 'द्विघात सूत्र x = [-b ± √(b² - 4ac)] / 2a से D = 49 - 24 = 25 मिलता है। अतः मूल x = 3 और x = 1/2 हैं।',
    boardTip: 'Core question across CBSE, Bihar Board, UP Board, Rajasthan Board, MP Board & Telangana Board Class 10 exams.'
  },
  {
    id: 'd4',
    title: 'Calculate Molarity of NaOH solution prepared by dissolving 4g of NaOH in 250 mL of water',
    classLevel: 'Class 11',
    examTag: 'NEET / JEE / Class 11 Chemistry',
    bookSource: 'NCERT Chemistry & FITJEE / Bansal Material',
    subject: 'Chemistry',
    equation: 'M = (Mass / Molar Mass) × (1000 / V_mL) = 0.4 M',
    steps: [
      'Step 1: Find molar mass of NaOH = 23 (Na) + 16 (O) + 1 (H) = 40 g/mol.',
      'Step 2: Calculate moles of NaOH (n) = Given Mass / Molar Mass = 4 g / 40 g/mol = 0.1 mol.',
      'Step 3: Convert solution volume V = 250 mL = 0.250 L.',
      'Step 4: Molarity (M) = n / V(L) = 0.1 / 0.250 = 0.4 mol/L (0.4 M).'
    ],
    shortcut: '1-Line Formula: M = (w × 1000) / (M₀ × V_mL) = (4 × 1000) / (40 × 250) = 0.4 M.',
    hindiSummary: 'NaOH के मोल = 4/40 = 0.1 मोल। मोलरता (M) = (0.1 × 1000) / 250 = 0.4 M।',
    boardTip: 'Essential stoichiometry calculation for Class 11 & 12 Chemistry, NEET, and JEE Mains.'
  },
  {
    id: 'd5',
    title: "Explain Mendel's Law of Segregation with a Monohybrid Cross (Tt × Tt) Phenotypic & Genotypic Ratio",
    classLevel: 'Class 12',
    examTag: 'NEET Biology & Class 10/12 Boards',
    bookSource: 'NCERT Biology & Pathfinder Publications',
    subject: 'Biology',
    equation: 'Phenotypic Ratio = 3 : 1  |  Genotypic Ratio = 1 : 2 : 1',
    steps: [
      'Step 1: Cross pure tall (TT) with pure dwarf (tt) pea plants (Pisum sativum) to obtain F₁ hybrid heterozygous tall (Tt).',
      'Step 2: Self-pollinate F₁ plants (Tt × Tt). Gametes segregate cleanly into 50% T and 50% t without blending.',
      'Step 3: Punnett Square produces F₂ genotypes: 1 TT (Homozygous Tall) : 2 Tt (Heterozygous Tall) : 1 tt (Homozygous Dwarf).',
      'Step 4: Phenotypic ratio is 3 Tall : 1 Dwarf; Genotypic ratio is 1 : 2 : 1.'
    ],
    shortcut: 'For n heterozygous gene pairs, number of gametes = 2ⁿ, phenotypic ratio = (3:1)ⁿ, and genotypic ratio = (1:2:1)ⁿ.',
    hindiSummary: 'मेंडल के पृथक्करण नियम के अनुसार F₂ पीढ़ी में लक्षण प्ररूप अनुपात 3:1 (लंबे:बौने) तथा जीन प्ररूप अनुपात 1:2:1 (TT:Tt:tt) होता है।',
    boardTip: 'Guaranteed question in NEET Biology (2018–2021 PYQs) and Class 10/12 Board Biology.'
  },
  {
    id: 'd6',
    title: 'Find Compound Interest on ₹12,500 at 8% per annum for 2 years compounded annually',
    classLevel: 'Class 8',
    examTag: 'Class 8 Maths & Govt Exams (SSC CGL / IBPS-PO)',
    bookSource: 'NCERT Class 8 & RS Aggarwal Quantitative Aptitude',
    subject: 'Mathematics',
    equation: 'A = P(1 + R/100)ⁿ = ₹14,580  ⇒  CI = ₹2,080',
    steps: [
      'Step 1: Identify Principal P = ₹12,500, Rate R = 8% p.a., Time n = 2 years.',
      'Step 2: Compute (1 + R/100) = 1 + 8/100 = 27/25.',
      'Step 3: Amount A = 12500 × (27/25) × (27/25) = 20 × 729 = ₹14,580.',
      'Step 4: Compound Interest CI = A - P = 14580 - 12500 = ₹2,080.'
    ],
    shortcut: 'Effective 2-Year Rate Trick: Net CI% for 2 years at R% = 2R + R²/100 = 16 + 0.64 = 16.64%. Then 16.64% of ₹12,500 = ₹2,080!',
    hindiSummary: '2 वर्ष के लिए प्रभावी चक्रवृद्धि ब्याज दर = 8 + 8 + (8×8)/100 = 16.64%। अतः चक्रवृद्धि ब्याज = 12500 × 16.64% = ₹2,080।',
    boardTip: 'Important for Classes 8–10 and Govt Exams (IBPS-PO, IBPS-Clerk, SBI-PO, SSC CGL, SSC GD, Railways).'
  }
];

export const TEXTBOOKS_DATABASE: Textbook[] = [
  { id: 'b1', publisher: 'NCERT', title: 'NCERT Mathematics (Classes 6–12)', classes: ['Class 6','Class 7','Class 8','Class 9','Class 10','Class 11','Class 12'], subject: 'Mathematics', chapters: 16, solvedCount: '4,850+', langs: 'English & Hindi', format: 'Video + PDF', linkedDoubtId: 'd1' },
  { id: 'b2', publisher: 'NCERT', title: 'NCERT Physics Part I & II (Classes 11–12)', classes: ['Class 11','Class 12','IIT JEE','NEET'], subject: 'Physics', chapters: 15, solvedCount: '2,940+', langs: 'English & Hindi', format: 'Video + PDF', linkedDoubtId: 'd2' },
  { id: 'b3', publisher: 'NCERT', title: 'NCERT Chemistry & Biology Complete Solutions', classes: ['Class 9','Class 10','Class 11','Class 12','NEET'], subject: 'Chemistry', chapters: 30, solvedCount: '5,120+', langs: 'English & Hindi', format: 'Video + PDF', linkedDoubtId: 'd4' },
  { id: 'b4', publisher: 'RD Sharma', title: 'RD Sharma Mathematics (Classes 6–12)', classes: ['Class 6','Class 7','Class 8','Class 9','Class 10','Class 11','Class 12'], subject: 'Mathematics', chapters: 24, solvedCount: '6,400+', langs: 'English & Hindi', format: 'Video + PDF', linkedDoubtId: 'd3' },
  { id: 'b5', publisher: 'RS Aggarwal', title: 'RS Aggarwal Secondary Maths & Quantitative Aptitude', classes: ['Class 6','Class 7','Class 8','Class 9','Class 10','Govt Exams'], subject: 'Mathematics', chapters: 28, solvedCount: '5,300+', langs: 'English & Hindi', format: 'Video + PDF', linkedDoubtId: 'd6' },
  { id: 'b6', publisher: 'KC Sinha', title: 'KC Sinha Mathematics (Bihar & UP Board Special)', classes: ['Class 10','Class 11','Class 12'], subject: 'Mathematics', chapters: 22, solvedCount: '3,800+', langs: 'Hindi & English', format: 'Video + PDF', linkedDoubtId: 'd3' },
  { id: 'b7', publisher: 'Manohar Ray', title: 'Manohar Ray (मनोहर रे) Class 10–12 Ganit Solutions', classes: ['Class 10','Class 11','Class 12'], subject: 'Mathematics', chapters: 18, solvedCount: '2,750+', langs: 'Hindi Medium', format: 'Video + PDF', linkedDoubtId: 'd3' },
  { id: 'b8', publisher: 'Cengage', title: 'Cengage JEE Advanced Calculus & Mechanics Series', classes: ['Class 11','Class 12','IIT JEE'], subject: 'Mathematics', chapters: 20, solvedCount: '4,200+', langs: 'English & Hindi', format: 'Video + PDF', linkedDoubtId: 'd1' },
  { id: 'b9', publisher: 'Narayana', title: 'Narayana Coaching IIT JEE & NEET Module Solutions', classes: ['Class 11','Class 12','IIT JEE','NEET'], subject: 'Physics', chapters: 19, solvedCount: '3,100+', langs: 'English & Hindi', format: 'Video + PDF', linkedDoubtId: 'd2' },
  { id: 'b10', publisher: 'Bansal', title: 'Bansal Classes Kota JEE Mains & Advanced Bank', classes: ['Class 11','Class 12','IIT JEE'], subject: 'Chemistry', chapters: 17, solvedCount: '2,650+', langs: 'English & Hindi', format: 'Video + PDF', linkedDoubtId: 'd4' },
  { id: 'b11', publisher: 'FITJEE', title: 'FITJEE Grand Masters Package & Archive Solutions', classes: ['Class 11','Class 12','IIT JEE'], subject: 'Physics', chapters: 16, solvedCount: '2,890+', langs: 'English & Hindi', format: 'Video + PDF', linkedDoubtId: 'd2' },
  { id: 'b12', publisher: 'VMC', title: 'Vidyamandir Classes (VMC) JEE & NEET Modules', classes: ['Class 11','Class 12','IIT JEE','NEET'], subject: 'Chemistry', chapters: 18, solvedCount: '3,050+', langs: 'English & Hindi', format: 'Video + PDF', linkedDoubtId: 'd4' },
  { id: 'b13', publisher: 'Pathfinder Publications', title: 'Pathfinder Publications Biology & Olympiad Prep', classes: ['Class 11','Class 12','NEET','IIT JEE'], subject: 'Biology', chapters: 21, solvedCount: '2,420+', langs: 'English & Hindi', format: 'Video + PDF', linkedDoubtId: 'd5' }
];

export const MOCK_PAPERS: Record<string, MockPaper> = {
  jee_2021: {
    title: 'IIT JEE Mains Previous Year Paper (2019–2021 Series • EN/HI)',
    category: 'IIT JEE',
    questions: [
      {
        q: 'Q1 (JEE Mains 2021): Evaluate the definite integral ∫₀^(π/4) ln(1 + tan x) dx.',
        hi: 'प्रश्न 1 (JEE Mains 2021): निश्चित समाकलन ∫₀^(π/4) ln(1 + tan x) dx का मान ज्ञात कीजिए।',
        options: ['(π / 8) ln 2', '(π / 4) ln 2', '(π / 2) ln 2', 'π ln 2'],
        answer: 0,
        explanation: "Using King's property ∫₀ᵃ f(x)dx = ∫₀ᵃ f(a-x)dx gives 2I = (π/4) ln 2 ⇒ I = (π/8) ln 2."
      },
      {
        q: 'Q2 (JEE Mains 2020): In a balanced Wheatstone bridge, if each of the four outer arm resistors is 4 Ω and the central galvanometer resistor is 10 Ω, the equivalent resistance is:',
        hi: 'प्रश्न 2 (JEE Mains 2020): एक संतुलित व्हीटस्टोन सेतु में यदि चारों भुजाओं का प्रतिरोध 4 Ω है और मध्य प्रतिरोध 10 Ω है, तो तुल्य प्रतिरोध क्या होगा?',
        options: ['8 Ω', '4 Ω', '10 Ω', '2 Ω'],
        answer: 1,
        explanation: 'Since R₁/R₂ = R₃/R₄ = 1, no current flows through the 10 Ω branch. Two parallel branches of (4+4)=8 Ω give R_eq = 4 Ω.'
      },
      {
        q: 'Q3 (JEE Mains 2019): What is the molarity of a solution containing 4 g of NaOH dissolved in 250 mL of solution?',
        hi: 'प्रश्न 3 (JEE Mains 2019): 250 mL विलयन में 4 ग्राम NaOH घोलने पर विलयन की मोलरता क्या होगी?',
        options: ['0.1 M', '0.2 M', '0.4 M', '1.0 M'],
        answer: 2,
        explanation: 'Moles of NaOH = 4/40 = 0.1 mol. Volume = 0.25 L. Molarity = 0.1 / 0.25 = 0.4 M.'
      }
    ]
  },
  jee_adv: {
    title: 'IIT JEE Advanced Topic-Wise Objective Practice Paper',
    category: 'IIT JEE',
    questions: [
      {
        q: 'Q1 (JEE Advanced): A projectile is fired at 45° with initial kinetic energy K. What is its kinetic energy at the highest point of its trajectory?',
        hi: 'प्रश्न 1 (JEE Advanced): एक प्रक्षेप्य को प्रारंभिक गतिज ऊर्जा K के साथ 45° पर प्रक्षेपित किया जाता है। उच्चतम बिंदु पर इसकी गतिज ऊर्जा क्या होगी?',
        options: ['K / 4', 'K / 2', 'K / √2', 'Zero'],
        answer: 1,
        explanation: 'At highest point, velocity is u cos 45° = u/√2. Thus K_top = ½ m (u cos 45°)² = K cos²(45°) = K / 2.'
      },
      {
        q: 'Q2 (JEE Advanced): If roots of 2x² - 7x + 3 = 0 are α and β, what is the value of α² + β²?',
        hi: 'प्रश्न 2 (JEE Advanced): यदि 2x² - 7x + 3 = 0 के मूल α और β हैं, तो α² + β² का मान क्या है?',
        options: ['37 / 4', '49 / 4', '25 / 4', '9'],
        answer: 0,
        explanation: 'Roots are 3 and 1/2. Sum of squares = 3² + (1/2)² = 9 + 1/4 = 37/4.'
      }
    ]
  },
  neet_2021: {
    title: 'NEET Previous Year Question Paper (2018–2021 Verified Series • EN/HI)',
    category: 'NEET',
    questions: [
      {
        q: "Q1 (NEET 2021): In Mendel's monohybrid cross between tall (TT) and dwarf (tt) pea plants, the genotypic ratio in the F₂ generation is:",
        hi: 'प्रश्न 1 (NEET 2021): मेंडल के एकसंकर क्रॉस (TT × tt) की F₂ पीढ़ी में जीन प्ररूप (Genotypic) अनुपात क्या होता है?',
        options: ['3 : 1', '1 : 2 : 1', '9 : 3 : 3 : 1', '1 : 1'],
        answer: 1,
        explanation: 'F₂ generation produces 1 TT : 2 Tt : 1 tt (Genotypic ratio 1:2:1, while phenotypic ratio is 3:1).'
      },
      {
        q: 'Q2 (NEET 2020): Which organelle is known as the powerhouse of the eukaryotic cell due to oxidative phosphorylation (ATP synthesis)?',
        hi: 'प्रश्न 2 (NEET 2020): ATP संश्लेषण के कारण किस कोशिकांग को कोशिका का ऊर्जा गृह (Powerhouse) कहा जाता है?',
        options: ['Ribosome', 'Golgi Apparatus', 'Mitochondria', 'Lysosome'],
        answer: 2,
        explanation: 'Mitochondria synthesize ATP via cellular respiration and oxidative phosphorylation.'
      },
      {
        q: 'Q3 (NEET 2018/2019): What is the molarity of 4 g NaOH in 250 mL aqueous solution?',
        hi: 'प्रश्न 3 (NEET 2018/2019): 250 mL जलीय विलयन में 4 ग्राम NaOH की मोलरता कितनी होती है?',
        options: ['0.4 M', '0.8 M', '0.2 M', '0.04 M'],
        answer: 0,
        explanation: 'M = (4 / 40) / 0.25 = 0.4 M.'
      }
    ]
  },
  govt_ssc: {
    title: 'Government Exams Mock Test (SSC CGL / IBPS-PO / SBI-PO / CTET / NDA)',
    category: 'Govt Exams',
    questions: [
      {
        q: 'Q1 (SSC CGL / IBPS-PO): Find the compound interest on ₹12,500 at 8% per annum for 2 years compounded annually.',
        hi: 'प्रश्न 1 (SSC CGL / IBPS-PO): ₹12,500 पर 8% वार्षिक दर से 2 वर्ष का चक्रवृद्धि ब्याज ज्ञात कीजिए।',
        options: ['₹2,000', '₹2,080', '₹2,160', '₹1,980'],
        answer: 1,
        explanation: 'Effective 2-year rate = 8 + 8 + (64/100) = 16.64%. CI = 12500 × 0.1664 = ₹2,080.'
      },
      {
        q: 'Q2 (NDA / Railways): If sin θ + cos θ = √2, then what is the value of tan θ + cot θ?',
        hi: 'प्रश्न 2 (NDA / Railways): यदि sin θ + cos θ = √2 है, तो tan θ + cot θ का मान क्या होगा?',
        options: ['1', '2', '√2', '4'],
        answer: 1,
        explanation: 'Squaring both sides: 1 + 2 sin θ cos θ = 2 ⇒ sin θ cos θ = 1/2. Then tan θ + cot θ = 1/(sin θ cos θ) = 2.'
      }
    ]
  }
};

export const FORMULAE_LIST: FormulaItem[] = [
  { id: 'f1', title: "King's Property (Definite Integrals)", cat: 'IIT JEE', formula: '∫₀ᵃ f(x) dx = ∫₀ᵃ f(a - x) dx', doubtId: 'd1' },
  { id: 'f2', title: 'Wheatstone Bridge Balance Condition', cat: 'NEET', formula: 'R₁ / R₂ = R₃ / R₄  ⇒  I_galvanometer = 0', doubtId: 'd2' },
  { id: 'f3', title: 'Molarity & Dilution Equation', cat: 'NEET', formula: 'M = (w × 1000) / (M₀ × V_mL)  |  M₁V₁ = M₂V₂', doubtId: 'd4' },
  { id: 'f4', title: '2-Year Compound Interest Shortcut', cat: 'Govt Exams', formula: 'Effective CI% = 2R + (R² / 100)%', doubtId: 'd6' },
  { id: 'f5', title: 'Quadratic Discriminant & Roots', cat: 'IIT JEE', formula: 'x = [-b ± √(b² - 4ac)] / 2a', doubtId: 'd3' }
];

export const EXAM_SCHEDULES: ExamSchedule[] = [
  { id: 's1', exam: 'CBSE, Bihar, UP, Rajasthan, MP & Telangana Boards (Class 10 & 12)', date: 'Board Date Sheets & Sample Papers Active', status: 'Revision & Mock Tests Open', reminded: false },
  { id: 's2', exam: 'IIT JEE Mains & JEE Advanced Preparation Series', date: '2019, 2020 & 2021 PYQ Solutions + Live Mock Window', status: '24/7 Practice Live', reminded: false },
  { id: 's3', exam: 'NEET UG Medical Entrance (Hindi & English Medium)', date: '2018–2021 Solved Papers & Chapter MCQ Bank', status: 'Question Bank Active', reminded: false },
  { id: 's4', exam: 'Govt Exams: IBPS-PO/Clerk, SBI-PO, SSC CGL/GD, CTET, UPTET, DSSSB, Railways, NDA', date: 'All-India Practice Batches & Speed Quizzes', status: 'Open Daily', reminded: false }
];

export const DN_SHORTS_DATA: DNShort[] = [
  {
    id: 'sh1',
    category: 'Maths Trick',
    title: '5-Second Definite Integral Trick: ∫ ln(1 + tan x) dx',
    caption: 'Crack IIT JEE Mains & NDA integration questions without long substitution!',
    likes: 14200,
    liked: false,
    equation: '∫₀^(π/4) ln(1+tan x) dx = (π/8) ln 2',
    accent: '#f43f5e'
  },
  {
    id: 'sh2',
    category: 'Science Trick',
    title: 'Wheatstone Bridge Symmetry Hack in 10 Seconds',
    caption: 'Spot balanced bridges immediately in NEET & Class 12 Physics exams.',
    likes: 9850,
    liked: false,
    equation: 'R₁/R₂ = R₃/R₄ ⇒ Ignore Middle Resistor!',
    accent: '#3b82f6'
  },
  {
    id: 'sh3',
    category: 'Motivation',
    title: 'Board & JEE/NEET 90+ Score Daily Timetable Strategy',
    caption: 'How to combine NCERT textbook revision with PYQ mock tests effectively.',
    likes: 21400,
    liked: false,
    equation: 'NCERT Core + 30 Daily MCQs + 24/7 Doubt Clearing',
    accent: '#10b981'
  },
  {
    id: 'sh4',
    category: 'Art & Memory',
    title: 'Periodic Table & Mendel Ratios Visual Mnemonic',
    caption: 'Remember s, p, d, f blocks and 3:1 / 1:2:1 ratios with visual diagrams.',
    likes: 11300,
    liked: false,
    equation: 'Monohybrid F₂: Phenotype 3:1 | Genotype 1:2:1',
    accent: '#f59e0b'
  }
];

export const ENGLISH_COURSES: EnglishCourse[] = [
  { title: 'Spoken English Fluency for Students & Interviews', level: 'Beginner to Advanced (Hindi + English)', lessons: '45 Video Lessons + Audio Practice', summary: 'Daily conversation, pronunciation, self-introduction, and confidence building.' },
  { title: 'Complete English Grammar for Class 6–12 Boards', level: 'CBSE & State Boards (Bihar, UP, MP, RJ, TS)', lessons: '60 Concept Modules + PDF Notes', summary: 'Tenses, Active/Passive Voice, Direct/Indirect Speech, Modals, and Clauses.' },
  { title: 'Competitive English for SSC CGL, IBPS-PO, SBI-PO, NDA & CTET', level: 'Govt Exam Special', lessons: '1,200+ Error Spotting & Reading Comprehension MCQs', summary: 'Subject-Verb Agreement, Idioms, Cloze Test, and Vocabulary shortcuts.' }
];

export const GRAMMAR_QUESTIONS: GrammarQuestion[] = [
  {
    prompt: 'Select the grammatically correct sentence (Subject-Verb Agreement):',
    options: [
      { text: 'Neither the teacher nor the students was present.', correct: false, feedback: 'Incorrect: With "neither...nor", the verb agrees with the closer subject ("students" → plural "were").' },
      { text: 'Neither the teacher nor the students were present.', correct: true, feedback: 'Correct! When two subjects are joined by "neither...nor", the verb agrees with the nearer plural noun ("students were").' },
      { text: 'Each of the candidates have submitted the form.', correct: false, feedback: 'Incorrect: "Each of..." takes a singular verb ("has submitted").' }
    ]
  },
  {
    prompt: 'Choose the correct preposition: "The student has been preparing for IIT JEE _____ two years."',
    options: [
      { text: 'since', correct: false, feedback: 'Incorrect: "Since" is used with a specific point in time (e.g., since 2024).' },
      { text: 'for', correct: true, feedback: 'Correct! "For" is used with a duration/period of time (for two years).' },
      { text: 'from', correct: false, feedback: 'Incorrect: "From" is not used for continuous duration in present perfect continuous tense.' }
    ]
  }
];

export const APTOIDE_FAQS: FaqItem[] = [
  {
    q: 'What is studys (and is it free)?',
    a: 'studys is a 100% free educational app offering step-by-step video and PDF solutions for mathematics, science, and related subjects across school and competitive exam levels. It covers NCERT textbooks, board exam preparation for Classes 6–12, competitive exams like IIT JEE and NEET, and provides 24/7 homework help completely free of cost with ₹0 subscription fees.'
  },
  {
    q: 'Does studys have solutions for all major Indian boards?',
    a: 'Yes, studys covers CBSE, Bihar Board, UP Board, Rajasthan Board, MP Board, and Telangana Board for Classes 6–12. Content includes NCERT solutions, popular reference textbooks, and state board specific exam materials tailored to each curriculum.'
  },
  {
    q: 'How do video solutions work on studys?',
    a: 'You can search for specific questions using camera photo scan, voice command, or text input to receive step-by-step animated chalkboard explanations. Each solution includes detailed working steps, important concepts, shortcut techniques, and practice tips.'
  },
  {
    q: 'Can studys help with IIT JEE and NEET preparation?',
    a: 'Yes, studys provides extensive preparation materials for IIT JEE Mains & Advanced and NEET UG, including previous year papers (JEE Mains 2019–2021, NEET 2018–2021) with detailed solutions, topic-wise practice questions, full-length timed mock tests, formula cheat sheets, and video shortcuts in both Hindi and English.'
  },
  {
    q: 'What textbook solutions are available on studys?',
    a: 'studys offers solutions for 11 major academic publishers and coaching materials: NCERT, RD Sharma, RS Aggarwal, KC Sinha, Manohar Ray, Cengage, Narayana, Bansal Classes, FITJEE, VMC (Vidyamandir), and Pathfinder Publications.'
  },
  {
    q: 'Is Hindi medium content available on studys?',
    a: 'Yes, studys provides complete Hindi medium support including full NCERT Hindi solutions, IIT JEE and NEET Hindi courses, Hindi video explanations (हिंदी माध्यम सारांश), mock tests, and revision quizzes.'
  }
];

export const ANDROID_PERMISSIONS: string[] = [
  'android.permission.ACCESS_ADSERVICES_ATTRIBUTION',
  'android.permission.ACCESS_COARSE_LOCATION',
  'android.permission.ACCESS_FINE_LOCATION',
  'android.permission.ACCESS_NETWORK_STATE',
  'android.permission.ACCESS_WIFI_STATE',
  'android.permission.ANSWER_PHONE_CALLS',
  'android.permission.CALL_PHONE',
  'android.permission.CAMERA',
  'android.permission.FOREGROUND_SERVICE',
  'android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK',
  'android.permission.GET_ACCOUNTS',
  'android.permission.INTERNET',
  'android.permission.MODIFY_AUDIO_SETTINGS',
  'android.permission.POST_NOTIFICATIONS',
  'android.permission.READ_CALL_LOG',
  'android.permission.READ_CONTACTS',
  'android.permission.READ_MEDIA_IMAGES',
  'android.permission.READ_MEDIA_VIDEO',
  'android.permission.READ_PHONE_STATE',
  'android.permission.RECORD_AUDIO',
  'android.permission.SCHEDULE_EXACT_ALARM',
  'android.permission.SYSTEM_ALERT_WINDOW',
  'android.permission.USE_FULL_SCREEN_INTENT',
  'android.permission.VIBRATE',
  'android.permission.WAKE_LOCK',
  'android.permission.WRITE_EXTERNAL_STORAGE',
  'com.android.vending.BILLING',
  'com.applovin.array.apphub.permission.BIND_APPHUB_SERVICE',
  'com.doubtnutapp.permission.MIPUSH_RECEIVE',
  'com.google.android.c2dm.permission.RECEIVE',
  'com.google.android.finsky.permission.BIND_GET_INSTALL_REFERRER_SERVICE',
  'com.google.android.gms.permission.AD_ID',
  'com.truecaller.permission.sdk.internal.read_account_state'
];

export const PUBLISHERS = [
  'ALL',
  'NCERT',
  'RD Sharma',
  'RS Aggarwal',
  'KC Sinha',
  'Manohar Ray',
  'Cengage',
  'Narayana',
  'Bansal',
  'FITJEE',
  'VMC',
  'Pathfinder Publications'
];

export const SUBJECTS = ['ALL', 'Mathematics', 'Physics', 'Chemistry', 'Biology'];

export const GOVT_EXAMS = [
  'IBPS-PO',
  'IBPS-Clerk',
  'SBI-PO',
  'CTET',
  'UPTET',
  'DSSSB TGT',
  'DSSSB PRT',
  'SSC GD',
  'SSC CGL',
  'Railways',
  'NDA'
];
