import { useState } from "react";
import { Bookmark, ChevronDown, Play, FileText } from "lucide-react";
import { Card } from "../components/ui/Card.jsx";
import { SECTIONAL_COUNTS } from "../data/catalog.js";
import { SECTIONAL_TEST_CARDS, getSectionalCardsBySubject } from "../data/testCards.js";

export function SectionalMocks({ startPractice, bookmarks, toggleBookmark }) {
  const [openSubject, setOpenSubject] = useState("quantitative-aptitude");
  const [selectedTopic, setSelectedTopic] = useState(null);
  
  const currentSubjectCards = getSectionalCardsBySubject(openSubject);
  const topicCards = selectedTopic 
    ? currentSubjectCards.filter(card => card.topic === selectedTopic)
    : currentSubjectCards;
  
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
                      const bookmarked = bookmarks.includes(card.id);
                      return (
                        <div key={card.id} className="flex items-center justify-between bg-[var(--elevated-bg)] border border-[var(--border)] rounded-lg px-3.5 py-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <FileText size={14} className="text-[var(--text-faint)] flex-shrink-0" />
                              <div className="text-sm text-[var(--text-secondary)] truncate">{card.title}</div>
                            </div>
                            <div className="text-[11px] text-[var(--text-faint)] mt-1">{card.questionCount} questions</div>
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            <button onClick={() => toggleBookmark(card.id, card.title, card.subject)} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[var(--hover-bg)]">
                              <Bookmark size={13} className={bookmarked ? "text-red-500" : "text-[var(--text-faint)]"} fill={bookmarked ? "#ef4444" : "none"} />
                            </button>
                            <button
                              onClick={() => {
                                console.log('Starting sectional test with card:', card);
                                startPractice(card.id, card);
                              }}
                              className="text-xs font-medium rounded-md px-2.5 py-1.5 flex items-center gap-1 text-red-500 border border-[var(--accent-soft-border)] hover:bg-[var(--accent-soft-bg)]"
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
    </div>
  );
}
