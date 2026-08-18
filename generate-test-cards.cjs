const fs = require('fs');
const path = require('path');

// Function to recursively scan directory and collect JSON files
function scanDirectory(dir, basePath = '') {
  const results = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const relativePath = path.join(basePath, item.name);
    
    if (item.isDirectory()) {
      results.push(...scanDirectory(fullPath, relativePath));
    } else if (item.name.endsWith('.json')) {
      try {
        const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        // Use provider from JSON data if available, otherwise extract from path structure
        let provider = data.provider || 'Unknown';
        
        // If no provider in JSON and path is full test, try to extract from folder structure
        if (!data.provider && relativePath.startsWith('full/')) {
          const pathParts = relativePath.split('/');
          if (pathParts.length >= 4) {
            // Structure: full/{examType}/{provider}/{file}.json
            provider = pathParts[2]; // e.g., 'testbook', 'oliveboard', etc.
          } else if (pathParts.length === 3) {
            // Structure: full/{examType}/{file}.json (no provider folder)
            provider = 'Other';
          }
        }
        
        // Normalize provider names to lowercase with hyphens
        const providerMapping = {
          'Testbook': 'testbook',
          'Oliveboard': 'oliveboard',
          'RBE_Mocks': 'rbe-mocks',
          'The Solvers': 'pundits',
          'Pundits': 'pundits',
        };
        
        provider = providerMapping[provider] || provider.toLowerCase();
        
        results.push({
          id: item.name.replace('.json', ''),
          title: data.title || item.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          path: relativePath.replace(/\\/g, '/'),
          questionCount: data.questionCount || data.questions?.length || 0,
          provider: provider,
          exam: data.exam,
          year: data.year,
          tier: data.tier,
          duration: data.duration,
        });
      } catch (error) {
        console.error(`Error reading ${fullPath}:`, error.message);
      }
    }
  }
  
  return results;
}

// Scan both sectional and full tests
const testsBasePath = path.join(__dirname, 'public', 'tests-organized', 'tests');
const sectionalPath = path.join(testsBasePath, 'sectional');
const fullPath = path.join(testsBasePath, 'full');

console.log('Scanning for test JSON files...');

const sectionalTests = scanDirectory(sectionalPath, 'sectional');
const fullTests = scanDirectory(fullPath, 'full');

console.log(`Found ${sectionalTests.length} sectional tests`);
console.log(`Found ${fullTests.length} full tests`);

// Group by subject/topic for sectional
const sectionalBySubject = {};
sectionalTests.forEach(test => {
  const pathParts = test.path.split('/');
  if (pathParts.length >= 3) {
    const subject = pathParts[1];
    const topic = pathParts[2];
    
    if (!sectionalBySubject[subject]) {
      sectionalBySubject[subject] = {};
    }
    if (!sectionalBySubject[subject][topic]) {
      sectionalBySubject[subject][topic] = [];
    }
    sectionalBySubject[subject][topic].push(test);
  }
});

// Group by provider for full tests
const fullByProvider = {};
fullTests.forEach(test => {
  const pathParts = test.path.split('/');
  if (pathParts.length >= 3) {
    const examType = pathParts[1];
    const provider = pathParts[2];
    
    if (!fullByProvider[examType]) {
      fullByProvider[examType] = {};
    }
    if (!fullByProvider[examType][provider]) {
      fullByProvider[examType][provider] = [];
    }
    fullByProvider[examType][provider].push(test);
  }
});

// Generate the testCards.js file
const output = `// Auto-generated test cards from tests-organized/tests directory
// Generated on: ${new Date().toISOString()}

export const SECTIONAL_TEST_CARDS = [
${sectionalTests.map(test => `  {
    id: '${test.id}',
    title: '${test.title.replace(/'/g, "\\'")}',
    subject: '${test.path.split('/')[1] || 'mixed'}',
    topic: '${test.path.split('/')[2] || 'general'}',
    path: '${test.path}',
    questionCount: ${test.questionCount},
    provider: '${test.provider}',
  }`).join(',\n')}
];

export const FULL_TEST_CARDS = [
${fullTests.map(test => `  {
    id: '${test.id}',
    title: '${test.title.replace(/'/g, "\\'")}',
    examType: '${test.path.split('/')[1] || 'ssc-cgl'}',
    provider: '${test.provider}',
    path: '${test.path}',
    questionCount: ${test.questionCount},
    duration: ${test.duration || 60},
  }`).join(',\n')}
];

// Helper function to load test JSON
export async function loadTestJSON(path) {
  try {
    const response = await fetch(\`/tests-organized/tests/\${path}\`);
    if (!response.ok) throw new Error(\`Failed to load \${path}\`);
    return await response.json();
  } catch (error) {
    console.error(\`Error loading JSON \${path}:\`, error);
    return null;
  }
}

// Helper to get cards by subject/topic
export function getSectionalCardsBySubject(subject) {
  return SECTIONAL_TEST_CARDS.filter(card => card.subject === subject);
}

export function getSectionalCardsByTopic(subject, topic) {
  return SECTIONAL_TEST_CARDS.filter(card => card.subject === subject && card.topic === topic);
}

export function getFullTestCardsByProvider(provider) {
  return FULL_TEST_CARDS.filter(card => card.provider === provider);
}
`;

fs.writeFileSync(path.join(__dirname, 'src', 'data', 'testCards.js'), output);
console.log('Generated testCards.js with', sectionalTests.length, 'sectional and', fullTests.length, 'full tests');
console.log('Total tests:', sectionalTests.length + fullTests.length);