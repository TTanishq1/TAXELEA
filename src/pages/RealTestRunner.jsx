import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { X, Check, ChevronLeft, ChevronRight, RotateCcw, Clock, Bookmark, BookmarkCheck } from "lucide-react";
import { Card } from "../components/ui/Card.jsx";
import { DonutProgress } from "../components/ui/DonutProgress.jsx";
import { SECTIONAL_COUNTS } from "../data/catalog.js";
import { saveInProgressTest, clearInProgressTest, loadTestTimingConfig } from "../lib/storage.js";

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
  const [timerActive, setTimerActive] = useState(true);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [missingTiming, setMissingTiming] = useState(false);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(() => {
    // ONLY use manual timing configuration - no automatic fallback
    if (!testData) return 0;
    
    const testId = testKey.id || testKey;
    
    // Use manual timing if configured in storage
    const storedTiming = JSON.parse(localStorage.getItem('taxelea:test-timing') || '{}');
    if (storedTiming[testId]) {
      return storedTiming[testId] * 60; // Convert to seconds
    }
    
    // No manual timing configured - return 0 to prevent test start
    return 0;
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
      
      // If no timing configured, set timeLeft to 0 to prevent test start
      if (!timingConfig[testId]) {
        setTimeLeft(0);
        setTimerActive(false);
      }
    }
  }, [testData, testKey, timingConfig]);

  // Save in-progress test state
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
  }, [currentQuestion, answers, markedForReview, visited, timeLeft, submitted, testData, testKey, referrer]);

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
  
  // Detect sections from questions if they have subject information
  const sections = useMemo(() => {
    if (!testData || !questions.length) return [];
    
    // Check if questions have subject/topic information
    const subjects = [...new Set(questions.map(q => q.subject).filter(Boolean))];
    
    if (subjects.length > 1) {
      // Questions are organized by subject
      return subjects.map(subject => {
        const subjectQuestions = questions.filter(q => q.subject === subject);
        return {
          name: subject,
          count: subjectQuestions.length,
          startIndex: questions.indexOf(subjectQuestions[0]),
          color: SECTIONAL_COUNTS[subject]?.color || "#ef4444"
        };
      });
    }
    
    // For full tests without subject metadata, use standard SSC CGL division
    if (testData.exam === 'SSC CGL' && totalQuestions >= 100) {
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
      
      if (userAnswer === undefined) {
        unattempted++;
      } else if (userAnswer === q.correctAnswer) {
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
      
      if (userAnswer === undefined) {
        // Unattempted - no marks
      } else if (userAnswer === q.correctAnswer) {
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
  
  // Get question status for palette
  const getQuestionStatus = (idx) => {
    if (markedForReview.has(idx)) return 'marked';
    if (answers[idx] !== undefined) return 'answered';
    if (visited.has(idx)) return 'visited';
    return 'unvisited';
  };
  
  // Timer effect
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
    
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
  }, [timerActive, timeLeft]);
  
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
                      if (answers[globalIndex] === q.correctAnswer) sectionCorrect++;
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
              const duration = timingConfig[testId] || testData.duration || (testData.questionCount ? Math.ceil(testData.questionCount / 2) : 60);
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
            const correct = userAnswer === q.correctAnswer;
            const attempted = userAnswer !== undefined;
            const marksPerQuestion = testData.marksPerQuestion || 1;
            const negativeMarking = testData.negativeMarking || 0;
            const questionMarks = correct ? marksPerQuestion : (attempted ? -negativeMarking : 0);
            
            return (
              <Card key={i} className="p-4">
                <div className="flex items-start gap-2 mb-3">
                  <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold mt-0.5 ${
                    correct ? "bg-green-600" : attempted ? "bg-red-600" : "bg-[var(--border-strong)]"
                  } text-white`}>
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    {q.questionHtml ? (
                      <div className="text-sm text-[var(--text-secondary)] leading-relaxed" dangerouslySetInnerHTML={{ __html: q.questionHtml }} />
                    ) : (
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        {q.question}
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
                    const isCorrect = o.id === q.correctAnswer;
                    const isPicked = userAnswer === o.id;
                    
                    let className = "text-xs rounded-md px-2.5 py-1.5 border ";
                    if (isCorrect) {
                      className += "border-green-600 bg-green-950/30 text-green-400";
                    } else if (isPicked) {
                      className += "border-red-600 bg-red-950/30 text-red-400";
                    } else {
                      className += "border-[var(--border)] text-[var(--text-muted)]";
                    }
                    
                    return (
                      <div key={o.id} className={className}>
                        <span className="font-semibold mr-1">{o.id}.</span>
                        {o.html ? <span dangerouslySetInnerHTML={{ __html: o.html }} /> : o.text}
                      </div>
                    );
                  })}
                </div>
                
                {q.solution && (
                  <div className="pl-8 p-3 bg-[var(--elevated-bg)] rounded-lg">
                    <div className="text-xs font-semibold text-[var(--text-primary)] mb-1">Solution:</div>
                    <div className="text-xs text-[var(--text-faint)] leading-relaxed" dangerouslySetInnerHTML={{ __html: q.solution }} />
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
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <Card className="p-6 max-w-md w-full">
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Submit Test?</h3>
          <p className="text-[var(--text-secondary)] text-sm mb-4">
            You have answered {Object.keys(answers).length} out of {totalQuestions} questions. 
            {Object.keys(answers).length < totalQuestions && " Unanswered questions will be marked as incorrect."}
          </p>
          <div className="flex gap-3">
            <button onClick={cancelSubmit} className="flex-1 border border-[var(--border-strong)] hover:bg-[var(--hover-bg)] text-[var(--text-primary)] text-sm font-medium rounded-lg px-4 py-2.5">
              Continue Test
            </button>
            <button onClick={confirmSubmit} className="flex-1 bg-red-700 hover:bg-red-600 text-white text-sm font-medium rounded-lg px-4 py-2.5">
              Submit Test
            </button>
          </div>
        </Card>
      </div>
    );
  }

  // Render active test
  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Main question area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-[var(--border)] bg-[var(--bg)] px-4 py-3 flex items-center justify-between">
          <div>
            <div className="text-[var(--text-primary)] font-semibold text-sm">{testData.title}</div>
            <div className="text-xs text-[var(--text-faint)]">
              {testData.provider} · 
              {currentSection && <span className="ml-1" style={{ color: currentSection.color }}>{currentSection.name}</span>}
              · Question {currentQuestion + 1} of {totalQuestions}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-[var(--text-primary)]">
              <Clock size={16} />
              <span className={`font-mono text-sm ${timeLeft < 300 ? 'text-red-500' : ''}`}>
                {formatTime(timeLeft)}
              </span>
              {missingTiming && (
                <span className="text-xs text-amber-500 ml-1" title="Timing not configured">
                  ⚠️
                </span>
              )}
            </div>
            <button onClick={handleExit} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-muted)]">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Question content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-3xl mx-auto space-y-4">
            <Card className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <span className="shrink-0 w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-semibold">
                  {currentQuestion + 1}
                </span>
                <div className="flex-1">
                  {currentQ.questionHtml ? (
                    <div className="text-[15px] text-[var(--text-primary)] leading-relaxed" dangerouslySetInnerHTML={{ __html: currentQ.questionHtml }} />
                  ) : (
                    <p className="text-[15px] text-[var(--text-primary)] leading-relaxed">
                      {currentQ.question}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2.5 ml-10">
                {currentQ.options.map((o) => {
                  const picked = answers[currentQuestion] === o.id;
                  return (
                    <button
                      key={o.id}
                      onClick={() => handleAnswerSelect(o.id)}
                      className={`w-full flex items-center gap-3 text-left rounded-lg px-4 py-3 border transition-colors ${
                        picked ? "border-red-600 bg-red-950/30" : "border-[var(--border-strong)] hover:border-[var(--border-strong)] hover:bg-[var(--hover-bg)]"
                      }`}
                    >
                      <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold border ${
                        picked ? "bg-red-600 border-red-600 text-white" : "border-[var(--border-strong)] text-[var(--text-muted)]"
                      }`}>{o.id}</span>
                      <span className="text-sm text-[var(--text-secondary)]">
                        {o.html ? <span dangerouslySetInnerHTML={{ __html: o.html }} /> : o.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Card>
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

      {/* Question palette sidebar */}
      <div className="w-72 border-l border-[var(--border)] bg-[var(--elevated-bg)] hidden lg:block overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Question Palette</h3>
          
          {sections.length > 1 && (
            <div className="mb-4 space-y-2">
              {sections.map(section => (
                <button
                  key={section.name}
                  onClick={() => handleQuestionClick(section.startIndex)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    currentSection?.name === section.name 
                      ? 'bg-[var(--accent-bg)] text-white' 
                      : 'bg-[var(--hover-bg)] text-[var(--text-secondary)] hover:bg-[var(--border)]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded" style={{ backgroundColor: section.color }} />
                    <span>{section.name}</span>
                  </div>
                  <span>{section.count}</span>
                </button>
              ))}
            </div>
          )}
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded bg-green-600" />
              <span className="text-[var(--text-faint)]">Answered</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded bg-red-600" />
              <span className="text-[var(--text-faint)]">Marked for Review</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded bg-[var(--border-strong)]" />
              <span className="text-[var(--text-faint)]">Not Answered</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded bg-[var(--hover-bg)]" />
              <span className="text-[var(--text-faint)]">Not Visited</span>
            </div>
          </div>
          
          <div className="grid grid-cols-5 gap-2">
            {questions.map((_, i) => {
              const status = getQuestionStatus(i);
              const isCurrent = i === currentQuestion;
              
              let bgClass = "bg-[var(--hover-bg)]";
              if (status === 'answered') bgClass = "bg-green-600";
              else if (status === 'marked') bgClass = "bg-red-600";
              else if (status === 'visited') bgClass = "bg-[var(--border-strong)]";
              
              return (
                <button
                  key={i}
                  onClick={() => handleQuestionClick(i)}
                  className={`w-8 h-8 rounded text-xs font-medium text-white transition-colors ${
                    isCurrent ? 'ring-2 ring-red-500 ring-offset-2' : ''
                  } ${bgClass}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <button
              onClick={handleSubmit}
              className="w-full flex items-center justify-center gap-2 bg-red-700 hover:bg-red-600 text-white text-sm font-medium rounded-lg px-4 py-2.5"
            >
              Submit Test <Check size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}