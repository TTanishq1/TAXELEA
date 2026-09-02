#!/usr/bin/env python3
"""
Phase 1 — Date extraction & year-indexing (foundation for Phase 2's year containers)
=====================================================================================

What this does:
  1. Walks every full-test JSON file.
  2. Extracts a real, structured exam date (ISO format, e.g. "2021-08-18") and
     shift number from the title wherever the title contains a parseable
     "Held On: ..." date — same regex approach as the earlier title normalizer.
  3. Adds two new fields to each test JSON: `examDate` (ISO string or null)
     and `examShift` (number or null). Nothing existing is removed or changed.
  4. Builds `src/data/testsByYear.js` — tests pre-grouped by year, and within
     each year sorted chronologically (dated tests first, in date order; then
     undated tests for that year, alphabetically as a fallback) — exactly the
     shape Phase 2's year-container UI will consume directly.
  5. Tests with NO year at all go into a separate "unsorted" bucket rather
     than being silently dropped or guessed at.

This script does NOT touch any UI/page files — foundation only, per Phase 1 scope.

Usage:
    python3 scripts/phase1_date_index.py
"""

import json
import re
from pathlib import Path
from collections import defaultdict

REPO_ROOT = Path(__file__).resolve().parent.parent if (Path(__file__).parent.name == "scripts") else Path(".")
TESTS_DIR = REPO_ROOT / "public" / "tests-organized" / "tests" / "full" / "ssc-cgl"
OTHER_EXAMS_DIR = REPO_ROOT / "public" / "tests-organized" / "tests" / "full" / "other-exams"
OUT_JS = REPO_ROOT / "src" / "data" / "testsByYear.js"

MONTHS = {
    "jan": 1, "january": 1, "feb": 2, "february": 2, "mar": 3, "march": 3,
    "apr": 4, "april": 4, "may": 5, "jun": 6, "june": 6, "jul": 7, "july": 7,
    "aug": 8, "august": 8, "sep": 9, "sept": 9, "september": 9, "oct": 10,
    "october": 10, "nov": 11, "november": 11, "dec": 12, "december": 12,
}

DATE_PATTERN = re.compile(
    r"Held\s*On\s*:?\s*(\d{1,2})(?:st|nd|rd|th)?[\s_,]+([A-Za-z]+)[\s_,]+(\d{4})",
    re.IGNORECASE,
)
SHIFT_PATTERN = re.compile(r"Shift[\s_]*(\d)", re.IGNORECASE)


def extract_exam_date(title: str):
    m = DATE_PATTERN.search(title)
    if not m:
        return None
    day, month_raw, year = m.groups()
    month = MONTHS.get(month_raw.lower())
    if not month:
        return None
    try:
        return f"{int(year):04d}-{month:02d}-{int(day):02d}"
    except ValueError:
        return None


def extract_shift(title: str):
    m = SHIFT_PATTERN.search(title)
    return int(m.group(1)) if m else None


def main():
    if not TESTS_DIR.exists():
        print(f"ERROR: {TESTS_DIR} not found. Run this from the repo root.")
        return

    files = list(TESTS_DIR.rglob("*.json"))
    other_exam_count = len(list(OTHER_EXAMS_DIR.rglob("*.json"))) if OTHER_EXAMS_DIR.exists() else 0
    print(f"Found {len(files)} SSC CGL full-test JSON files.")
    print(f"({other_exam_count} 'other-exams' tests (CHSL/CPO/Stenographer/etc) intentionally excluded from this index — this page is SSC CGL specific.)")

    updated = 0
    dated_count = 0
    by_year = defaultdict(list)
    unsorted_bucket = []

    for f in files:
        try:
            data = json.loads(f.read_text(encoding="utf-8"))
        except Exception as e:
            print(f"  SKIP (unreadable): {f} ({e})")
            continue

        if not isinstance(data, dict) or "title" not in data:
            continue

        title = data.get("title") or ""
        exam_date = extract_exam_date(title)
        shift = extract_shift(title)

        changed = False
        if data.get("examDate") != exam_date:
            data["examDate"] = exam_date
            changed = True
        if data.get("examShift") != shift:
            data["examShift"] = shift
            changed = True

        if changed:
            f.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
            updated += 1
        if exam_date:
            dated_count += 1

        rel_path = f.relative_to(REPO_ROOT / "public" / "tests-organized" / "tests").as_posix()
        entry = {
            "id": data.get("id") or f.stem,
            "title": data.get("displayTitle") or data.get("title"),
            "path": rel_path,
            "examDate": exam_date,
            "examShift": shift,
            "questionCount": data.get("questionCount"),
            "duration": data.get("duration"),
            "provider": data.get("provider"),
            "tier": data.get("tier"),
        }

        year = data.get("year")
        if year:
            by_year[str(year)].append(entry)
        else:
            unsorted_bucket.append(entry)

    # Sort within each year: dated tests chronologically first (by date, then
    # shift), then undated tests for that year alphabetically by title.
    for year, entries in by_year.items():
        entries.sort(key=lambda e: (
            e["examDate"] is None,               # dated entries first
            e["examDate"] or "",
            e["examShift"] if e["examShift"] is not None else 99,
            e["title"] or "",
        ))
    unsorted_bucket.sort(key=lambda e: e["title"] or "")

    # ---- Write the year-indexed JS module Phase 2 will import directly ----
    years_sorted = sorted(by_year.keys(), key=lambda y: int(y), reverse=True)
    lines = [
        "// AUTO-GENERATED by scripts/phase1_date_index.py — do not hand-edit.",
        "// Tests grouped by exam year, sorted chronologically within each year",
        "// (dated tests first in real date order, then undated tests alphabetically).",
        "",
        "export const TESTS_BY_YEAR = {",
    ]
    for year in years_sorted:
        lines.append(f'  "{year}": [')
        for e in by_year[year]:
            lines.append(
                "    " + json.dumps(e, ensure_ascii=False) + ","
            )
        lines.append("  ],")
    lines.append("};")
    lines.append("")
    lines.append("// Tests with no identifiable exam year at all — shown in an")
    lines.append('// "Uncategorized" bucket in the UI rather than guessed at.')
    lines.append("export const UNSORTED_TESTS = [")
    for e in unsorted_bucket:
        lines.append("  " + json.dumps(e, ensure_ascii=False) + ",")
    lines.append("];")
    lines.append("")
    lines.append("export const YEAR_ORDER = " + json.dumps(years_sorted) + ";")
    lines.append("")

    OUT_JS.parent.mkdir(parents=True, exist_ok=True)
    OUT_JS.write_text("\n".join(lines), encoding="utf-8")

    # ---- Report ----
    print(f"\nUpdated examDate/examShift fields on {updated} files.")
    print(f"Tests with a real, parseable exam date: {dated_count} / {len(files)}")
    print(f"\nYear breakdown (dated / total in that year):")
    for year in years_sorted:
        entries = by_year[year]
        dated_in_year = sum(1 for e in entries if e["examDate"])
        print(f"  {year}: {dated_in_year} dated / {len(entries)} total")
    print(f"\nUncategorized (no year at all): {len(unsorted_bucket)}")
    print(f"\nWrote year index to: {OUT_JS}")


if __name__ == "__main__":
    main()
