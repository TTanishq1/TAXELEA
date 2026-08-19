// Dynamic test catalog generator using Vite's import.meta.glob
// This scans the actual JSON files in tests-organized/tests

// Generate test catalog from actual JSON files
export async function generateTestCatalog() {
  const catalog = {
    sectional: {},
    full: {},
  };
  
  try {
    // Use Vite's import.meta.glob to find all JSON files
    const sectionalModules = import.meta.glob('/tests-organized/tests/sectional/**/*.json', { as: 'url' });
    const fullModules = import.meta.glob('/tests-organized/tests/full/**/*.json', { as: 'url' });
    
    // Process sectional tests
    for (const [path, _url] of Object.entries(sectionalModules)) {
      const relativePath = path.replace('/tests-organized/tests/', '');
      const parts = relativePath.split('/');
      
      // Structure: sectional/{subject}/{topic}/{file}.json
      if (parts.length >= 4) {
        const subject = parts[1];
        const topic = parts[2];
        const file = parts[3];
        
        if (!catalog.sectional[subject]) {
          catalog.sectional[subject] = {};
        }
        if (!catalog.sectional[subject][topic]) {
          catalog.sectional[subject][topic] = { _files: [] };
        }
        
        catalog.sectional[subject][topic]._files.push({
          name: file,
          id: file.replace('.json', ''),
          path: relativePath,
        });
      }
    }
    
    // Process full tests
    for (const [path, _url] of Object.entries(fullModules)) {
      const relativePath = path.replace('/tests-organized/tests/', '');
      const parts = relativePath.split('/');
      
      // Structure: full/{examType}/{provider}/{file}.json or full/{examType}/{file}.json
      if (parts.length >= 3) {
        const examType = parts[1];
        const provider = parts[2];
        const file = parts[3];
        
        if (!catalog.full[examType]) {
          catalog.full[examType] = {};
        }
        if (!catalog.full[examType][provider]) {
          catalog.full[examType][provider] = { _files: [] };
        }
        
        catalog.full[examType][provider]._files.push({
          name: file,
          id: file.replace('.json', ''),
          path: relativePath,
        });
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

// Generate flat list of all test cards
export function generateTestCards(catalog) {
  const cards = [];
  
  // Process sectional cards
  for (const [subject, topics] of Object.entries(catalog.sectional)) {
    for (const [topic, data] of Object.entries(topics)) {
      if (data._files) {
        for (const file of data._files) {
          cards.push({
            id: file.id,
            title: file.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            subject,
            topic,
            path: file.path,
            type: 'sectional',
          });
        }
      }
    }
  }
  
  // Process full test cards
  for (const [examType, providers] of Object.entries(catalog.full)) {
    for (const [provider, data] of Object.entries(providers)) {
      if (data._files) {
        for (const file of data._files) {
          cards.push({
            id: file.id,
            title: file.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            examType,
            provider,
            path: file.path,
            type: 'full',
          });
        }
      }
    }
  }
  
  return cards;
}
