# TAXELEA - SSC CGL Practice Platform

TAXELEA ek SSC CGL preparation platform hai jo aspirants ko real mock tests aur sectional practice provide karta hai. Yeh platform students ke liye design kiya gaya hai taaki wo SSC CGL exam ki taiyari kar sakein.

## 📱 Website ka Main Purpose

TAXELEA ka main purpose hai:
- SSC CGL exam ke liye real mock tests dena
- Sectional practice tests provide karna
- User progress track karna (streak, accuracy, questions solved)
- Mock tests ka performance analysis dena
- Bookmarks feature through important questions save karne ka suvidha dena

## 🧭 Complete Section/Navigation Structure

Website mein ye main sections hain:

1. **Dashboard** - Home page jahan user stats aur recent activity dikhta hai
2. **Sectional Mocks** - Topic-wise practice tests (Reasoning, Maths, English, GK)
3. **Full Test Series** - Complete mock tests alag alag providers se
4. **Practice Hub** - Quick practice tests access karne ke liye
5. **Performance** - Detailed performance analysis aur results
6. **Bookmarks** - Saved important questions
7. **Streak** - Daily practice streak tracking
8. **Settings** - Theme aur app settings

## 📁 JSON Data kahan hai aur kaise organized hai

Real test data yahan organized hai:
- `public/tests-organized/tests/` - Main test data folder
- `sectional/` - Sectional mock tests (subject-wise organized)
- `full/` - Full-length mock tests (provider-wise organized)
- `src/data/testCards.js` - Test cards metadata mapping file

JSON files structure:
```
tests-organized/tests/
├── sectional/
│   ├── quantitative-aptitude/
│   ├── reasoning/
│   ├── english/
│   └── general-awareness/
└── full/
    ├── ssc-cgl/
    │   ├── testbook/
    │   ├── oliveboard/
    │   └── rbe-mocks/
    └── other-exams/
```

## 📋 Sectional vs Full Tests ka Difference

**Sectional Mocks:**
- Single subject/topic ke tests hote hain
- Example: 25 questions of Geometry ya 20 questions of Cloze Test
- Quick practice ke liye design kiye gaye
- 4 main subjects: Quantitative Aptitude, Reasoning, English, General Awareness
- Total ~2,954 sectional tests available

**Full Test Series:**
- Complete multi-subject mock tests hote hain
- SSC CGL Tier-I (60 minutes) aur Tier-II (135 minutes) pattern follow karte hain
- 2,055 SSC CGL mocks + 142 other-exam mocks
- Providers: Testbook, Oliveboard, RBE Mocks, Pundits
- Real exam pattern ka simulation dete hain

## 🔄 Leaf Cards real JSON se kaise mapped hain

Leaf cards `src/data/testCards.js` file mein mapped hain:
- Har test card ek JSON file se linked hai
- Card metadata mein `path` property JSON file ka path contain karti hai
- Example: `path: 'sectional/english/active-passive/ct-23-active-to-passive-voice-6172ce16.json'`
- Runtime mein `loadTestJSON()` function se JSON file load hoti hai
- Real data browser storage se directly load hota hai

## ⚙️ Test Engine kaise kaam karta hai

Test engine in 3 main steps mein kaam karta hai:

1. **Test Selection:** User test card select karta hai
2. **Test Loading:** 
   - Test card se JSON file path nikalta hai
   - `loadTestJSON()` function se questions load hote hain
   - Test state initialize hota hai (answers, timer, current question)
3. **Test Execution:**
   - User answers select karta hai
   - Navigation (next/previous) questions ke beech
   - Timer countdown
   - Mark for Review feature
   - Submit test with negative marking calculation

## ⏱️ SSC CGL Tier-I/Tier-II Timing

Test engine automatic timing rules follow karta hai:

**Tier-I Mocks (60 minutes):**
- Agar test name mein "Tier 1" ya "Tier I" ho
- Agar test August-October mein held hua ho
- Automatic 60 minutes timer set hota hai

**Tier-II Mocks (135 minutes):**
- Agar test name mein "Tier 2" ya "Tier II" ho  
- Agar test November-March/April mein held hua ho
- Automatic 135 minutes timer set hota hai

**Sectional Tests:**
- Default 30 minutes ya question count * 2 minutes
- Real JSON data mein duration override kar sakte hain

## 📝 Answer, Review, Palette aur Submit Behaviour

**Answer Selection:**
- User option select karke answer submit karta hai
- Answer kabhi bhi change kar sakte hain (jab tak submit na ho)
- Current answer highlight hota hai

**Clear Response:**
- "Clear Response" button se answer remove ho jata hai
- Question unattempted mark hota hai

**Mark for Review:**
- Bookmark icon se question mark kar sakte hain
- Red color me marked questions dikhte hain
- Palette mein special indication

**Question Palette:**
- Green: Answered questions
- Red: Marked for review
- Grey: Not answered but visited
- White: Not visited
- Question number click karke direct jump kar sakte hain

**Submit Test:**
- Submit button par confirmation dialog aata hai
- Shows answered/total questions count
- Unanswered questions automatically incorrect mark honge
- Negative marking automatically apply hoga

## 🧮 Scoring aur Negative Marking

**Scoring Formula:**
```
Obtained Marks = (Correct Answers × Marks per Question) - (Incorrect Answers × Negative Marking)
Accuracy = (Correct Answers / Total Questions) × 100
```

**Default Marking:**
- Default marks per question: 1
- Default negative marking: 0 (kuch tests mein 0.25 ya 0.5 bhi ho sakta hai)
- Negative marks apply hote hain sirf incorrect answers par
- Obtained marks kabhi negative nahi ja sakte (min 0)

**Real-time Calculation:**
- Submit hone par instant score calculation
- Detailed breakdown: Correct, Incorrect, Unattempted
- Subject-wise performance section-wise tests mein

## 📊 Results aur Solutions

**Results Display:**
- Donut chart mein accuracy percentage
- Total marks vs obtained marks
- Negative marks separately shown
- Subject-wise breakdown (sectional tests ke liye)

**Solutions:**
- Submit ke baad detailed solution dikhta hai
- Har question ke liye:
  - Your answer (color-coded)
  - Correct answer
  - Explanation/solution (agar JSON mein available ho)
- Question by question detailed review

## 🎯 Practice kaise kaam karta hai

**Practice Modes:**
1. **Sectional Practice:** Single topic focused tests
2. **Full Mocks:** Complete exam simulation
3. **Subject-Wise Mocks:** Dedicated subject practice (new feature)

**Subject-Wise Mocks:**
- 4 subjects: Quantitative Aptitude, Reasoning, English, General Awareness
- Har subject 30 minutes, 25 questions
- Configurable question count with proper time distribution
- Full Test Series mein new tab add kiya gaya hai

**Starting a Test:**
- "Start" button click karke test begin hota hai
- Immediate navigation to test runner
- Background mein referrer page save hota hai

## 📈 Dashboard ka data kahan se aata hai

Dashboard data browser storage se aata hai:

**Storage Locations:**
- `taxelea:results` - Completed test results
- `taxelea:bookmarks` - Bookmarked questions
- `taxelea:theme` - User theme preference
- `taxelea:in-progress` - Current running test state

**Data Flow:**
1. App load hone par storage se data fetch hota hai
2. Dashboard mein stats calculate hote hain
3 - Real-time updates bina page refresh ke

**Dashboard Metrics:**
- Current Streak (consecutive days of practice)
- Longest Streak (best record)
- Daily Goal (5 questions target)
- Questions Solved (total + this week)
- Accuracy (overall accuracy percentage)
- Tests Attempted (total + this week)

## 📊 Performance Calculation

**Overall Stats:**
```
Questions Solved = Sum of all results' total
Accuracy = (Total Correct / Total Questions) × 100
Tests Attempted = Number of completed tests
```

**Subject-wise Progress:**
```
Subject Solved = Sum of subject-specific correct answers
Subject Accuracy = (Subject Correct / Subject Total) × 100
```

**Recent Activity:**
- Last 4 completed tests shown on dashboard
- Each with: title, score, total, accuracy, timestamp

## 🔥 Streak Count Logic

**Streak Calculation:**
1. Unique practice dates extract karte hain results se
2. Consecutive days count karte hain
3. Agar aaj ya kal practice ki ho toh streak increment
3. Agar 1+ day gap ho toh streak reset

**Logic Flow:**
```
Dates = unique dates from results
Sort = latest to oldest
Current Streak = 1 if today or yesterday practiced
Longest Streak = maximum consecutive days in history
```

**Display:**
- Dashboard mein current streak (🔥 icon)
- Best record as longest streak (🏆 icon)
- Daily goal completion bar

## 🔖 Bookmarks kaise work karte hain

**Bookmarking Questions:**
- Questions bookmark karne ke liye bookmark icon use karo
- Sectional mocks aur test runner mein bookmark button available hai
- Bookmarks browser storage mein save hote hain

**Storage:**
- Bookmark ID (question ID)
- Label (readable question title)
- Subject (subject category)

**Bookmarks Page:**
- All bookmarked questions list
- Subject-wise organization
- Direct access to practice bookmarked questions
- Remove bookmark option

## 🧭 Navigation/Back Behaviour

**Navigation Flow:**
1. User test start karta hai → Referrer page save hota hai
2. Test mein referrer state pass hota hai
3. Exit button click → Referrer page par navigate karta hai
4. No manual refresh required

**Implementation:**
- React Router ka use kar ke proper history management
- Navigation state me referrer path pass karte hain
- Routes key property se proper component remount
- Cleanup functions prevent state leaks

**Referrer Logic:**
- Default referrer: `/practice`
- Page-specific referrer: actual previous page
- Test exit: automatically navigate to referrer page

## 💾 Data Persistence

**Storage System:**
- Browser's IndexedDB wrapper through `window.storage`
- Automatic persistence
- No manual save required

**Persisted Data:**
- All completed test results
- User bookmarks
- Theme preference
- In-progress test state (resume capability)

**Data Safety:**
- Local storage mein save hota hai
- Server sync nahi hai (client-side only)
- Privacy maintained (data user device pe hi rehta hai)

## 📁 Important Project Folders/Files aur Unka Simple Purpose

**Source Code:**
- `src/` - React components aur logic
- `src/components/` - Reusable UI components
- `src/pages/` - Page components (Dashboard, SectionalMocks, etc.)
- `src/data/` - Configuration aur metadata
- `src/lib/` - Utility functions (storage, helpers)

**Data Files:**
- `public/tests-organized/` - Real test JSON data
- `src/data/testCards.js` - Test cards mapping
- `src/data/catalog.js` - Subjects, topics, providers configuration

**Configuration:**
- `vite.config.js` - Build tool configuration
- `index.html` - Entry HTML file
- `package.json` - Dependencies aur scripts

**Styling:**
- `src/theme/` - Theme system (dark/light mode)
- CSS variables se dynamic theming

## 🚀 Development/Run/Build Commands

**Development:**
```bash
npm run dev
```
- Starts Vite dev server
- Hot module replacement enabled
- Default: http://localhost:5173

**Build:**
```bash
npm run build
```
- Creates production build
- Optimized assets
- Output: `dist/` folder

**Preview:**
```bash
npm run preview
```
- Preview production build locally
- Similar to production server

**Lint:**
```bash
npm run lint
```
- Runs oxlint for code quality checks

## ✅ Final Verification Status

**Completed Features:**
✅ Test timers manual/config-driven (Tier-I: 60min, Tier-II: 135min)
✅ Navigation/Back bug fixed (no manual refresh required)
✅ Dashboard Continue Test with real in-progress state
✅ Sectional Mock Cards renamed to human-readable names
✅ Leaf Card Names reflect actual topics
✅ Subject-Wise Mock Test section added
✅ In-progress test tracking implemented
✅ Performance optimizations (cleanup functions, memoization)
✅ User data authenticity (real results only, no synthetic data)

**System Architecture:**
- React Router for client-side navigation
- Vite for build tooling
- Browser storage for data persistence
- Real JSON test data (no synthetic data)
- State management with React hooks

## ⚠️ Known Limitations

**Current Limitations:**
- Large test files (>50MB) GitHub LFS warning

**Working Features:**
- All navigation works without manual refresh
- Real test data loads correctly
- Timer system works with SSC CGL specific timings
- Bookmark system functional
- Streak calculation accurate
- Results tracking reliable
- Local authentication and data persistence
- Offline support with local storage
- Automatic sync when internet connection restored

## 🎯 Future Improvements (Optional)

Potential enhancements:
- Cloud sync for cross-device access
- User authentication system
- Advanced analytics dashboard
- More exam patterns (CHSL, CPO, etc.)
- Offline PWA support
- Export results functionality

---

**Built with:** React, Vite, Lucide Icons
**Data Source:** Real SSC CGL mock tests from Testbook, Oliveboard, RBE Mocks, Pundits
**Storage:** Browser IndexedDB via window.storage wrapper