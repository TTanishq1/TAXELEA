import { useState, useMemo } from "react";
import { X, Check, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Card } from "../components/ui/Card.jsx";
import { DonutProgress } from "../components/ui/DonutProgress.jsx";
import { SECTIONAL_COUNTS } from "../data/catalog.js";
import { EMBEDDED_TESTS } from "../data/embeddedTests.js";

export function PracticeRunner({ testKey, onExit, onComplete }) {
  const test = EMBEDDED_TESTS[testKey];
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => {
    if (!test) return 0;
    let s = 0;
    test.questions.forEach((qq, i) => { if (answers[i] === qq.answer) s++; });
    return s;
  }, [answers, test]);

  if (!test) return null;
  const q = test.questions[idx];
  const total = test.questions.length;

  const select = (optId) => {
    if (submitted) return;
    setAnswers((a) => ({ ...a, [idx]: optId }));
  };

  const finish = () => {
    setSubmitted(true);
    onComplete({
      id: "res-" + Date.now(),
      title: test.title,
      provider: test.provider,
      score,
      total,
      subject: test.subject,
      color: SECTIONAL_COUNTS[test.subject]?.color || "#ef4444",
    });
  };

  if (submitted) {
    return (
      <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-4 sm:space-y-5">
        <Card className="p-5 sm:p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <DonutProgress value={Math.round((score/total)*100)} size={100} stroke={9} color="#ef4444" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-[var(--text-primary)]">{score}/{total}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center mb-4">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-16 h-16 object-contain rounded-lg"
              style={{ maxWidth: '64px', maxHeight: '64px' }}
            >
              <source src="/dancing-celebration.mp4" type="video/mp4" />
            </video>
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">Test Completed!</h2>
          <p className="text-[var(--text-faint)] text-sm mb-6">{test.title} · {test.provider}</p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={onExit} className="flex items-center gap-2 border border-[var(--border-strong)] hover:bg-[var(--hover-bg)] text-[var(--text-primary)] text-sm font-medium rounded-lg px-5 py-2.5">
              Back to Dashboard
            </button>
            <button onClick={() => { setSubmitted(false); setAnswers({}); setIdx(0); }} className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white text-sm font-medium rounded-lg px-5 py-2.5">
              <RotateCcw size={14} /> Retry
            </button>
          </div>
        </Card>

        <div className="space-y-3">
          {test.questions.map((qq, i) => {
            const correct = answers[i] === qq.answer;
            const attempted = answers[i] !== undefined;
            return (
              <Card key={i} className="p-4">
                <div className="flex items-start gap-2 mb-2">
                  <span className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-semibold mt-0.5 ${correct ? "bg-green-600" : attempted ? "bg-red-600" : "bg-[var(--border-strong)]"} text-white`}>
                    {i + 1}
                  </span>
                  <p className="text-sm text-[var(--text-secondary)]">{qq.q}</p>
                </div>
                <div className="pl-7 grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                  {qq.options.map((o) => {
                    const isAns = o.id === qq.answer;
                    const isPicked = answers[i] === o.id;
                    return (
                      <div key={o.id} className={`text-xs rounded-md px-2.5 py-1.5 border ${
                        isAns ? "border-[var(--ok-border)] bg-[var(--ok-bg)] text-[var(--ok-text)]" :
                        isPicked ? "border-[var(--danger-border)] bg-[var(--accent-soft-bg)] text-[var(--danger-text)]" :
                        "border-[var(--border)] text-[var(--text-muted)]"
                      }`}>
                        <span className="font-semibold mr-1">{o.id}.</span>{o.text}
                      </div>
                    );
                  })}
                </div>
                {qq.solution && <p className="pl-7 text-xs text-[var(--text-faint)] leading-relaxed">{qq.solution}</p>}
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[var(--text-primary)] font-semibold text-sm">{test.title}</div>
          <div className="text-xs text-[var(--text-faint)]">{test.provider} · Question {idx + 1} of {total}</div>
        </div>
        <button onClick={onExit} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-muted)]">
          <X size={16} />
        </button>
      </div>
      <div className="h-1.5 bg-[var(--track-bg)] rounded-full overflow-hidden">
        <div className="h-full bg-red-600 transition-all" style={{ width: `${((idx+1)/total)*100}%` }} />
      </div>

      <Card className="p-6">
        <p className="text-[15px] text-[var(--text-primary)] leading-relaxed mb-5">{q.q}</p>
        <div className="space-y-2.5">
          {q.options.map((o) => {
            const picked = answers[idx] === o.id;
            return (
              <button
                key={o.id}
                onClick={() => select(o.id)}
                className={`w-full flex items-center gap-3 text-left rounded-lg px-4 py-3 border transition-colors ${
                  picked ? "border-red-600 bg-red-950/30" : "border-[var(--border-strong)] hover:border-[var(--border-strong)] hover:bg-[var(--hover-bg)]"
                }`}
              >
                <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold border ${
                  picked ? "bg-red-600 border-red-600 text-white" : "border-[var(--border-strong)] text-[var(--text-muted)]"
                }`}>{o.id}</span>
                <span className="text-sm text-[var(--text-secondary)]">{o.text}</span>
              </button>
            );
          })}
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          disabled={idx === 0}
          className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] disabled:opacity-30 hover:text-[var(--text-primary)]"
        >
          <ChevronLeft size={16} /> Previous
        </button>
        <div className="flex items-center gap-1.5">
          {test.questions.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} className={`w-2 h-2 rounded-full ${
              i === idx ? "bg-red-600 w-5" : answers[i] !== undefined ? "bg-[var(--text-faint)]" : "bg-[var(--track-bg)]"
            } transition-all`} />
          ))}
        </div>
        {idx === total - 1 ? (
          <button onClick={finish} className="flex items-center gap-1.5 text-sm font-medium text-white bg-red-700 hover:bg-red-600 rounded-lg px-4 py-2">
            Submit <Check size={15} />
          </button>
        ) : (
          <button onClick={() => setIdx((i) => Math.min(total - 1, i + 1))} className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            Next <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
