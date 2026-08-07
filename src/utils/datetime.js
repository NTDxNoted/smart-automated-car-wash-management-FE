/**
 * Utility functions for date and time formatting across the application.
 * The backend always serializes DateTime fields as true UTC ISO strings
 * (see UtcDateTimeJsonConverter), so parsing must let JS convert UTC -> local
 * instead of stripping the 'Z' and reading the value as if it were local.
 */

export function parseLocalDate(isoStr) {
  if (!isoStr) return null;
  const dateObj = new Date(isoStr);
  return isNaN(dateObj.getTime()) ? null : dateObj;
}

const VN_UTC_OFFSET_MINUTES = 7 * 60;

// Converts a VN wall-clock date/time (as picked from the booking slot grid)
// into a true UTC ISO string, independent of the browser's own timezone.
export function vnLocalToUtcIso(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = timeStr.split(':').map(Number);
  if ([year, month, day, hour, minute].some(Number.isNaN)) return null;
  const utcMs = Date.UTC(year, month - 1, day, hour, minute, 0) - VN_UTC_OFFSET_MINUTES * 60 * 1000;
  return new Date(utcMs).toISOString();
}

export function formatDateTime(iso, locale = 'vi') {
  const d = parseLocalDate(iso);
  if (!d) return '—';
  return d.toLocaleString(locale === 'en' ? 'en-US' : 'vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function formatScheduledTime(timeStr) {
  const dateObj = parseLocalDate(timeStr);
  if (!dateObj) return '-';

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const isToday = dateObj.toDateString() === today.toDateString();
  const isTomorrow = dateObj.toDateString() === tomorrow.toDateString();

  const timeFormatted = dateObj.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  if (isToday) {
    return `Hôm nay ${timeFormatted}`;
  }
  if (isTomorrow) {
    return `Ngày mai ${timeFormatted}`;
  }
  const dateFormatted = dateObj.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  return `${dateFormatted} ${timeFormatted}`;
}
