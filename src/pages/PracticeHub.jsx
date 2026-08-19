import { useState, useEffect } from "react";
import { Layers, Play, Clock, Settings, X } from "lucide-react";
import { Card } from "../components/ui/Card.jsx";
import { SECTIONAL_COUNTS } from "../data/catalog.js";
import { SECTIONAL_TEST_CARDS } from "../data/testCards.js";
import { loadTestTimingConfig, saveTestTimingConfig } from "../lib/storage.js";

export function PracticeHub({ startPractice }) {
  const [timingConfig, setTimingConfig] = useState({});
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configuringTest, setConfiguringTest] = useState(null);
  const [configMinutes, setConfigMinutes] = useState(30);
  
  // Get a sample of sectional test cards for practice
  const practiceCards = SECTIONAL_TEST_CARDS.slice(0, 12);
  
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
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Practice</h1>
        <p className="text-[var(--text-faint)] text-sm mt-1">Real questions, real solutions — pulled straight from the test bank.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {practiceCards.map((card) => {
          const subjMeta = SECTIONAL_COUNTS[card.subject];
          const color = subjMeta ? subjMeta.color : "#ef4444";
          const Icon = subjMeta ? subjMeta.icon : Layers;
          return (
            <Card key={card.id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + "22" }}>
                  <Icon size={17} style={{ color }} />
                </div>
                <button 
                  onClick={() => handleConfigureTime(card)} 
                  className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[var(--hover-bg)]" 
                  title="Configure Time"
                >
                  <Settings size={13} className="text-[var(--text-faint)]" />
                </button>
              </div>
              <div className="text-[var(--text-primary)] font-semibold text-sm mb-1">{card.title}</div>
              <div className="flex items-center gap-3 text-xs text-[var(--text-faint)] mb-4">
                <span className="flex items-center gap-1">
                  <Clock size={10} /> {timingConfig[card.id] || Math.ceil(card.questionCount / 2) || 30}m
                </span>
                <span>{card.questionCount} questions</span>
                <span>{card.provider}</span>
              </div>
              <button 
                onClick={() => startPractice(card.id, card)} 
                className="w-full flex items-center justify-center gap-2 bg-red-700 hover:bg-red-600 text-white text-xs font-medium rounded-lg py-2.5"
                disabled={!timingConfig[card.id]}
              >
                <Play size={12} /> Start Practice
              </button>
              {!timingConfig[card.id] && (
                <div className="text-xs text-amber-500 text-center mt-2">⚠️ Configure time to start</div>
              )}
            </Card>
          );
        })}
      </div>
      
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
              <div className="text-sm text-[var(--text-secondary)] mb-2">{configuringTest.title}</div>
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
