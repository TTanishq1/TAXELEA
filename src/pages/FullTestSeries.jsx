import { useState, useEffect } from "react";
import { Play, FileText, Clock, Settings, X, FolderOpen } from "lucide-react";
import { Card } from "../components/ui/Card.jsx";
import { TESTS_BY_YEAR, UNSORTED_TESTS, YEAR_ORDER } from "../data/testsByYear.js";
import { loadTestTimingConfig, saveTestTimingConfig } from "../lib/storage.js";

// Phase 2: Full Test Series is now organized as year containers instead of
// provider cards (Testbook / Oliveboard / RBE / Pundits). Each year is a
// single unified list of PYQ papers, sorted chronologically where a real
// exam date is known (Phase 1's src/data/testsByYear.js) — dated tests
// first in real date order, then undated tests. Tests with no year at all
// go in a separate "Uncategorized" bucket instead of being guessed into one.
//
// Same component contract as before (named export, `startPractice` prop,
// flat timingConfig[card.id] = minutes) so TaxeleaApp.jsx needs no changes.

const UNCATEGORIZED_KEY = "__uncategorized__";

export function FullTestSeries({ startPractice }) {
  const [selectedYear, setSelectedYear] = useState(YEAR_ORDER[0] || UNCATEGORIZED_KEY);
  const [timingConfig, setTimingConfig] = useState({});
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configuringTest, setConfiguringTest] = useState(null);
  const [configMinutes, setConfigMinutes] = useState(60);

  useEffect(() => {
    loadTestTimingConfig().then(setTimingConfig);
  }, []);

  const isUncategorized = selectedYear === UNCATEGORIZED_KEY;
  const currentYearCards = isUncategorized ? UNSORTED_TESTS : (TESTS_BY_YEAR[selectedYear] || []);
  const totalTests = YEAR_ORDER.reduce((sum, y) => sum + TESTS_BY_YEAR[y].length, 0) + UNSORTED_TESTS.length;

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
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Full Test Series — PYQ Archive</h1>
        <p className="text-[var(--text-faint)] text-sm mt-1">{totalTests} SSC CGL previous-year papers, organized by year.</p>
      </div>

      {/* Year tabs (replaces provider cards) */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {YEAR_ORDER.map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`shrink-0 min-w-[74px] text-center px-4 py-2.5 rounded-xl border transition-colors ${
              selectedYear === year
                ? "border-red-500 border-2 bg-[var(--accent-soft-bg)]"
                : "border-[var(--border)] bg-[var(--card-bg)] hover:bg-[var(--hover-bg)]"
            }`}
          >
            <div className={`text-base font-bold ${selectedYear === year ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>{year}</div>
            <div className="text-[10px] text-[var(--text-faint)]">{TESTS_BY_YEAR[year].length} papers</div>
          </button>
        ))}
        {UNSORTED_TESTS.length > 0 && (
          <button
            onClick={() => setSelectedYear(UNCATEGORIZED_KEY)}
            className={`shrink-0 min-w-[90px] text-center px-4 py-2.5 rounded-xl border transition-colors flex flex-col items-center justify-center gap-1 ${
              isUncategorized
                ? "border-red-500 border-2 bg-[var(--accent-soft-bg)]"
                : "border-[var(--border)] bg-[var(--card-bg)] hover:bg-[var(--hover-bg)]"
            }`}
          >
            <FolderOpen size={14} className="text-[var(--text-faint)]" />
            <div className="text-[10px] text-[var(--text-faint)]">{UNSORTED_TESTS.length} papers</div>
          </button>
        )}
      </div>

      {/* Test cards for selected year */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[var(--text-primary)] font-semibold text-sm">
            {isUncategorized ? "Uncategorized" : selectedYear} Papers
          </div>
          <div className="text-xs text-[var(--text-faint)]">{currentYearCards.length} tests available</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {currentYearCards.length > 0 ? currentYearCards.map((card) => (
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
              No tests in this year yet.
            </div>
          )}
        </div>
      </Card>

      {/* Configure Time modal — unchanged from original */}
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
