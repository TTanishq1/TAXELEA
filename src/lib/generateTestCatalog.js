// Utility to generate test catalog from actual JSON files in public/tests-organized/tests
// This will be called at build time or runtime to create the card structure

export async function generateTestCatalog() {
  const catalog = {
    sectional: {},
    full: {},
  };
  
  try {
    // Fetch the directory structure
    await fetch('/tests-organized/tests/sectional');
    await fetch('/tests-organized/tests/full');
    
    // Since we can't directly list directories, we'll use a known structure
    // based on the actual folder structure we saw
    
    // For now, let's create a static mapping based on the known structure
    // This is a fallback approach since we can't dynamically scan directories
    
    // Sectional structure
    const sectionalSubjects = ['reasoning', 'english', 'quantitative-aptitude', 'general-awareness'];
    
    for (const subject of sectionalSubjects) {
      catalog.sectional[subject] = {};
      
      // Try to fetch known topics for each subject
      try {
        const topicsResponse = await fetch(`/tests-organized/tests/sectional/${subject}`);
        if (topicsResponse.ok) {
          // We know the topics from our exploration
          const knownTopics = {
            'reasoning': ['analogy', 'coding-decoding', 'figure-based', 'series', 'classification', 'mathematical-operations', 'blood-relations', 'syllogism', 'mirror-image', 'paper-folding', 'puzzle', 'venn-diagram', 'direction-distance', 'seating-arrangement', 'calendar', 'ranking-order', 'statement-conclusion', 'water-image', 'clock', 'other'],
            'english': ['reading-comprehension', 'idioms-phrases', 'grammar', 'fill-in-the-blanks', 'vocabulary', 'cloze-test', 'error-spotting', 'active-passive', 'antonyms', 'synonyms', 'direct-indirect', 'spelling', 'one-word-substitution', 'para-jumbles', 'sentence-improvement', 'tenses'],
            'quantitative-aptitude': ['simplification', 'geometry', 'number-system', 'mensuration', 'profit-loss', 'algebra', 'trigonometry', 'data-interpretation', 'average', 'time-work', 'percentage', 'time-speed-distance', 'ratio-proportion', 'simple-interest', 'compound-interest', 'discount', 'pipes-cisterns', 'boats-streams', 'trains'],
            'general-awareness': ['geography', 'static-gk', 'polity', 'economics', 'current-affairs', 'modern-history', 'computer-awareness', 'art-culture', 'biology', 'ancient-history', 'medieval-history', 'chemistry', 'physics', 'science-technology', 'general-science', 'environment', 'constitution']
          };
          
          const topics = knownTopics[subject] || [];
          
          for (const topic of topics) {
            catalog.sectional[subject][topic] = { _files: [] };
            
            // Try to fetch files for this topic
            try {
              const topicResponse = await fetch(`/tests-organized/tests/sectional/${subject}/${topic}`);
              if (topicResponse.ok) {
                // Since we can't list files, we'll need to know the file names
                // For now, this is a placeholder - in production you'd have a server endpoint
                // that lists the files in a directory
              }
            } catch (_e) {
              // Topic might not exist, skip
            }
          }
        }
      } catch (_e) {
        // Subject might not exist, skip
      }
    }
    
    // Full test structure
    const fullExamTypes = ['ssc-cgl', 'other-exams'];
    
    for (const examType of fullExamTypes) {
      catalog.full[examType] = {};
      
      if (examType === 'ssc-cgl') {
        const providers = ['testbook', 'oliveboard', 'rbe-mocks', 'pundits'];
        for (const provider of providers) {
          catalog.full[examType][provider] = { _files: [] };
        }
      } else {
        catalog.full[examType]['other'] = { _files: [] };
      }
    }
    
    return catalog;
  } catch (error) {
    console.error('Error generating test catalog:', error);
    return catalog;
  }
}

// Load JSON file content
export async function loadTestJSON(relativePath) {
  try {
    const response = await fetch(`/tests-organized/tests/${relativePath}`);
    if (!response.ok) throw new Error(`Failed to load ${relativePath}`);
    return await response.json();
  } catch (error) {
    console.error(`Error loading JSON ${relativePath}:`, error);
    return null;
  }
}

// Since we can't dynamically scan directories in the browser,
// we'll create a static index of known test files
// This would ideally be generated at build time
export const STATIC_TEST_INDEX = {
  sectional: {
    reasoning: {
      analogy: [
        'analogy-general-knowledge-based-01-1-a49f1584.json',
        'analogy-letter-based-01-06bf9213.json',
        'analogy-number-based-01-1-4a9ed370.json',
        // Add more files as needed
      ],
      // Add other topics
    },
    // Add other subjects
  },
  full: {
    'ssc-cgl': {
      testbook: [
        'ssc-cgl-tier-i-full-test-1-86d23498.json',
        'ssc-cgl-tier-i-full-test-2-9a0bca5d.json',
        // Add more files
      ],
      // Add other providers
    },
    // Add other exam types
  }
};
