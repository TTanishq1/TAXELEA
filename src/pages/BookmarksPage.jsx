import { Bookmark, X } from "lucide-react";
import { Card } from "../components/ui/Card.jsx";
import { SECTIONAL_COUNTS } from "../data/catalog.js";
import { EMBEDDED_TESTS } from "../data/embeddedTests.js";

export function BookmarksPage({ bookmarks, toggleBookmark, startPractice }) {
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Bookmarks</h1>
        <p className="text-[var(--text-faint)] text-sm mt-1">Topics you've saved for later.</p>
      </div>
      {bookmarks.length === 0 ? (
        <Card className="p-5 sm:p-8 text-center">
          <Bookmark size={28} className="mx-auto text-[var(--text-faint)] mb-3" />
          <p className="text-sm text-[var(--text-faint)]">Nothing bookmarked yet. Tap the bookmark icon on any topic in Sectional Mocks.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarks.map((b) => {
            const subjMeta = SECTIONAL_COUNTS[b.subject];
            const hasReal = !!EMBEDDED_TESTS[b.key];
            return (
              <Card key={b.key} className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm text-[var(--text-secondary)]">{b.label}</div>
                  <div className="text-xs text-[var(--text-faint)]">{subjMeta?.label}</div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleBookmark(b.key, b.label, b.subject)} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[var(--hover-bg)]">
                    <X size={13} className="text-[var(--text-faint)]" />
                  </button>
                  {hasReal && (
                    <button onClick={() => startPractice(b.key)} className="text-xs text-red-500 border border-[var(--accent-soft-border)] rounded-md px-2.5 py-1.5">
                      Start
                    </button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
