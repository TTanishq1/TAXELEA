import { Layers, Play } from "lucide-react";
import { Card } from "../components/ui/Card.jsx";
import { SECTIONAL_COUNTS } from "../data/catalog.js";
import { SECTIONAL_TEST_CARDS } from "../data/testCards.js";

export function PracticeHub({ startPractice }) {
  // Get a sample of sectional test cards for practice
  const practiceCards = SECTIONAL_TEST_CARDS.slice(0, 12);
  
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
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: color + "22" }}>
                <Icon size={17} style={{ color }} />
              </div>
              <div className="text-[var(--text-primary)] font-semibold text-sm mb-1">{card.title}</div>
              <div className="text-xs text-[var(--text-faint)] mb-4">{card.questionCount} questions · {card.provider}</div>
              <button onClick={() => startPractice(card.id, card)} className="w-full flex items-center justify-center gap-2 bg-red-700 hover:bg-red-600 text-white text-xs font-medium rounded-lg py-2.5">
                <Play size={12} /> Start Practice
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
