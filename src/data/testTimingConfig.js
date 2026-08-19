// Manual test timing configuration
// Each test ID maps to its specific duration in minutes
// This is the single source of truth for all test timings
// Add or modify timings here as needed

export const TEST_TIMING_CONFIG = {
  // English - Active/Passive
  'cgl-tier-ii-ct-11-active-to-passive-b274a4d3': 15,
  'cgl-tier-ii-ct-12-passive-to-active-9e5d4856': 15,
  'ct-23-active-to-passive-voice-6172ce16': 12,
  'ct-24-passive-to-active-voice-71a5661c': 12,
  'grammar-active-to-passive-01-be3bd692': 45,
  'grammar-active-to-passive-02-8daa5ace': 45,
  'grammar-active-to-passive-03-3c28890d': 45,
  'grammar-active-to-passive-04-3018d531': 45,
  'grammar-active-to-passive-05-52af3337': 45,
  'grammar-passive-to-active-01-fedf2959': 45,
  'grammar-passive-to-active-02-8ef4464b': 45,
  'grammar-passive-to-active-03-792427e6': 45,
  'the-solvers-promocks-voice-quiz-1-80330-53ead81b': 20,
  'the-solvers-promocks-voice-quiz-2-80483-2e760059': 20,

  // English - Antonyms
  'cgl-tier-ii-ct-09-antonyms-12b4a7bf': 15,
  'vocabulary-antonyms-01-1-db4c24f2': 35,
  'vocabulary-antonyms-01-832d1c1b': 35,
  'vocabulary-antonyms-02-1-ecd5da22': 35,
  'vocabulary-antonyms-02-7dabb3a8': 35,
  'vocabulary-antonyms-03-1-3a6a971e': 35,
  'vocabulary-antonyms-03-7e99bbf8': 35,
  'vocabulary-antonyms-04-1-6588c260': 35,
  'vocabulary-antonyms-04-14cd5e2f': 35,
  'vocabulary-antonyms-05-1-56d69dc2': 35,
  'vocabulary-antonyms-05-dc0d4471': 35,
  'vocabulary-antonyms-06-3cf285db': 35,
  'vocabulary-antonyms-07-e74633d1': 35,
  'vocabulary-antonyms-08-f8b26495': 35,

  // English - Cloze Test
  'cgl-tier-ii-ct-22-cloze-test-01-ff9b3bc4': 15,
  'cgl-tier-ii-ct-23-cloze-test-02-af120a98': 15,
  'cloze-test-01-1-d99ee644': 35,
  'cloze-test-01-f622edb2': 35,
  'cloze-test-02-1-7da8957a': 35,
  'cloze-test-02-eea53cd3': 35,
  'cloze-test-03-1-d6bdc499': 35,
  'cloze-test-03-dd4f649b': 35,
  'cloze-test-04-1-5dfbece9': 35,
  'cloze-test-04-a2a65d73': 35,
  'cloze-test-05-03a02471': 35,
  'cloze-test-05-1-d959f721': 35,
  'cloze-test-06-242000e2': 35,
  'cloze-test-07-1f62781c': 35,
  'cloze-test-08-032e914d': 35,
  'ct-29-cloze-test-01-37eddfdc': 12,
  'ct-30-cloze-test-02-4c38b240': 12,
  'ct-31-cloze-test-03-b70ce477': 12,
  'the-solvers-the-pundits-cloze-test-quiz-77117-b3beb518': 20,

  // English - Direct/Indirect
  'cgl-tier-ii-ct-13-direct-to-indirect-speech-fd9a0e44': 15,
  'cgl-tier-ii-ct-14-indirect-to-direct-speech-7ea702f4': 15,
  'ct-25-direct-to-indirect-speech-43278211': 12,
  'ct-26-indirect-to-direct-speech-a832382f': 12,
  'grammar-direct-to-indirect-speech-01-43037780': 45,
  'grammar-direct-to-indirect-speech-02-b30991d7': 45,
  'grammar-direct-to-indirect-speech-03-65824a36': 45,
  'grammar-direct-to-indirect-speech-04-626c5382': 45,
  'grammar-indirect-to-direct-speech-dfc86434': 45,
  'the-solvers-promocks-narration-quiz-80745-03720a72': 20,

  // English - Error Spotting
  'cgl-tier-ii-ct-01-error-spotting-e79393ef': 15,
  'cgl-tier-ii-ct-15-error-spotting-01-5369d3cb': 15,
  'cgl-tier-ii-ct-16-error-spotting-02-cbb3a3d4': 15,
  'error-spotting-01': 8,
  'grammar-error-spotting-01-1-f8979439': 45,
  'grammar-error-spotting-01-306b1591': 45,
  'grammar-error-spotting-02-1-696cee75': 45,
  'grammar-error-spotting-02-7f690db6': 45,
  'grammar-error-spotting-03-1-009b324e': 45,
  'grammar-error-spotting-03-1e76c3ae': 45,
  'grammar-error-spotting-04-1-393739c2': 45,
  'grammar-error-spotting-04-83bd3c1b': 45,
  'grammar-error-spotting-05-1-073a0494': 45,
  'grammar-error-spotting-05-d9ff4b77': 45,

  // Quantitative Aptitude - Algebra
  'algebra-identities-01-1-39ef9048': 35,
  'algebra-identities-01-8b540ba1': 35,
  'algebra-identities-02-1-b2461d99': 35,
  'algebra-identities-02-11cb78eb': 35,
  'algebra-identities-03-1-9b292a56': 35,
  'algebra-identities-03-bf434f87': 35,
  'algebra-identities-04-1-9eb81324': 35,
  'algebra-identities-04-a984e592': 35,
  'algebra-identities-05-2002ec80': 35,
  'algebra-miscellaneous-01-1-e2793cdb': 35,
  'algebra-miscellaneous-01-32496b08': 35,
  'algebra-miscellaneous-02-1-3a28a9a3': 35,
  'algebra-miscellaneous-02-282a5328': 35,
  'algebra-miscellaneous-03-5ac9fbe7': 35,
  'cgl-tier-ii-ct-22-mathematical-equation-01-b2ba5b24': 15,
  'cgl-tier-ii-ct-23-algebraic-identities-01-5f199f99': 15,
  'cgl-tier-ii-ct-24-algebraic-identities-02-1a1e8ecf': 15,
  'cgl-tier-ii-ct-25-linear-equation-662596a2': 15,
  'cgl-tier-ii-ct-26-quadratic-equation-and-polynomials-0e1ff847': 15,
  'ct-23-problem-on-age-14e7fb76': 12,

  // Quantitative Aptitude - Geometry
  'ct-43-lines-and-angles-0b9ab16d': 12,
  'ct-44-properties-of-triangle-061ef846': 12,
  'ct-45-centres-of-a-triangle-ea6da0f0': 12,

  // Full Tests - SSC CGL Tier I (100 questions, 60 minutes)
  'ssc-cgl-2020-tier-i-official-paper-held-on-13-aug-2021-shift-1-b32c8f99': 60,
  'ssc-cgl-2020-tier-i-official-paper-held-on-13-aug-2021-shift-2-60578829': 60,
  'ssc-cgl-2020-tier-i-official-paper-held-on-13-aug-2021-shift-3-21031aab': 60,
  'ssc-cgl-2020-tier-i-official-paper-held-on-16-aug-2021-shift-1-302b8a01': 60,

  // Add more test IDs and their durations as needed
  // Format: 'test-id': duration_in_minutes
  // For 50-question tests: 35-45 minutes
  // For 25-question tests: 15-20 minutes  
  // For 10-question tests: 8-12 minutes
  // For 100-question full tests: 60 minutes
  // For 200-question Tier II tests: 120-135 minutes
};

// Helper function to get manual timing for a test
export function getManualTiming(testId) {
  return TEST_TIMING_CONFIG[testId] || null;
}

// Helper function to check if a test has manual timing configured
export function hasManualTiming(testId) {
  return testId in TEST_TIMING_CONFIG;
}