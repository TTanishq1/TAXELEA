import { useState } from "react";
import { ArrowRight, Play, FileText, Clock } from "lucide-react";
import { Card } from "../components/ui/Card.jsx";
import { FULL_MOCK_PROVIDERS, OTHER_EXAMS_COUNT } from "../data/catalog.js";
import { FULL_TEST_CARDS, getFullTestCardsByProvider } from "../data/testCards.js";

export function FullTestSeries({ startPractice }) {
  const [selectedProvider, setSelectedProvider] = useState("testbook");
  
  const currentProviderCards = getFullTestCardsByProvider(selectedProvider);
  
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
                  <div className="text-sm text-[var(--text-secondary)] truncate">{card.title}</div>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="text-[11px] text-[var(--text-faint)] flex items-center gap-1">
                    <Clock size={10} /> {card.duration}m
                  </div>
                  <div className="text-[11px] text-[var(--text-faint)]">{card.questionCount} questions</div>
                </div>
              </div>
              <button
                onClick={() => {
                  console.log('Starting test with card:', card);
                  startPractice(card.id, card);
                }}
                className="ml-2 flex items-center gap-1.5 bg-red-700 hover:bg-red-600 text-white text-xs font-medium rounded-lg px-3.5 py-2"
              >
                <Play size={12} /> Start
              </button>
            </div>
          )) : (
            <div className="col-span-full text-center py-8 text-[var(--text-faint)] text-sm">
              No tests available for this provider yet. More tests coming soon!
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
