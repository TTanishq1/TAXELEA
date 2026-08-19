/**
 * Centralized timezone utilities for IST (GMT+5:30) handling
 * All date/time operations should use these functions to ensure consistency
 */

/**
 * Get current date/time in IST timezone
 * @returns {Date} Current date adjusted to IST
 */
export function getISTDate() {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const istOffset = 5.5 * 3600000; // IST is GMT+5:30
  return new Date(utc + istOffset);
}

/**
 * Convert a timestamp to IST date string
 * @param {number|string} timestamp - Unix timestamp or ISO string
 * @returns {string} Date string in IST timezone
 */
export function getISTDateString(timestamp) {
  const date = new Date(timestamp);
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  const istOffset = 5.5 * 3600000;
  const istDate = new Date(utc + istOffset);
  return istDate.toDateString();
}

/**
 * Get today's date string in IST timezone
 * @returns {string} Today's date string in IST
 */
export function getISTToday() {
  return getISTDate().toDateString();
}

/**
 * Get yesterday's date string in IST timezone
 * @returns {string} Yesterday's date string in IST
 */
export function getISTYesterday() {
  const istDate = getISTDate();
  istDate.setDate(istDate.getDate() - 1);
  return istDate.toDateString();
}

/**
 * Format a date for display in IST timezone
 * @param {Date|string|number} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export function formatISTDate(date, options = {}) {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    ...options,
    timeZone: 'Asia/Kolkata'
  });
}

/**
 * Check if a given date is today in IST timezone
 * @param {Date|string|number} date - Date to check
 * @returns {boolean} True if the date is today in IST
 */
export function isISTToday(date) {
  const dateStr = typeof date === 'string' ? date : getISTDateString(date);
  return dateStr === getISTToday();
}

/**
 * Get the start of day in IST timezone for a given date
 * @param {Date|string|number} date - Date to get start of day for
 * @returns {Date} Start of day in IST
 */
export function getISTStartOfDay(date) {
  const istDate = typeof date === 'string' || typeof date === 'number' ? new Date(date) : new Date(date);
  const utc = istDate.getTime() + (istDate.getTimezoneOffset() * 60000);
  const istOffset = 5.5 * 3600000;
  const istDateTime = new Date(utc + istOffset);
  
  istDateTime.setHours(0, 0, 0, 0);
  
  // Convert back to UTC
  const istTime = istDateTime.getTime();
  const utcTime = istTime - istOffset;
  return new Date(utcTime - (istDateTime.getTimezoneOffset() * 60000));
}