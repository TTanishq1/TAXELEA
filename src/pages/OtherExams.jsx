import { useState, useEffect } from "react";
import { Play, FileText, Clock, Settings, X } from "lucide-react";
import { Card } from "../components/ui/Card.jsx";
import { OTHER_EXAMS_BY_TYPE, OTHER_EXAM_TYPES } from "../data/otherExams.js";
import { loadTestTimingConfig, saveTestTimingConfig } from "../lib/storage.js";

// Phase 4: "Other Exams" (SSC CHSL, CPO, Stenographer, RRB, IB, RPF, etc.)
// These 142 tests existed in the dataset from the start, but had no
// browsable UI anywhere in the original app — `OTHER_EXAMS_COUNT` was
// defined in catalog.js but never actually rendered. This page makes them
// reachable for the first time, grouped by exam type (classified from the
// `exam` field where set, and from title-text keywords otherwise — see
// scripts/phase4_other_exams_index.py for exactly how).
//
// Same component contract/styling as FullTestSeries.jsx so it feels like
// part of the same app, not a bolted-on page.

export function OtherExams({ startPractice }) {
  const [selectedType, setSelectedType] = useState(OTHER_EXAM_TYPES[0]);
  const [timingConfig, setTimingConfig] = useState({});
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configuringTest, setConfiguringTest] = useState(null);
  const [configMinutes, setConfigMinutes] = useState(60);

  useEffect(() => {
    loadTestTimingConfig().then(setTimingConfig);
  }, []);

  const currentCards = OTHER_EXAMS_BY_TYPE[selectedType] || [];
  const totalTests = OTHER_EXAM_TYPES.reduce((sum, t) => sum + OTHER_EXAMS_BY_TYPE[t].length, 0);

  const presets = [30, 45, 60, 90, 120, 150, 180];

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

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Other Exams</h1>
        <p className="text-[var(--text-faint)] text-sm mt-1">{totalTests} mocks across SSC CHSL, CPO, Stenographer, RRB, and more.</p>
      </div>

      {/* Exam-type tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {OTHER_EXAM_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`shrink-0 text-center px-4 py-2.5 rounded-xl border transition-colors ${
              selectedType === type
                ? "border-red-500 border-2 bg-[var(--accent-soft-bg)]"
                : "border-[var(--border)] bg-[var(--card-bg)] hover:bg-[var(--hover-bg)]"
            }`}
          >
            <div className={`text-sm font-bold whitespace-nowrap ${selectedType === type ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>{type}</div>
            <div className="text-[10px] text-[var(--text-faint)]">{OTHER_EXAMS_BY_TYPE[type].length} tests</div>
          </button>
        ))}
      </div>

      {selectedType === "Unspecified" && (
        <div className="text-xs text-[var(--text-faint)] px-1">
          These tests don't have a clear exam type in their source data — shown here rather than mislabeled.
        </div>
      )}

      {/* Test cards for selected exam type */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[var(--text-primary)] font-semibold text-sm">{selectedType}</div>
          <div className="text-xs text-[var(--text-faint)]">{currentCards.length} tests available</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {currentCards.length > 0 ? currentCards.map((card) => (
            <div key={card.id} className="flex items-center justify-between bg-[var(--elevated-bg)] border border-[var(--border)] rounded-lg px-3.5 py-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-[var(--text-faint)] flex-shrink-0" />
                  <div className="text-sm text-[var(--text-secondary)] truncate" title={card.title}>{card.title}</div>
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
                  onClick={() => startPractice(card.id, card)}
                  disabled={!timingConfig[card.id]}
                  className={`flex items-center gap-1.5 text-white text-xs font-medium rounded-lg px-3.5 py-2 ${
                    timingConfig[card.id]
                      ? 'bg-[var(--accent)] hover:bg-[var(--accent-hover)]'
                      : 'bg-gray-600 cursor-not-allowed'
                  }`}
                >
                  <Play size={12} /> Start
                </button>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-8 text-[var(--text-faint)] text-sm">
              No tests in this category yet.
            </div>
          )}
        </div>
      </Card>

      {/* Configure Time modal — identical to FullTestSeries.jsx for consistency */}
      {showConfigModal && configuringTest && (
        <div className="fixed inset-0 bg-[var(--scrim)] z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Configure Test Time</h3>
              <button onClick={() => setShowConfigModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-muted)]">
                <X size={18} />
              </button>
            </div>
            <div className="text-sm text-[var(--text-secondary)] mb-2 truncate" title={configuringTest.title}>{configuringTest.title}</div>

            <label className="text-xs text-[var(--text-secondary)] block mb-1.5 mt-3">Duration (minutes)</label>
            <input
              type="number"
              value={configMinutes}
              onChange={(e) => setConfigMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-[var(--elevated-bg)] border border-[var(--border-strong)] text-[var(--text-primary)] text-sm mb-3"
            />

            <div className="text-xs text-[var(--text-faint)] mb-2">Quick presets:</div>
            <div className="flex flex-wrap gap-2 mb-5">
              {presets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setConfigMinutes(preset)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium ${
                    configMinutes === preset ? 'bg-[var(--accent)] text-white' : 'bg-[var(--elevated-bg)] text-[var(--text-secondary)]'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowConfigModal(false)} className="flex-1 border border-[var(--border-strong)] hover:bg-[var(--hover-bg)] text-[var(--text-primary)] text-sm font-medium rounded-lg px-4 py-2.5">
                Cancel
              </button>
              <button onClick={handleSaveTiming} className="flex-1 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium rounded-lg px-4 py-2.5">
                Save
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
