import { Sigma, Brain, BookOpen, Landmark } from "lucide-react";

export const SECTIONAL_COUNTS = {
  "quantitative-aptitude": {
    label: "Quantitative Aptitude", icon: Sigma, color: "#22c55e", total: 863,
    topics: [
      ["simplification", "Simplification", 54], ["geometry", "Geometry", 44],
      ["number-system", "Number System", 39], ["mensuration", "Mensuration", 38],
      ["profit-loss", "Profit & Loss", 35], ["algebra", "Algebra", 34],
      ["trigonometry", "Trigonometry", 32], ["data-interpretation", "Data Interpretation", 29],
      ["average", "Average", 21], ["time-work", "Time & Work", 21],
      ["percentage", "Percentage", 20], ["time-speed-distance", "Time, Speed & Distance", 19],
      ["ratio-proportion", "Ratio & Proportion", 16], ["simple-interest", "Simple Interest", 13],
      ["compound-interest", "Compound Interest", 10], ["discount", "Discount", 8],
      ["pipes-cisterns", "Pipes & Cisterns", 3], ["boats-streams", "Boats & Streams", 2],
      ["trains", "Trains", 2],
    ],
  },
  "reasoning": {
    label: "Reasoning", icon: Brain, color: "#f97316", total: 693,
    topics: [
      ["analogy", "Analogy", 60], ["coding-decoding", "Coding-Decoding", 49],
      ["figure-based", "Figure Based", 43], ["series", "Series", 31],
      ["classification", "Classification", 22], ["mathematical-operations", "Mathematical Operations", 18],
      ["blood-relations", "Blood Relations", 16], ["syllogism", "Syllogism", 15],
      ["mirror-image", "Mirror Image", 11], ["paper-folding", "Paper Folding", 10],
      ["puzzle", "Puzzle", 10], ["venn-diagram", "Venn Diagram", 10],
      ["direction-distance", "Direction & Distance", 9], ["seating-arrangement", "Seating Arrangement", 8],
      ["calendar", "Calendar", 7], ["ranking-order", "Ranking & Order", 5],
      ["statement-conclusion", "Statement & Conclusion", 5],
    ],
  },
  "english": {
    label: "English", icon: BookOpen, color: "#3b82f6", total: 535,
    topics: [
      ["reading-comprehension", "Reading Comprehension", 75], ["idioms-phrases", "Idioms & Phrases", 29],
      ["grammar", "Grammar", 26], ["fill-in-the-blanks", "Fill in the Blanks", 20],
      ["vocabulary", "Vocabulary", 20], ["cloze-test", "Cloze Test", 19],
      ["error-spotting", "Error Spotting", 16], ["active-passive", "Active/Passive", 14],
      ["antonyms", "Antonyms", 14], ["synonyms", "Synonyms", 13],
      ["direct-indirect", "Direct/Indirect", 10], ["spelling", "Spelling", 10],
      ["one-word-substitution", "One Word Substitution", 9], ["para-jumbles", "Para Jumbles", 7],
      ["sentence-improvement", "Sentence Improvement", 3], ["tenses", "Tenses", 2],
    ],
  },
  "general-awareness": {
    label: "General Awareness", icon: Landmark, color: "#ef4444", total: 863,
    topics: [
      ["geography", "Geography", 68], ["static-gk", "Static GK", 63],
      ["polity", "Polity", 59], ["economics", "Economics", 54],
      ["current-affairs", "Current Affairs", 51], ["modern-history", "Modern History", 44],
      ["computer-awareness", "Computer Awareness", 42], ["art-culture", "Art & Culture", 38],
      ["biology", "Biology", 34], ["ancient-history", "Ancient History", 30],
      ["medieval-history", "Medieval History", 30], ["chemistry", "Chemistry", 21],
      ["physics", "Physics", 17], ["science-technology", "Science & Technology", 16],
      ["general-science", "General Science", 10], ["environment", "Environment", 9],
      ["constitution", "Constitution", 1],
    ],
  },
};

export const FULL_MOCK_PROVIDERS = [
  { key: "testbook", label: "Testbook", count: 415 },
  { key: "oliveboard", label: "Oliveboard", count: 1327 },
  { key: "rbe-mocks", label: "RBE Mocks", count: 276 },
  { key: "pundits", label: "Pundits", count: 37 },
];

// Provider name mapping for display
export const PROVIDER_NAME_MAP = {
  'testbook': 'Testbook',
  'oliveboard': 'Oliveboard', 
  'rbe-mocks': 'RBE Mocks',
  'pundits': 'Pundits',
  'Testbook': 'Testbook',
  'Oliveboard': 'Oliveboard',
  'RBE_Mocks': 'RBE Mocks',
  'The Solvers': 'Pundits',
  'Pundits': 'Pundits',
};

// Helper function to normalize provider names
export function normalizeProviderName(provider) {
  const mapping = {
    'Testbook': 'testbook',
    'Oliveboard': 'oliveboard',
    'RBE_Mocks': 'rbe-mocks',
    'The Solvers': 'pundits',
    'Pundits': 'pundits',
  };
  return mapping[provider] || provider.toLowerCase();
}

export const OTHER_EXAMS_COUNT = 142;

export const SUBJECT_PROGRESS_BASE = {
  "quantitative-aptitude": { label: "Quantitative Aptitude", solved: 0, total: 800, acc: 0, color: "#22c55e", icon: Sigma },
  "reasoning": { label: "Reasoning", solved: 0, total: 800, acc: 0, color: "#f97316", icon: Brain },
  "english": { label: "English", solved: 0, total: 800, acc: 0, color: "#3b82f6", icon: BookOpen },
  "general-awareness": { label: "General Awareness", solved: 0, total: 800, acc: 0, color: "#ef4444", icon: Landmark },
};
