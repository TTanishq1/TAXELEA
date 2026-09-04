import { useState, useEffect } from "react";
import { Bookmark, ChevronDown, Play, FileText, Clock, Settings, X } from "lucide-react";
import { Card } from "../components/ui/Card.jsx";
import { SECTIONAL_COUNTS } from "../data/catalog.js";
import { getSectionalCardsBySubject } from "../data/testCards.js";
import { loadTestTimingConfig, saveTestTimingConfig } from "../lib/storage.js";

// Function to generate human-readable name from card data
function getHumanReadableName(card) {
  // If card has a title, extract the specific topic from it
  if (card.title) {
    // Remove common prefixes to get the specific topic
    let specificTopic = card.title
      .replace(/^CGL Tier II CT \d+:\s*/i, '') // Remove "CGL Tier II CT XX: "
      .replace(/^CT \d+:\s*/i, '') // Remove "CT XX: "
      .replace(/^Grammar -\s*/i, '') // Remove "Grammar - "
      .replace(/^Vocabulary -\s*/i, '') // Remove "Vocabulary - "
      .replace(/-\s*\d+$/g, '') // Remove trailing " - 01", " - 02", etc.
      .replace(/-\s*[a-f0-9]{8,}$/g, '') // Remove trailing hash
      .replace(/\.json$/g, '') // Remove .json extension
      .trim();
    
    // If we got a meaningful specific topic, use it
    if (specificTopic && specificTopic.length > 2 && !specificTopic.match(/^[a-f0-9]{8,}$/)) {
      return specificTopic;
    }
  }
  
  // Fallback: Use topic mapping if no specific topic found in title
  const topic = card.topic || '';
  
  // Convert topic to readable format
  const topicMap = {
    'simplification': 'Simplification',
    'geometry': 'Geometry',
    'number-system': 'Number System',
    'mensuration': 'Mensuration',
    'profit-loss': 'Profit & Loss',
    'algebra': 'Algebra',
    'trigonometry': 'Trigonometry',
    'data-interpretation': 'Data Interpretation',
    'average': 'Average',
    'time-work': 'Time & Work',
    'percentage': 'Percentage',
    'time-speed-distance': 'Time, Speed & Distance',
    'ratio-proportion': 'Ratio & Proportion',
    'simple-interest': 'Simple Interest',
    'compound-interest': 'Compound Interest',
    'discount': 'Discount',
    'pipes-cisterns': 'Pipes & Cisterns',
    'boats-streams': 'Boats & Streams',
    'trains': 'Trains',
    'analogy': 'Analogy',
    'coding-decoding': 'Coding-Decoding',
    'figure-based': 'Figure Based',
    'series': 'Series',
    'classification': 'Classification',
    'mathematical-operations': 'Mathematical Operations',
    'blood-relations': 'Blood Relations',
    'syllogism': 'Syllogism',
    'mirror-image': 'Mirror Image',
    'paper-folding': 'Paper Folding',
    'puzzle': 'Puzzle',
    'venn-diagram': 'Venn Diagram',
    'direction-distance': 'Direction & Distance',
    'seating-arrangement': 'Seating Arrangement',
    'calendar': 'Calendar',
    'ranking-order': 'Ranking & Order',
    'statement-conclusion': 'Statement & Conclusion',
    'reading-comprehension': 'Reading Comprehension',
    'idioms-phrases': 'Idioms & Phrases',
    'grammar': 'Grammar',
    'fill-in-the-blanks': 'Fill in the Blanks',
    'vocabulary': 'Vocabulary',
    'cloze-test': 'Cloze Test',
    'error-spotting': 'Error Spotting',
    'active-passive': 'Active/Passive',
    'antonyms': 'Antonyms',
    'synonyms': 'Synonyms',
    'direct-indirect': 'Direct/Indirect',
    'spelling': 'Spelling',
    'one-word-substitution': 'One Word Substitution',
    'para-jumbles': 'Para Jumbles',
    'sentence-improvement': 'Sentence Improvement',
    'tenses': 'Tenses',
    'geography': 'Geography',
    'static-gk': 'Static GK',
    'polity': 'Polity',
    'economics': 'Economics',
    'current-affairs': 'Current Affairs',
    'modern-history': 'Modern History',
    'computer-awareness': 'Computer Awareness',
    'art-culture': 'Art & Culture',
    'biology': 'Biology',
    'ancient-history': 'Ancient History',
    'medieval-history': 'Medieval History',
    'chemistry': 'Chemistry',
    'physics': 'Physics',
    'science-technology': 'Science & Technology',
    'general-science': 'General Science',
    'environment': 'Environment',
    'constitution': 'Constitution'
  };
  
  const readableTopic = topicMap[topic] || topic;
  
  if (readableTopic) {
    return readableTopic;
  }
  
  // Final fallback to title if no mapping found
  return card.title || 'Test';
}

export function SectionalMocks({ startPractice, bookmarks, toggleBookmark, currentUser }) {
  // Filter bookmarks for current user
  const userBookmarks = currentUser ? bookmarks.filter(b => b.userId === currentUser.id) : bookmarks;
  const [openSubject, setOpenSubject] = useState("quantitative-aptitude");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [timingConfig, setTimingConfig] = useState({});
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configuringTest, setConfiguringTest] = useState(null);
  const [configMinutes, setConfigMinutes] = useState(30);
  
  const currentSubjectCards = getSectionalCardsBySubject(openSubject);
  const topicCards = selectedTopic 
    ? currentSubjectCards.filter(card => card.topic === selectedTopic)
    : currentSubjectCards;
  
  // Load timing configuration on mount
  useEffect(() => {
    loadTestTimingConfig().then(setTimingConfig);
  }, []);
  
  const handleConfigureTime = (card) => {
    setConfiguringTest(card);
    setConfigMinutes(timingConfig[card.id] || Math.ceil(card.questionCount / 2) || 30);
    setShowConfigModal(true);
  };
  
  const handleSaveTiming = () => {
    const newConfig = { ...timingConfig, [configuringTest.id]: configMinutes };
    setTimingConfig(newConfig);
    saveTestTimingConfig(newConfig);
    setShowConfigModal(false);
    setConfiguringTest(null);
  };
  
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Sectional Mocks</h1>
        <p className="text-[var(--text-faint)] text-sm mt-1">Topic-wise practice drawn from the real SSC CGL question bank — 2,954 tests across 4 subjects.</p>
      </div>
      <div className="space-y-4">
        {Object.entries(SECTIONAL_COUNTS).map(([key, subj]) => {
          const Icon = subj.icon;
          const open = openSubject === key;
          return (
            <Card key={key} className="overflow-hidden">
              <button onClick={() => setOpenSubject(open ? null : key)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-[var(--hover-bg)]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: subj.color + "22" }}>
                    <Icon size={18} style={{ color: subj.color }} />
                  </div>
                  <div className="text-left">
                    <div className="text-[var(--text-primary)] font-semibold text-sm">{subj.label}</div>
                    <div className="text-xs text-[var(--text-faint)]">{subj.total} tests</div>
                  </div>
                </div>
                <ChevronDown size={16} className={`text-[var(--text-faint)] transition-transform ${open ? "rotate-180" : ""}`} />
              </button>
              {open && (
                <div className="border-t border-[var(--border)]">
                  {/* Topic filter */}
                  <div className="px-4 sm:px-5 py-3 flex flex-wrap gap-2 border-b border-[var(--border)]">
                    <button
                      onClick={() => setSelectedTopic(null)}
                      className={`text-xs px-3 py-1.5 rounded-md ${!selectedTopic ? 'bg-[var(--accent-bg)] text-white' : 'bg-[var(--elevated-bg)] text-[var(--text-secondary)]'}`}
                    >
                      All Topics
                    </button>
                    {subj.topics.map(([tkey, tlabel]) => (
                      <button
                        key={tkey}
                        onClick={() => setSelectedTopic(tkey)}
                        className={`text-xs px-3 py-1.5 rounded-md ${selectedTopic === tkey ? 'bg-[var(--accent-bg)] text-white' : 'bg-[var(--elevated-bg)] text-[var(--text-secondary)]'}`}
                      >
                        {tlabel}
                      </button>
                    ))}
                  </div>
                  
                  {/* Test cards */}
                  <div className="px-4 sm:px-5 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {topicCards.length > 0 ? topicCards.map((card) => {
                      const bookmarked = userBookmarks.includes(card.id);
                      return (
                        <div key={card.id} className="flex items-center justify-between bg-[var(--elevated-bg)] border border-[var(--border)] rounded-lg px-3.5 py-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <FileText size={14} className="text-[var(--text-faint)] flex-shrink-0" />
                              <div className="text-sm text-[var(--text-secondary)] truncate">{getHumanReadableName(card)}</div>
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <div className="text-[11px] text-[var(--text-faint)] flex items-center gap-1">
                                <Clock size={10} /> {timingConfig[card.id] || Math.ceil(card.questionCount / 2) || 30}m
                              </div>
                              <div className="text-[11px] text-[var(--text-faint)]">{card.questionCount} questions</div>
                            </div>
                            {!timingConfig[card.id] && (
                              <div className="text-xs text-amber-500 mt-1">⚠️ Configure time to start</div>
                            )}
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            <button onClick={() => toggleBookmark(card.id, getHumanReadableName(card), card.subject)} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[var(--hover-bg)]">
                              <Bookmark size={13} className={bookmarked ? "text-red-500" : "text-[var(--text-faint)]"} fill={bookmarked ? "#ef4444" : "none"} />
                            </button>
                            <button onClick={() => handleConfigureTime(card)} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[var(--hover-bg)]" title="Configure Time">
                              <Settings size={13} className="text-[var(--text-faint)]" />
                            </button>
                            <button
                              onClick={() => {
                                console.log('Starting sectional test with card:', card);
                                startPractice(card.id, card);
                              }}
                              disabled={!timingConfig[card.id]}
                              className={`text-xs font-medium rounded-md px-2.5 py-1.5 flex items-center gap-1 border ${
                                timingConfig[card.id] 
                                  ? 'text-red-500 border-[var(--accent-soft-border)] hover:bg-[var(--accent-soft-bg)]' 
                                  : 'text-gray-500 border-gray-600 cursor-not-allowed'
                              }`}
                            >
                              <Play size={11} /> Start
                            </button>
                          </div>
                        </div>
                      );
                    }) : (
                      <div className="col-span-full text-center py-8 text-[var(--text-faint)] text-sm">
                        No tests available for this topic yet. More tests coming soon!
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
      
      {/* Configure Time Modal */}
      {showConfigModal && configuringTest && (
        <div className="fixed inset-0 bg-[var(--scrim)] z-50 flex items-center justify-center p-4">
          <Card className="p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Configure Test Time</h3>
              <button onClick={() => setShowConfigModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-muted)]">
                <X size={16} />
              </button>
            </div>
            <div className="mb-4">
              <div className="text-sm text-[var(--text-secondary)] mb-2">{getHumanReadableName(configuringTest)}</div>
              <div className="text-xs text-[var(--text-faint)]">{configuringTest.questionCount} questions</div>
            </div>
            <div className="mb-4">
              <label className="block text-sm text-[var(--text-primary)] mb-2">Duration (minutes)</label>
              <input
                type="number"
                min="1"
                max="300"
                value={configMinutes}
                onChange={(e) => setConfigMinutes(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 rounded-lg border border-[var(--border-strong)] bg-[var(--elevated-bg)] text-[var(--text-primary)] text-sm"
              />
            </div>
            <div className="mb-6">
              <div className="text-xs text-[var(--text-faint)] mb-2">Quick presets:</div>
              <div className="flex flex-wrap gap-2">
                {[15, 30, 45, 60, 90, 120].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setConfigMinutes(preset)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      configMinutes === preset 
                        ? 'bg-[var(--accent)] text-white'
                        : 'bg-[var(--elevated-bg)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]'
                    }`}
                  >
                    {preset}m
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowConfigModal(false)} className="flex-1 border border-[var(--border-strong)] hover:bg-[var(--hover-bg)] text-[var(--text-primary)] text-sm font-medium rounded-lg px-4 py-2.5">
                Cancel
              </button>
              <button onClick={handleSaveTiming} className="flex-1 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium rounded-lg px-4 py-2.5">
                Save Configuration
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
