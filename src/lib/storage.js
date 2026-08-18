export async function loadTheme() {
  try {
    const r = await window.storage.get("taxelea:theme", false);
    return r ? r.value : "dark";
  } catch (e) { return "dark"; }
}
export async function saveTheme(t) {
  try { await window.storage.set("taxelea:theme", t, false); } catch (e) {}
}

export async function loadResults() {
  try {
    const r = await window.storage.get("taxelea:results", false);
    return r ? JSON.parse(r.value) : [];
  } catch (e) {
    return [];
  }
}
export async function saveResults(results) {
  try { await window.storage.set("taxelea:results", JSON.stringify(results), false); } catch (e) {}
}
export async function loadBookmarks() {
  try {
    const r = await window.storage.get("taxelea:bookmarks", false);
    return r ? JSON.parse(r.value) : [];
  } catch (e) { return []; }
}
export async function saveBookmarks(bm) {
  try { await window.storage.set("taxelea:bookmarks", JSON.stringify(bm), false); } catch (e) {}
}
