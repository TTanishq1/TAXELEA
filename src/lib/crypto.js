// Simple password hashing using Web Crypto API
// Uses SHA-256 for secure password storage

export async function hashPassword(password) {
  try {
    if (!crypto?.subtle) {
      throw new Error('Web Crypto API not available');
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
}

export async function verifyPassword(password, storedHash) {
  try {
    const passwordHash = await hashPassword(password);
    return passwordHash === storedHash;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}
