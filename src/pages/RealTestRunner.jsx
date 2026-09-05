import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X, Check, ChevronLeft, ChevronRight, RotateCcw, Clock, Bookmark, BookmarkCheck, Menu } from "lucide-react";
import { Card } from "../components/ui/Card.jsx";
import { DonutProgress } from "../components/ui/DonutProgress.jsx";
import { SECTIONAL_COUNTS } from "../data/catalog.js";
import { saveInProgressTest, clearInProgressTest, loadTestTimingConfig } from "../lib/storage.js";

// Function to fix existing HTML image tags and convert plain image URLs to img tags
const embedImages = (text) => {
  if (!text) return text;
  
  let fixedText = text;
  
  // Fix existing <img> tags first
  // Fix protocol-relative src attributes: //cdn.testbook.com -> https://cdn.testbook.com
  fixedText = fixedText.replace(/src=["']\/\/(cdn\.testbook\.com|storage\.googleapis\.com)/g, 'src="https://$1');
  
  // Fix double https in src attributes: src="https:https:// -> src="https://
  fixedText = fixedText.replace(/src=["']https:https:\/\//g, 'src="https://');
  
  // Fix broken img tags that might have malformed attributes
  // Pattern: style="..." /> (closing tag without proper img tag structure)
  fixedText = fixedText.replace(/style=["'][^"']*["']\s*\/>/g, '');
  
  // Ensure all img tags have proper error handling
  fixedText = fixedText.replace(/<img([^>]*?)>/g, (match, attributes) => {
    // Check if onerror is already present
    if (!attributes.includes('onerror')) {
      return `<img${attributes} onerror="this.style.display='none';" />`;
    }
    return match;
  });
  
  // Convert plain image URLs to img tags (but not if they're already in img tags)
  // This regex matches URLs that are not part of existing img tags
  const urlNotInImgTag = /(https?:\/\/[^\s<>"']+\.(?:png|jpg|jpeg|gif|webp|svg))(?![^<]*>)/gi;
  
  fixedText = fixedText.replace(urlNotInImgTag, (url) => {
    return `<img src="${url}" alt="Question image" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px;" onerror="this.style.display='none';" />`;
  });
  
  return fixedText;
};

// Question/option HTML sometimes carries inline `color: ...` styles baked in
// from the source material. This used to force any dark color to white,
// which looked fine while the app was dark-only, but makes text invisible
// (white-on-white) now that light mode exists. Instead, strip out only the
// extreme (near-black/near-white) inline colors so the surrounding theme's
// own text color (already correct for either theme) takes over; leave
// mid-range colors (a source's own red/green highlight) untouched.
const fixTextColors = (text) => {
  if (!text) return text;
  
  let fixedText = text;
  
  fixedText = fixedText.replace(/color:\s*rgb\(\s*(0|[1-9]\d{0,2})\s*,\s*(0|[1-9]\d{0,2})\s*,\s*(0|[1-9]\d{0,2})\s*\)\s*;?/gi, (match, r, g, b) => {
    const brightness = (parseInt(r) * 299 + parseInt(g) * 587 + parseInt(b) * 114) / 1000;
    if (brightness < 60 || brightness > 235) return '';
    return match;
  });
  
  fixedText = fixedText.replace(/color:\s*#[0-1][0-9a-f]{5}\s*;?/gi, '');
  fixedText = fixedText.replace(/color:\s*#[e-f][0-9a-f]{5}\s*;?/gi, '');
  fixedText = fixedText.replace(/color:\s*(black|#000000|white|#FFFFFF)\s*;?/gi, '');
  fixedText = fixedText.replace(/color:\s*(darkgray|darkgrey|dimgray|dimgrey)\s*;?/gi, '');
  
  return fixedText;
};

// Function to render LaTeX math using KaTeX
const renderMath = (text) => {
  if (!text) return text;
  
  let processedText = text;
  
  // Check if KaTeX is available
  const katexAvailable = typeof window !== 'undefined' && (window.katex || typeof katex !== 'undefined');
  
  if (!katexAvailable) {
    // If KaTeX is not loaded yet, return text as-is but still fix colors
    return fixTextColors(text);
  }
  
  const katexLib = window.katex || katex;
  
  // Replace math-tex spans with rendered math
  // Pattern: <span class="math-tex">\( ... \)</span> or <span class="math-tex">\[ ... \]</span>
  processedText = processedText.replace(
    /<span class="math-tex">\\?\((.*?)\\?\)<\/span>/g,
    (match, content) => {
      // Inline math
      try {
        return katexLib.renderToString(content, { displayMode: false, throwOnError: false });
      } catch (e) {
        console.error('KaTeX rendering error:', e);
        return match;
      }
    }
  );
  
  processedText = processedText.replace(
    /<span class="math-tex">\\?\[(.*?)\\?\]<\/span>/g,
    (match, content) => {
      // Display math
      try {
        return katexLib.renderToString(content, { displayMode: true, throwOnError: false });
      } catch (e) {
        console.error('KaTeX rendering error:', e);
        return match;
      }
    }
  );
  
  // Also handle inline LaTeX: \( ... \)
  processedText = processedText.replace(
    /\\\((.*?)\\\)/g,
    (match, content) => {
      try {
        return katexLib.renderToString(content, { displayMode: false, throwOnError: false });
      } catch (e) {
        console.error('KaTeX rendering error:', e);
        return match;
      }
    }
  );
  
  // Handle display LaTeX: \[ ... \]
  processedText = processedText.replace(
    /\\\[(.*?)\\\]/g,
    (match, content) => {
      try {
        return katexLib.renderToString(content, { displayMode: true, throwOnError: false });
      } catch (e) {
        console.error('KaTeX rendering error:', e);
        return match;
      }
    }
  );
  
  return processedText;
};

export function RealTestRunner({ testKey, testData: propTestData, onComplete, referrer = '/practice' }) {
  const navigate = useNavigate();
  
  const handleExit = useCallback(() => {
    navigate(referrer);
  }, [referrer, navigate]);
  
  // Use provided test data directly, no need to load again
  const testData = propTestData;
  
  // Test state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [visited, setVisited] = useState(new Set([0]));
  const [submitted, setSubmitted] = useState(false);
  const [timingConfig, setTimingConfig] = useState({});
  const [timerActive, setTimerActive] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [missingTiming, setMissingTiming] = useState(false);
  // Pre-test instructions screen (Testbook-pattern: Instructions -> Agree &
  // Continue -> test begins). Previously the test started immediately with
  // no instructions step at all.
  const [hasStarted, setHasStarted] = useState(false);
  const [, setQuestionStartTime] = useState(Date.now());
  const [showMobilePalette, setShowMobilePalette] = useState(false);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(() => {
    if (!testData) return 0;
    
    const testId = testKey.id || testKey;
    
    // Use manual timing if configured in storage
    const storedTiming = JSON.parse(localStorage.getItem('taxelea:test-timing') || '{}');
    if (storedTiming[testId]) {
      return storedTiming[testId] * 60; // Convert to seconds
    }
    
    // Fallback to test duration if available, otherwise default to 60 minutes
    const defaultDuration = testData.duration || 60;
    return defaultDuration * 60; // Convert to seconds
  });

  // Load timing configuration on mount
  useEffect(() => {
    loadTestTimingConfig().then((config) => {
      setTimingConfig(config);
      // Update timeLeft if timing config exists for this test
      const testId = testKey.id || testKey;
      if (config[testId] && testData) {
        setTimeLeft(config[testId] * 60);
      }
    });
  }, [testData, testKey]);
  
  // Check for missing timing on mount
  useEffect(() => {
    if (testData) {
      const testId = testKey.id || testKey;
      setMissingTiming(!timingConfig[testId]);
      
      // Don't prevent test start - timer will use default duration
      if (!timingConfig[testId]) {
        const defaultDuration = testData.duration || 60;
        setTimeLeft(defaultDuration * 60);
      }
    }
  }, [testData, testKey, timingConfig]);

  // Save in-progress test state.
  // Deliberately does NOT depend on `timeLeft` — it ticks every second, and
  // depending on it here meant a full JSON save of the entire test state
  // (answers, visited, marked, etc.) ran every single second, which could
  // cause jank on longer tests. Progress is saved whenever the user actually
  // does something (answers/navigates/marks); timeLeft is persisted
  // separately below on a much lighter 10-second interval.
  useEffect(() => {
    if (!submitted && testData) {
      const inProgressData = {
        id: testKey.id || testKey,
        title: testData.title,
        totalQuestions: testData.questionCount,
        currentQuestion,
        answeredQuestions: Object.keys(answers).length,
        answers,
        markedForReview: Array.from(markedForReview),
        visited: Array.from(visited),
        timeLeft,
        referrer
      };
      saveInProgressTest(inProgressData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion, answers, markedForReview, visited, submitted, testData, testKey, referrer]);

  // Periodically persist timeLeft (every 10s) so a resumed test doesn't lose
  // too much of the countdown, without writing to storage every tick. Uses a
  // ref snapshot so the interval always reads current values instead of a
  // stale closure from when the interval was first created.
  const latestStateRef = useRef(null);
  latestStateRef.current = { currentQuestion, answers, markedForReview, visited, timeLeft, referrer };

  useEffect(() => {
    if (submitted || !testData) return;
    const persistTimer = setInterval(() => {
      const s = latestStateRef.current;
      saveInProgressTest({
        id: testKey.id || testKey,
        title: testData.title,
        totalQuestions: testData.questionCount,
        currentQuestion: s.currentQuestion,
        answeredQuestions: Object.keys(s.answers).length,
        answers: s.answers,
        markedForReview: Array.from(s.markedForReview),
        visited: Array.from(s.visited),
        timeLeft: s.timeLeft,
        referrer: s.referrer
      });
    }, 10000);
    return () => clearInterval(persistTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted, testData]);

  // Clear in-progress test when submitted or exited
  useEffect(() => {
    if (submitted) {
      clearInProgressTest();
    }
    
    return () => {
      // Clear in-progress test when component unmounts (user exits)
      if (!submitted) {
        clearInProgressTest();
      }
    };
  }, [submitted]);
  
  // Derived values (must be after all hooks)
  const questions = useMemo(() => testData?.questions || [], [testData?.questions]);
  const totalQuestions = questions.length;
  const currentQ = questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  const markedCount = markedForReview.size;
  const notVisitedCount = Math.max(0, totalQuestions - visited.size);
  
  // Keep sections contiguous so tabs and the question palette target the same range.
  const sections = useMemo(() => {
    if (!testData || !questions.length) return [];

    const namedSections = [];
    questions.forEach((question, index) => {
      const subject = question.subject?.trim();
      if (!subject) return;
      const previous = namedSections[namedSections.length - 1];
      if (previous?.name === subject && previous.startIndex + previous.count === index) {
        previous.count += 1;
      } else {
        namedSections.push({ name: subject, count: 1, startIndex: index });
      }
    });

    if (namedSections.length > 1 && namedSections.reduce((sum, section) => sum + section.count, 0) === totalQuestions) {
      return namedSections.map(section => ({
        ...section,
        color: SECTIONAL_COUNTS[section.name]?.color || "#ef4444",
      }));
    }

    // Full mock sources often omit subject metadata. Preserve the standard
    // four-part SSC layout for CGL mocks and use neutral labels elsewhere.
    const isCglMock = /cgl|ssc/i.test(`${testData.title || ''} ${testData.card?.path || ''} ${testData.exam || ''}`);
    if (isCglMock && totalQuestions >= 4) {
      const quarter = Math.floor(totalQuestions / 4);
      return [
        {
          name: 'Reasoning',
          count: quarter,
          startIndex: 0,
          color: SECTIONAL_COUNTS['reasoning']?.color || "#f97316"
        },
        {
          name: 'General Awareness',
          count: quarter,
          startIndex: quarter,
          color: SECTIONAL_COUNTS['general-awareness']?.color || "#ef4444"
        },
        {
          name: 'Quantitative Aptitude',
          count: quarter,
          startIndex: quarter * 2,
          color: SECTIONAL_COUNTS['quantitative-aptitude']?.color || "#22c55e"
        },
        {
          name: 'English',
          count: totalQuestions - (quarter * 3),
          startIndex: quarter * 3,
          color: SECTIONAL_COUNTS['english']?.color || "#3b82f6"
        }
      ];
    }
    
    if (totalQuestions >= 4) {
      const sectionSize = Math.floor(totalQuestions / 4);
      return [
        { name: 'Section 1', count: sectionSize, startIndex: 0, color: '#f97316' },
        { name: 'Section 2', count: sectionSize, startIndex: sectionSize, color: '#ef4444' },
        { name: 'Section 3', count: sectionSize, startIndex: sectionSize * 2, color: '#22c55e' },
        { name: 'Section 4', count: totalQuestions - sectionSize * 3, startIndex: sectionSize * 3, color: '#3b82f6' },
      ];
    }

    // Single section test
    return [{
      name: testData.subject || 'General',
      count: totalQuestions,
      startIndex: 0,
      color: typeof testKey === 'object' ? SECTIONAL_COUNTS[testKey.subject]?.color : "#ef4444"
    }];
  }, [testData, questions, totalQuestions, testKey]);
  
  // Current section
  const currentSection = useMemo(() => {
    return sections.find(section => 
      currentQuestion >= section.startIndex && 
      currentQuestion < section.startIndex + section.count
    ) || sections[0];
  }, [currentQuestion, sections]);
  
  // Handle answer selection
  const handleAnswerSelect = useCallback((optionId) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [currentQuestion]: optionId }));
  }, [currentQuestion, submitted]);
  
  // Handle clear response
  const handleClearResponse = useCallback(() => {
    if (submitted) return;
    setAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[currentQuestion];
      return newAnswers;
    });
  }, [currentQuestion, submitted]);
  
  // Handle mark for review
  const handleMarkForReview = useCallback(() => {
    if (submitted) return;
    setMarkedForReview(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion)) {
        newSet.delete(currentQuestion);
      } else {
        newSet.add(currentQuestion);
      }
      return newSet;
    });
  }, [currentQuestion, submitted]);
  
  // Handle navigation
  const handlePrevious = useCallback(() => {
    if (currentQuestion > 0) {
      const newIdx = currentQuestion - 1;
      setCurrentQuestion(newIdx);
      setVisited(prev => new Set([...prev, newIdx]));
    }
  }, [currentQuestion]);
  
  const handleNext = useCallback(() => {
    if (currentQuestion < totalQuestions - 1) {
      const newIdx = currentQuestion + 1;
      setCurrentQuestion(newIdx);
      setVisited(prev => new Set([...prev, newIdx]));
    }
  }, [currentQuestion, totalQuestions]);
  
  const handleQuestionClick = useCallback((idx) => {
    setCurrentQuestion(idx);
    setVisited(prev => new Set([...prev, idx]));
    setQuestionStartTime(Date.now());
  }, []);

  // Live "time spent on this question" — resets whenever the question
  // changes, ticks every second while the test is active.
  const [questionElapsed, setQuestionElapsed] = useState(0);
  useEffect(() => {
    setQuestionElapsed(0);
    if (!hasStarted || submitted) return;
    const t = setInterval(() => setQuestionElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, [currentQuestion, hasStarted, submitted]);

  const handleStartTest = useCallback(() => {
    setHasStarted(true);
    setTimerActive(true);
    setQuestionStartTime(Date.now());
  }, []);
  
  // Calculate score with marking rules
  const score = useMemo(() => {
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;
    let totalMarks = 0;
    let obtainedMarks = 0;
    let negativeMarks = 0;
    
    // Default marking scheme (can be overridden by test data)
    const marksPerQuestion = testData.marksPerQuestion || 1;
    const negativeMarking = testData.negativeMarking || 0; // 0 means no negative marking
    
    questions.forEach((q, i) => {
      const userAnswer = answers[i];
      totalMarks += marksPerQuestion;
      
      // Support both correctAnswer and answer field names
      const correctAnswer = q.correctAnswer || q.answer;
      
      if (userAnswer === undefined) {
        unattempted++;
      } else if (userAnswer === correctAnswer) {
        correct++;
        obtainedMarks += marksPerQuestion;
      } else {
        incorrect++;
        obtainedMarks -= negativeMarking;
        negativeMarks += negativeMarking;
      }
    });
    
    // Ensure obtained marks doesn't go below 0
    obtainedMarks = Math.max(0, obtainedMarks);
    
    return { 
      correct, 
      incorrect, 
      unattempted, 
      totalMarks, 
      obtainedMarks, 
      negativeMarks,
      accuracy: questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0
    };
  }, [answers, questions, testData]);
  
  // Handle submit with confirmation
  const handleSubmit = useCallback(() => {
    if (submitted) return;
    setShowSubmitConfirm(true);
  }, [submitted]);
  
  // Cancel submit
  const cancelSubmit = useCallback(() => {
    setShowSubmitConfirm(false);
  }, []);
  
  // Confirm submit
  const confirmSubmit = useCallback(() => {
    setShowSubmitConfirm(false);
    setTimerActive(false);
    
    // Calculate current score at time of submission
    let correct = 0;
    let totalMarks = 0;
    let obtainedMarks = 0;
    let negativeMarks = 0;
    
    const marksPerQuestion = testData.marksPerQuestion || 1;
    const negativeMarking = testData.negativeMarking || 0;
    
    questions.forEach((q, i) => {
      const userAnswer = answers[i];
      totalMarks += marksPerQuestion;
      
      // Support both correctAnswer and answer field names
      const correctAnswer = q.correctAnswer || q.answer;
      
      if (userAnswer === undefined) {
        // Unattempted - no marks
      } else if (userAnswer === correctAnswer) {
        correct++;
        obtainedMarks += marksPerQuestion;
      } else {
        obtainedMarks -= negativeMarking;
        negativeMarks += negativeMarking;
      }
    });
    
    obtainedMarks = Math.max(0, obtainedMarks);
    const accuracy = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
    
    onComplete({
      id: "res-" + Date.now(),
      title: testData.title || 'Test',
      provider: testData.provider || 'Unknown',
      score: correct,
      total: questions.length,
      obtainedMarks: obtainedMarks,
      totalMarks: totalMarks,
      negativeMarks: negativeMarks,
      accuracy: accuracy,
      subject: typeof testKey === 'object' ? testKey.subject : 'mixed',
      color: SECTIONAL_COUNTS[typeof testKey === 'object' ? testKey.subject : 'reasoning']?.color || "#ef4444",
    });
    
    setSubmitted(true);
  }, [answers, questions, testData, testKey, onComplete]);
  
  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Get question status for palette — matches the official SSC CBT (Eduquity)
  // 5-state convention. Previously this only had 4 states and collapsed
  // "answered AND marked for review" into just "marked", losing the fact
  // that the question was actually answered.
  const getQuestionStatus = (idx) => {
    const isAnswered = answers[idx] !== undefined;
    const isMarked = markedForReview.has(idx);
    if (isMarked && isAnswered) return 'answered-marked';
    if (isMarked) return 'marked';
    if (isAnswered) return 'answered';
    if (visited.has(idx)) return 'visited';
    return 'unvisited';
  };
  
  // Timer effect
  // Note: only depends on `timerActive`, not `timeLeft`. Previously `timeLeft`
  // was also a dependency, and since the interval itself updates timeLeft
  // every second, that meant the interval was destroyed and recreated every
  // single tick — wasted work that could cause jank on longer tests.
  useEffect(() => {
    if (!timerActive) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setTimerActive(false);
          setShowSubmitConfirm(true); // Show confirmation dialog
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timerActive]);
  
  // Early returns after all hooks
  if (!testData || !testData.questions || testData.questions.length === 0) {
    return (
      <div className="p-4 sm:p-6 max-w-3xl mx-auto">
        <Card className="p-6 text-center">
          <div className="text-red-500 mb-2">Test data not available</div>
          <div className="text-[var(--text-faint)] text-sm mb-4">
            Test key: {typeof testKey === 'string' ? testKey : testKey?.id}
          </div>
          <button onClick={handleExit} className="text-sm text-[var(--text-primary)] hover:underline">
            Back to Dashboard
          </button>
        </Card>
      </div>
    );
  }
  
  // Check if timing is configured before allowing test to start
  if (timeLeft === 0 && !submitted) {
    return (
      <div className="p-4 sm:p-6 max-w-3xl mx-auto">
        <Card className="p-6 text-center">
          <div className="text-amber-500 mb-2">⚠️ Test Time Not Configured</div>
          <div className="text-[var(--text-secondary)] text-sm mb-4">
            Please configure the test duration before starting. Use the "Configure Time" button on the test card.
          </div>
          <div className="text-[var(--text-faint)] text-xs mb-4">
            Test: {testData.title}
          </div>
          <button onClick={handleExit} className="text-sm text-[var(--text-primary)] hover:underline">
            Back to Test Selection
          </button>
        </Card>
      </div>
    );
  }
  
  // Pre-test instructions screen — shown once, before the timer starts.
  // Matches the reference pattern: title, duration/marks, rules, Agree & Continue.
  if (!hasStarted && !submitted) {
    const marksPerQuestion = testData.marksPerQuestion || 1;
    const negativeMarking = testData.negativeMarking || 0;
    const durationMins = Math.round(timeLeft / 60);
    const maxMarks = totalQuestions * marksPerQuestion;
    return (
      <div className="min-h-screen bg-[var(--bg)] p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <button onClick={handleExit} className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm mb-4">
            <ChevronLeft size={18} /> Your Tests
          </button>

          <Card className="p-6 sm:p-8">
            <h1 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mb-1">{testData.title}</h1>
            <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)] mb-6">
              <span>Duration: {durationMins} Mins.</span>
              <span>Maximum Marks: {maxMarks.toFixed(1)}</span>
            </div>

            <ul className="space-y-3 text-sm text-[var(--text-secondary)] mb-6">
              <li>• The test contains {totalQuestions} total questions.</li>
              <li>• Each question has {currentQ?.options?.length || 4} options out of which only one is correct.</li>
              <li>• You have to finish the test in {durationMins} minutes.</li>
              <li>
                • You will be awarded {marksPerQuestion} mark{marksPerQuestion !== 1 ? 's' : ''} for each correct answer
                {negativeMarking > 0 ? ` and ${negativeMarking} will be deducted for each wrong answer.` : ', with no negative marking.'}
              </li>
              <li>• There is no negative marking for questions that you have not attempted.</li>
              <li>• Please ensure a stable internet/device connection — your progress is saved automatically as you go, but finishing in one sitting gives the most realistic practice.</li>
            </ul>

            {missingTiming && (
              <div className="mb-6 p-3 bg-[var(--accent-soft-bg)] border border-[var(--accent-soft-border)] rounded-lg text-sm text-[var(--text-primary)]">
                ⚠️ No custom time was configured for this test — using the default duration ({durationMins} min). You can set a custom duration from the test list before starting next time.
              </div>
            )}

            <button
              onClick={handleStartTest}
              className="w-full bg-red-700 hover:bg-red-600 text-white text-sm font-semibold rounded-lg px-4 py-3.5 transition-colors"
            >
              Agree and Continue
            </button>
          </Card>
        </div>
      </div>
    );
  }

  // Render submitted state
  if (submitted) {
    return (
      <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-4 sm:space-y-5">
        <Card className="p-5 sm:p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <DonutProgress value={score.accuracy} size={120} stroke={10} color="#ef4444" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-[var(--text-primary)]">{score.accuracy}%</span>
                <span className="text-xs text-[var(--text-faint)]">Accuracy</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center mb-4">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-20 h-20 object-contain rounded-lg"
              style={{ maxWidth: '80px', maxHeight: '80px' }}
            >
              <source src="/dancing-celebration.mp4" type="video/mp4" />
            </video>
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Test Completed!</h2>
          <p className="text-[var(--text-faint)] text-sm mb-6">{testData.title} · {testData.provider}</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{score.obtainedMarks}</div>
              <div className="text-xs text-[var(--text-faint)]">Marks Obtained</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--text-primary)]">{score.totalMarks}</div>
              <div className="text-xs text-[var(--text-faint)]">Total Marks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">-{score.negativeMarks}</div>
              <div className="text-xs text-[var(--text-faint)]">Negative</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--text-primary)]">{score.correct}/{totalQuestions}</div>
              <div className="text-xs text-[var(--text-faint)]">Correct</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{score.correct}</div>
              <div className="text-xs text-[var(--text-faint)]">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{score.incorrect}</div>
              <div className="text-xs text-[var(--text-faint)]">Incorrect</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--text-faint)]">{score.unattempted}</div>
              <div className="text-xs text-[var(--text-faint)]">Unattempted</div>
            </div>
          </div>
          
          {sections.length > 1 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Section-wise Performance</h3>
              <div className="space-y-2">
                {sections.map(section => {
                  const sectionQuestions = questions.slice(section.startIndex, section.startIndex + section.count);
                  let sectionCorrect = 0;
                  let sectionAttempted = 0;
                  
                  sectionQuestions.forEach((q, i) => {
                    const globalIndex = section.startIndex + i;
                    if (answers[globalIndex] !== undefined) {
                      sectionAttempted++;
                      // Support both correctAnswer and answer field names
                      const correctAnswer = q.correctAnswer || q.answer;
                      if (answers[globalIndex] === correctAnswer) sectionCorrect++;
                    }
                  });
                  
                  const sectionAccuracy = sectionAttempted > 0 ? Math.round((sectionCorrect / sectionAttempted) * 100) : 0;
                  
                  return (
                    <div key={section.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: section.color }} />
                        <span className="text-[var(--text-secondary)]">{section.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[var(--text-faint)]">{sectionCorrect}/{section.count}</span>
                        <span className="font-semibold text-[var(--text-primary)]">{sectionAccuracy}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-center gap-3">
            <button onClick={handleExit} className="flex items-center gap-2 border border-[var(--border-strong)] hover:bg-[var(--hover-bg)] text-[var(--text-primary)] text-sm font-medium rounded-lg px-5 py-2.5">
              Back to Dashboard
            </button>
            <button onClick={() => { 
              setSubmitted(false); 
              setAnswers({}); 
              setMarkedForReview(new Set());
              setVisited(new Set([0]));
              setCurrentQuestion(0);
              const testId = testKey.id || testKey;
              const duration = timingConfig[testId] || testData.duration || 60;
              setTimeLeft(duration * 60);
              setTimerActive(true);
            }} className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white text-sm font-medium rounded-lg px-5 py-2.5">
              <RotateCcw size={14} /> Retry
            </button>
          </div>
        </Card>

        <div className="space-y-3">
          {questions.map((q, i) => {
            const userAnswer = answers[i];
            // Support both correctAnswer and answer field names
            const correctAnswer = q.correctAnswer || q.answer;
            const correct = userAnswer === correctAnswer;
            const attempted = userAnswer !== undefined;
            const marksPerQuestion = testData.marksPerQuestion || 1;
            const negativeMarking = testData.negativeMarking || 0;
            const questionMarks = correct ? marksPerQuestion : (attempted ? -negativeMarking : 0);
            
            return (
              <Card key={i} className="p-4">
                <div className="flex items-start gap-2 mb-3">
                  <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold mt-0.5 ${
                    correct ? "bg-green-600 text-white" : attempted ? "bg-red-600 text-white" : "bg-[var(--border-strong)] text-[var(--text-primary)]"
                  }`}>
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    {q.questionHtml ? (
                      <div className="text-sm text-[var(--text-primary)] leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: fixTextColors(renderMath(embedImages(q.questionHtml))) }} />
                    ) : q.question ? (
                      <p className="text-sm text-[var(--text-primary)] leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: fixTextColors(renderMath(embedImages(q.question))) }} />
                    ) : q.q ? (
                      <p className="text-sm text-[var(--text-primary)] leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: fixTextColors(renderMath(embedImages(q.q))) }} />
                    ) : (
                      <p className="text-sm text-[var(--text-primary)] leading-relaxed font-medium">
                        Question text not available
                      </p>
                    )}
                  </div>
                  <div className={`text-xs font-semibold ${
                    correct ? "text-green-600" : attempted ? "text-red-600" : "text-[var(--text-faint)]"
                  }`}>
                    {questionMarks > 0 ? `+${questionMarks}` : questionMarks < 0 ? questionMarks : '0'}
                  </div>
                </div>
                
                <div className="pl-8 grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  {q.options.map((o) => {
                    // Support both correctAnswer and answer field names
                    const correctAnswer = q.correctAnswer || q.answer;
                    const isCorrect = o.id === correctAnswer;
                    const isPicked = userAnswer === o.id;
                    
                    let className = "text-xs rounded-md px-2.5 py-1.5 border ";
                    if (isCorrect) {
                      className += "border-[var(--ok-border)] bg-[var(--ok-bg)] text-[var(--ok-text)]";
                    } else if (isPicked) {
                      className += "border-[var(--danger-border)] bg-[var(--danger-bg)] text-[var(--danger-text)]";
                    } else {
                      className += "border-[var(--border)] text-[var(--text-muted)]";
                    }
                    
                    return (
                      <div key={o.id} className={className}>
                        <span className="font-semibold mr-1">{o.id}.</span>
                        <span>
                          {o.html ? <span dangerouslySetInnerHTML={{ __html: fixTextColors(renderMath(embedImages(o.html))) }} /> : <span dangerouslySetInnerHTML={{ __html: fixTextColors(renderMath(embedImages(o.text))) }} />}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                {q.solution && (
                  <div className="pl-8 p-3 bg-[var(--elevated-bg)] rounded-lg">
                    <div className="text-xs font-semibold text-[var(--text-primary)] mb-1">Solution:</div>
                    <div className="text-xs text-[var(--text-primary)] leading-relaxed" dangerouslySetInnerHTML={{ __html: fixTextColors(renderMath(embedImages(q.solution))) }} />
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Render submit confirmation dialog
  if (showSubmitConfirm) {
    return (
      <div className="fixed inset-0 bg-[var(--scrim)] z-50 flex items-center justify-center p-4">
        <Card className="p-5 sm:p-7 max-w-3xl w-full shadow-2xl">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-red-500 mb-1">Final review</p>
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Review test before submitting</h3>
              <p className="text-[var(--text-secondary)] text-sm mt-1">Check your response summary before locking this attempt.</p>
            </div>
            <button onClick={cancelSubmit} aria-label="Close review" className="w-8 h-8 shrink-0 flex items-center justify-center rounded-md hover:bg-[var(--hover-bg)] text-[var(--text-muted)]">
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 border border-[var(--border)] rounded-xl overflow-hidden mb-6">
            {[
              ['Answered', answeredCount, 'text-green-600'],
              ['Not answered', totalQuestions - answeredCount, 'text-[var(--text-primary)]'],
              ['Marked review', markedCount, 'text-purple-500'],
              ['Visited', visited.size, 'text-blue-500'],
              ['Not visited', notVisitedCount, 'text-[var(--text-muted)]'],
            ].map(([label, value, tone]) => (
              <div key={label} className="px-4 py-3.5 border-b sm:border-b-0 sm:border-r last:border-r-0 border-[var(--border)]">
                <div className="text-[11px] text-[var(--text-faint)]">{label}</div>
                <div className={`text-xl font-bold mt-1 ${tone}`}>{value}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button onClick={cancelSubmit} className="border border-[var(--border-strong)] hover:bg-[var(--hover-bg)] text-[var(--text-primary)] text-sm font-semibold rounded-lg px-5 py-2.5">
              Continue test
            </button>
            <button onClick={confirmSubmit} className="bg-red-700 hover:bg-red-600 text-white text-sm font-semibold rounded-lg px-5 py-2.5">
              Submit test
            </button>
          </div>
        </Card>
      </div>
    );
  }

  // Render active test
  return (
    <div className="flex flex-col lg:flex-row h-full min-h-0 bg-[var(--bg)] p-3 sm:p-4">
      {/* Main question area */}
      <div className="flex-1 flex flex-col overflow-hidden rounded-[18px] border border-[var(--border)] bg-[var(--bg)]">
        {/* Header */}
        <div className="border-b border-[var(--border)] bg-[var(--card-bg)] px-4 py-3 sm:px-6 rounded-t-[18px]">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
            <button onClick={handleExit} className="w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--border)] hover:bg-[var(--hover-bg)] text-[var(--text-muted)]" title="Exit test">
              <X size={16} />
            </button>
            <div className="min-w-0 text-left">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0" />
                <h1 className="text-sm sm:text-base font-bold text-[var(--text-primary)] truncate" title={testData.title}>{testData.title}</h1>
              </div>
              <p className="text-[11px] text-[var(--text-faint)] mt-0.5">{currentSection?.name || 'All questions'} · Question {currentQuestion + 1} of {totalQuestions}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <div className={`hidden sm:flex items-center gap-2 rounded-lg border border-[var(--border)] px-2.5 py-1.5 ${timeLeft < 300 ? 'border-red-500/50 bg-red-500/10' : 'bg-[var(--elevated-bg)]'}`}>
                <Clock size={14} className={timeLeft < 300 ? 'text-red-500' : 'text-[var(--text-muted)]'} />
                <span className={`font-mono text-sm font-bold ${timeLeft < 300 ? 'text-red-500' : 'text-[var(--text-primary)]'}`}>{formatTime(timeLeft)}</span>
              </div>
              <button
                onClick={() => setShowMobilePalette(true)}
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--border)] hover:bg-[var(--hover-bg)] text-[var(--text-muted)]"
                title="Question Palette"
              >
                <Menu size={18} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-[var(--border)]">
            <span className="text-xs text-[var(--text-secondary)]">
              Responses saved <span className="font-semibold text-[var(--text-primary)]">{answeredCount}/{totalQuestions}</span>
            </span>
            <span className={`sm:hidden font-mono text-sm font-bold ${timeLeft < 300 ? 'text-red-500' : 'text-[var(--text-primary)]'}`}>{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Section tabs — Eduquity/official SSC CBT convention: subjects are
            navigable as a horizontal tab strip directly under the header,
            not only reachable via the sidebar list. */}
        {sections.length > 1 && (
          <div className="border-b border-[var(--border)] bg-[var(--card-bg)] px-4 py-2 flex items-center gap-1.5 overflow-x-auto">
            {sections.map(section => {
              const sectionQs = questions.slice(section.startIndex, section.startIndex + section.count);
              const answeredInSection = sectionQs.filter((_, i) => answers[section.startIndex + i] !== undefined).length;
              const isActive = currentSection?.name === section.name;
              return (
                <button
                  key={section.name}
                  onClick={() => handleQuestionClick(section.startIndex)}
                  className={`shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'text-[var(--text-primary)]'
                      : 'text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)]'
                  }`}
                  style={isActive ? { borderBottomColor: section.color } : undefined}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: section.color }} />
                  {section.name}
                  <span className="text-[10px] text-[var(--text-faint)]">{answeredInSection}/{section.count}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Question content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[var(--bg)]">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="rounded-[18px] border border-[var(--border)] bg-[var(--card-bg)] overflow-hidden shadow-[var(--shadow)]">
              <div className="px-5 sm:px-7 py-3 bg-[var(--card-bg)] border-b border-[var(--border)] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]">
                  <span className="w-6 h-6 rounded-md bg-[var(--accent-soft-bg)] text-[var(--text-primary)] border border-[var(--border-strong)] flex items-center justify-center">{currentQuestion + 1}</span>
                  Question {currentQuestion + 1}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-faint)]"><Clock size={13} /> {formatTime(questionElapsed)}</div>
              </div>
              <div className="p-5 sm:p-7">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[var(--border)]">
                <span className="text-xs text-[var(--text-faint)]">Choose one answer</span>
                <div className="flex-1" />
                <button
                  onClick={handleMarkForReview}
                  className={`w-7 h-7 flex items-center justify-center rounded-md hover:bg-[var(--hover-bg)] ${
                    markedForReview.has(currentQuestion) ? 'text-purple-500' : 'text-[var(--text-faint)]'
                  }`}
                  title={markedForReview.has(currentQuestion) ? 'Unmark' : 'Mark for Review'}
                >
                  {markedForReview.has(currentQuestion) ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                </button>
              </div>

              <div className="flex items-start gap-3 mb-4">
                <div className="flex-1">
                  {currentQ.questionHtml ? (
                    <div className="text-[17px] text-[var(--text-primary)] leading-relaxed font-semibold" dangerouslySetInnerHTML={{ __html: fixTextColors(renderMath(embedImages(currentQ.questionHtml))) }} />
                  ) : currentQ.question ? (
                    <p className="text-[17px] text-[var(--text-primary)] leading-relaxed font-semibold" dangerouslySetInnerHTML={{ __html: fixTextColors(renderMath(embedImages(currentQ.question))) }} />
                  ) : currentQ.q ? (
                    <p className="text-[17px] text-[var(--text-primary)] leading-relaxed font-semibold" dangerouslySetInnerHTML={{ __html: fixTextColors(renderMath(embedImages(currentQ.q))) }} />
                  ) : (
                    <p className="text-[17px] text-[var(--text-primary)] leading-relaxed font-semibold">
                      Question text not available
                    </p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2.5">
                {currentQ.options.map((o) => {
                  const picked = answers[currentQuestion] === o.id;
                  return (
                    <button
                      key={o.id}
                      onClick={() => handleAnswerSelect(o.id)}
                      className={`w-full flex items-center gap-3 text-left rounded-xl px-4 py-3.5 border transition-all duration-200 ${
                        picked ? "border-[var(--accent)] bg-[var(--accent-soft-bg)] shadow-[0_0_0_1px_rgba(29,155,240,0.16)]" : "border-[var(--border)] bg-[var(--elevated-bg)] hover:bg-[var(--hover-bg)]"
                      }`}
                    >
                      <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border ${
                        picked ? "bg-[var(--accent)] border-[var(--accent)] text-white" : "border-[var(--border-strong)] text-[var(--text-primary)] bg-[var(--input-bg)]"
                      }`}>{o.id}</span>
                      <span className="text-sm text-[var(--text-primary)] font-medium">
                        {o.html ? <span dangerouslySetInnerHTML={{ __html: fixTextColors(renderMath(embedImages(o.html))) }} /> : <span dangerouslySetInnerHTML={{ __html: fixTextColors(renderMath(embedImages(o.text))) }} />}
                      </span>
                    </button>
                  );
                })}
              </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer controls */}
        <div className="border-t border-[var(--border)] bg-[var(--bg)] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearResponse}
              disabled={!answers[currentQuestion]}
              className="text-xs text-[var(--text-muted)] disabled:opacity-30 hover:text-[var(--text-primary)] px-3 py-1.5 rounded hover:bg-[var(--hover-bg)]"
            >
              Clear Response
            </button>
            <button
              onClick={handleMarkForReview}
              className={`text-xs flex items-center gap-1 px-3 py-1.5 rounded hover:bg-[var(--hover-bg)] ${
                markedForReview.has(currentQuestion) ? 'text-purple-500' : 'text-[var(--text-muted)]'
              }`}
            >
              {markedForReview.has(currentQuestion) ? <BookmarkCheck size={12} /> : <Bookmark size={12} />}
              {markedForReview.has(currentQuestion) ? 'Unmark' : 'Mark for Review'}
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] disabled:opacity-30 hover:text-[var(--text-primary)] px-3 py-1.5 rounded hover:bg-[var(--hover-bg)]"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            
            {currentQuestion === totalQuestions - 1 ? (
              <button onClick={handleSubmit} className="flex items-center gap-1.5 text-sm font-medium text-white bg-red-700 hover:bg-red-600 rounded-lg px-4 py-2">
                Submit Test <Check size={15} />
              </button>
            ) : (
              <>
                <button onClick={handleNext} className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] px-3 py-1.5 rounded hover:bg-[var(--hover-bg)]">
                  Save & Next <ChevronRight size={16} />
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-1.5 text-sm font-medium text-white bg-red-700 hover:bg-red-600 rounded-lg px-4 py-2"
                >
                  Submit Test <Check size={15} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Question palette — desktop: fixed sidebar. Mobile: slide-over drawer
          triggered by the header's hamburger button (previously this panel
          was `hidden lg:block` with zero mobile access at all — no way to
          jump to another question or see progress on a phone). */}
      {showMobilePalette && (
        <div className="fixed inset-0 bg-[var(--scrim)] z-40 lg:hidden" onClick={() => setShowMobilePalette(false)} />
      )}
      <div className={`w-[330px] border-l border-[var(--border)] bg-[var(--card-bg)] overflow-y-auto
        fixed lg:static inset-y-0 right-0 z-50 transition-transform duration-200 p-4
        ${showMobilePalette ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-3 lg:hidden">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Question Palette</h3>
            <button onClick={() => setShowMobilePalette(false)} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[var(--hover-bg)] text-[var(--text-muted)]">
              <X size={16} />
            </button>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--elevated-bg)] p-3 mb-2">
            <div className="flex items-center justify-between text-[11px] text-[var(--text-faint)] mb-2">
              <span>Time Left</span>
              <span className="text-[var(--text-primary)] font-semibold">{formatTime(timeLeft)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2"> 
              <button className="rounded-lg border border-[var(--border)] bg-[var(--card-bg)] py-2 text-xs text-[var(--text-secondary)]">End Test</button>
              <button className="rounded-lg bg-[var(--accent)] text-white py-2 text-xs font-semibold">Pause</button>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--elevated-bg)] p-3">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3 hidden lg:block">Question Palette</h3>
            <div className="flex items-center justify-between gap-2 mb-3 text-[10px] text-[var(--text-faint)]">
              <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-green-600" />Answered</span>
              <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[var(--border-strong)]" />Unanswered</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, i) => {
                const status = getQuestionStatus(i);
                const isCurrent = i === currentQuestion;

                let bgClass = "bg-[var(--hover-bg)]";
                let textClass = "text-[var(--text-primary)]";
                if (status === 'answered') { bgClass = "bg-green-600"; textClass = "text-white"; }
                else if (status === 'marked') { bgClass = "bg-red-600"; textClass = "text-white"; }
                else if (status === 'answered-marked') { bgClass = "bg-purple-600"; textClass = "text-white"; }
                else if (status === 'visited') { bgClass = "bg-[var(--border-strong)]"; textClass = "text-[var(--text-primary)]"; }

                return (
                  <button
                    key={i}
                    onClick={() => { handleQuestionClick(i); setShowMobilePalette(false); }}
                    className={`relative w-10 h-10 rounded-md text-xs font-medium transition-colors ${textClass} ${
                      isCurrent ? 'ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--elevated-bg)]' : ''
                    } ${bgClass}`}
                  >
                    {i + 1}
                    {status === 'answered-marked' && (
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-green-500 border border-[var(--elevated-bg)]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--elevated-bg)] p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-[var(--text-primary)]">Section Progress</span>
              <span className="text-xs text-[var(--text-faint)]">{Math.min(answeredCount, totalQuestions)} / {totalQuestions}</span>
            </div>
            <div className="h-2 rounded-full bg-[var(--track-bg)] overflow-hidden">
              <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${(answeredCount / totalQuestions) * 100}%` }} />
            </div>
            <div className="mt-2 text-right text-xs text-[var(--text-faint)]">{Math.round((answeredCount / totalQuestions) * 100)}%</div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button className="flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--elevated-bg)] text-[var(--text-primary)] text-sm font-medium py-3">
              <span className="text-base">▣</span> Question Paper
            </button>
            <button onClick={handleSubmit} className="flex items-center justify-center gap-2 rounded-lg bg-[var(--accent)] text-white text-sm font-semibold py-3">
              <span className="text-base">✓</span> Submit Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
