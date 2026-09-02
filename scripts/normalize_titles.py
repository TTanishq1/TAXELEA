#!/usr/bin/env python3
"""
Title normalizer for Taxelea's test JSON dataset.
====================================================

Problem being fixed:
  - 37.5% of titles are meaningless uploader artifacts ("devgagan",
    "CBT Exam - pundits", "Mocks Wallah", "ssct2np", generic "Mock Test").
  - The rest mix three different date formats within the same provider
    ("18th September 2025", "18th_September_2025", "18 Sep 2025") and run
    up to 99 characters long, which is why they look broken/unreadable
    in the UI even after adding `truncate` in CSS.

What this script does:
  - Does NOT touch or delete the original `title` field (kept for
    reference / tooltip use).
  - Adds a new `displayTitle` field to every test JSON: short, consistent,
    and with the actual exam date always explicitly visible (never hidden
    or dropped) when the source title contains one.
  - Junk/placeholder titles (devgagan, CBT Exam - *, Mocks Wallah, etc.)
    get a generated name built from real metadata (exam, subject, provider)
    instead of the meaningless uploader string.

Format produced:
  Official/PYQ-style paper with a date+shift:
      "SSC CGL 2025 · Reasoning · 18 Sep 2025 · Shift 3"
  Paper with a date but no shift:
      "SSC CGL Tier-II 2023 · JSO Paper-II · 27 Oct 2023"
  Sectional/topic practice set (already short, left mostly as-is):
      "Simple Interest - 02"
  Junk/placeholder title (no usable info in original):
      "SSC CGL Mock · Testbook #482"

Usage:
    python3 normalize_titles.py /path/to/tests-organized
"""

import json
import re
import sys
from pathlib import Path

MONTHS = {
    "jan": "Jan", "january": "Jan", "feb": "Feb", "february": "Feb",
    "mar": "Mar", "march": "Mar", "apr": "Apr", "april": "Apr",
    "may": "May", "jun": "Jun", "june": "Jun", "jul": "Jul", "july": "Jul",
    "aug": "Aug", "august": "Aug", "sep": "Sep", "sept": "Sep", "september": "Sep",
    "oct": "Oct", "october": "Oct", "nov": "Nov", "november": "Nov",
    "dec": "Dec", "december": "Dec",
}

# Known meaningless placeholder titles (uploader usernames, generic labels)
JUNK_PATTERNS = [
    re.compile(r"^devgagan$", re.IGNORECASE),
    re.compile(r"^CBT Exam\b", re.IGNORECASE),
    re.compile(r"^Mocks?\s*Wallah$", re.IGNORECASE),
    re.compile(r"^Mock Test$", re.IGNORECASE),
    re.compile(r"^ssct2np$", re.IGNORECASE),
    re.compile(r"^cgl1\b", re.IGNORECASE),
]

# "Held On: 18th September 2025" / "Held On:18th_September_2025" /
# "Held On 18 Sept, 2025" / "Held On : 27 Oct, 2023" — all variants
DATE_PATTERN = re.compile(
    r"Held\s*On\s*:?\s*(\d{1,2})(?:st|nd|rd|th)?[\s_,]+([A-Za-z]+)[\s_,]+(\d{4})",
    re.IGNORECASE,
)

SHIFT_PATTERN = re.compile(r"Shift[\s_]*(\d)", re.IGNORECASE)

SUBJECT_PATTERN = re.compile(
    r"-\s*(Reasoning|English|Quantitative Aptitude|General Awareness|General Knowledge)\b",
    re.IGNORECASE,
)
SUBJECT_LABELS = {
    "reasoning": "Reasoning",
    "english": "English",
    "quantitative aptitude": "Quant",
    "general awareness": "GA",
    "general knowledge": "GA",
}


def is_junk(title: str) -> bool:
    t = title.strip()
    if len(t) < 6:
        return True
    return any(p.match(t) for p in JUNK_PATTERNS)


def extract_date(title: str):
    m = DATE_PATTERN.search(title)
    if not m:
        return None
    day, month_raw, year = m.groups()
    month = MONTHS.get(month_raw.lower())
    if not month:
        return None
    return f"{int(day)} {month} {year}"


def extract_shift(title: str):
    m = SHIFT_PATTERN.search(title)
    return m.group(1) if m else None


def extract_subject(title: str):
    m = SUBJECT_PATTERN.search(title)
    if not m:
        return None
    return SUBJECT_LABELS.get(m.group(1).lower())


def build_display_title(test: dict, file_path: str = "") -> str:
    title = (test.get("title") or "").strip()
    # Only default to "SSC CGL" when the file actually lives under a
    # ssc-cgl/ folder. Files under other-exams/ with no `exam` field set
    # have a genuinely unknown exam type — defaulting them to "SSC CGL" was
    # a real bug (e.g. a CHSL or RRB mock with a junk title was being
    # mislabeled "SSC CGL Mock", which is actively misleading).
    if test.get("exam"):
        exam = test["exam"]
    elif "ssc-cgl" in file_path:
        exam = "SSC CGL"
    else:
        exam = "SSC Exam"
    year = test.get("year")
    tier = test.get("tier")
    provider = test.get("provider") or "Mock"

    if is_junk(title):
        # No usable info in the original title at all — build a plain,
        # honest label from real metadata instead of a fake-specific one.
        parts = [exam]
        if year:
            parts.append(str(year))
        parts.append("Mock")
        base = " ".join(parts)
        short_provider = provider.replace("_", " ")
        return f"{base} · {short_provider}"

    date = extract_date(title)
    shift = extract_shift(title)
    subject = extract_subject(title)

    if date:
        # Has a real, explicit exam date -> always keep the date visible.
        label_bits = [exam]
        if year and str(year) not in title:
            label_bits.append(str(year))
        elif year:
            label_bits.append(str(year))
        header = " ".join(label_bits)

        middle = subject if subject else None
        tail = date if not shift else f"{date} · Shift {shift}"

        pieces = [header]
        if middle:
            pieces.append(middle)
        pieces.append(tail)
        return " · ".join(pieces)

    # No "Held On" date present — likely a sectional/topic practice set,
    # these titles are usually already short and fine. Cap length but break
    # at a word boundary instead of mid-word.
    if len(title) <= 75:
        return title
    cut = title[:72].rsplit(" ", 1)[0]
    return cut.rstrip() + "..."


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 normalize_titles.py /path/to/tests-organized")
        sys.exit(1)

    root = Path(sys.argv[1])
    files = list(root.rglob("*.json"))
    if not files:
        print(f"No JSON files found under {root}")
        sys.exit(1)

    changed = 0
    junk_fixed = 0
    date_fixed = 0
    seq_counters = {}

    for f in files:
        try:
            data = json.loads(f.read_text(encoding="utf-8"))
        except Exception as e:
            print(f"  SKIP (unreadable): {f} ({e})")
            continue

        if not isinstance(data, dict) or "title" not in data:
            # Not an individual test file (e.g. an index/manifest file) — skip.
            continue

        original_title = data.get("title") or ""
        display = build_display_title(data, str(f))

        if is_junk(original_title):
            # Disambiguate identical junk-derived names with a running
            # counter per exam+provider so cards aren't all literally
            # identical (e.g. "SSC CGL Mock · Pundits #1", "#2", ...).
            key = display
            seq_counters[key] = seq_counters.get(key, 0) + 1
            display = f"{display} #{seq_counters[key]}"
            junk_fixed += 1
        elif extract_date(original_title):
            date_fixed += 1

        if display != data.get("displayTitle"):
            data["displayTitle"] = display
            f.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
            changed += 1

    print(f"Processed {len(files)} files.")
    print(f"  displayTitle added/updated: {changed}")
    print(f"  Junk titles replaced with generated names: {junk_fixed}")
    print(f"  Verbose 'Held On' titles shortened with explicit date kept: {date_fixed}")


if __name__ == "__main__":
    main()
