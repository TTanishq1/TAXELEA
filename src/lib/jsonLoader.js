// Utility to load JSON files from tests-organized/tests directory
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

// Generate leaf card structure from actual JSON files
export function generateLeafCardsFromPath(structure, basePath = "") {
  const cards = [];
  
  for (const [key, value] of Object.entries(structure)) {
    const currentPath = basePath ? `${basePath}/${key}` : key;
    
    if (value._files) {
      // This is a leaf node with files
      for (const file of value._files) {
        cards.push({
          id: file.id,
          title: file.title || file.name,
          provider: file.provider || "Unknown",
          questionCount: file.questionCount || 0,
          path: `${currentPath}/${file.name}`,
          exam: file.exam,
          year: file.year,
          tier: file.tier,
          shift: file.shift,
          duration: file.duration,
        });
      }
    } else if (typeof value === "object" && value !== null) {
      // This is a directory, recurse
      cards.push(...generateLeafCardsFromPath(value, currentPath));
    }
  }
  
  return cards;
}

// Parse filename to extract metadata
export function parseFilename(filename) {
  const parts = filename.replace('.json', '').split('-');
  return {
    id: filename,
    name: filename.replace('.json', ''),
    title: filename.replace('.json', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
  };
}
