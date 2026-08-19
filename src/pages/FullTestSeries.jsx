import { useState, useEffect } from "react";
import { ArrowRight, Play, FileText, Clock, Settings, X } from "lucide-react";
import { Card } from "../components/ui/Card.jsx";
import { FULL_MOCK_PROVIDERS, OTHER_EXAMS_COUNT } from "../data/catalog.js";
import { getFullTestCardsByProvider } from "../data/testCards.js";
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

export function FullTestSeries({ startPractice }) {
  const [selectedProvider, setSelectedProvider] = useState("testbook");
  const [timingConfig, setTimingConfig] = useState({});
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configuringTest, setConfiguringTest] = useState(null);
  const [configMinutes, setConfigMinutes] = useState(60);
  
  const currentProviderCards = getFullTestCardsByProvider(selectedProvider);
  
  // Load timing configuration on mount
  useEffect(() => {
    loadTestTimingConfig().then(setTimingConfig);
  }, []);
  
  const handleConfigureTime = (card) => {
    setConfiguringTest(card);
    setConfigMinutes(timingConfig[card.id] || card.duration || 60);
    setShowConfigModal(true);
  };
  
  const handleSaveTiming = () => {
    const newConfig = { ...timingConfig, [configuringTest.id]: configMinutes };
    setTimingConfig(newConfig);
    saveTestTimingConfig(newConfig);
    setShowConfigModal(false);
    setConfiguringTest(null);
  };
  
  const handleCardClick = (providerKey) => {
    setSelectedProvider(providerKey);
  };
  
  const handleBrowseClick = (e, providerKey) => {
    e.stopPropagation();
    setSelectedProvider(providerKey);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Full Test Series</h1>
        <p className="text-[var(--text-faint)] text-sm mt-1">Complete multi-subject mocks, organized by provider — 2,055 SSC CGL mocks + 142 other-exam mocks.</p>
      </div>

          {/* Provider selection */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {FULL_MOCK_PROVIDERS.map((p) => (
              <Card 
                key={p.key} 
                className={`p-5 cursor-pointer transition-all ${selectedProvider === p.key ? 'border-red-500 border-2' : ''}`}
                onClick={() => handleCardClick(p.key)}
              >
                <div className="text-[var(--text-primary)] font-semibold text-sm mb-1">{p.label}</div>
                <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">{p.count}</div>
                <div className="text-xs text-[var(--text-faint)] mb-4">full-length SSC CGL mocks</div>
                <button
                  onClick={(e) => handleBrowseClick(e, p.key)}
                  className="w-full flex items-center justify-center gap-2 border border-[var(--border-strong)] hover:bg-[var(--hover-bg)] text-[var(--text-primary)] text-xs font-medium rounded-lg py-2"
                >
                  Browse <ArrowRight size={13} />
                </button>
              </Card>
            ))}
          </div>
          
          <Card className="p-5">
            <div className="flex items-center justify-between mb-1">
              <div className="text-[var(--text-primary)] font-semibold text-sm">Other Exams</div>
              <span className="text-xs text-[var(--text-faint)]">{OTHER_EXAMS_COUNT} mocks</span>
            </div>
            <p className="text-xs text-[var(--text-faint)] mb-3">SSC CHSL, CPO, Stenographer, Selection Post, RRB/NTPC and more.</p>
          </Card>
          
          {/* Test cards for selected provider */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[var(--text-primary)] font-semibold text-sm">
                {FULL_MOCK_PROVIDERS.find(p => p.key === selectedProvider)?.label} Tests
              </div>
              <div className="text-xs text-[var(--text-faint)]">{currentProviderCards.length} tests available</div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {currentProviderCards.length > 0 ? currentProviderCards.map((card) => (
                <div key={card.id} className="flex items-center justify-between bg-[var(--elevated-bg)] border border-[var(--border)] rounded-lg px-3.5 py-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-[var(--text-faint)] flex-shrink-0" />
                      <div className="text-sm text-[var(--text-secondary)] truncate">{getHumanReadableName(card)}</div>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="text-[11px] text-[var(--text-faint)] flex items-center gap-1">
                        <Clock size={10} /> {timingConfig[card.id] || card.duration}m
                      </div>
                      <div className="text-[11px] text-[var(--text-faint)]">{card.questionCount} questions</div>
                    </div>
                    {!timingConfig[card.id] && (
                      <div className="text-xs text-amber-500 mt-1">⚠️ Configure time to start</div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <button onClick={() => handleConfigureTime(card)} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[var(--hover-bg)]" title="Configure Time">
                      <Settings size={13} className="text-[var(--text-faint)]" />
                    </button>
                    <button
                      onClick={() => {
                        console.log('Starting test with card:', card);
                        startPractice(card.id, card);
                      }}
                      disabled={!timingConfig[card.id]}
                      className={`flex items-center gap-1.5 text-white text-xs font-medium rounded-lg px-3.5 py-2 ${
                        timingConfig[card.id] 
                          ? 'bg-red-700 hover:bg-red-600' 
                          : 'bg-gray-600 cursor-not-allowed'
                      }`}
                    >
                      <Play size={12} /> Start
                    </button>
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center py-8 text-[var(--text-faint)] text-sm">
                  No tests available for this provider yet. More tests coming soon!
                </div>
              )}
            </div>
          </Card>
      
      {/* Configure Time Modal */}
      {showConfigModal && configuringTest && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
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
                {[30, 45, 60, 90, 120, 150, 180].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setConfigMinutes(preset)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      configMinutes === preset 
                        ? 'bg-red-700 text-white' 
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
              <button onClick={handleSaveTiming} className="flex-1 bg-red-700 hover:bg-red-600 text-white text-sm font-medium rounded-lg px-4 py-2.5">
                Save Configuration
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
