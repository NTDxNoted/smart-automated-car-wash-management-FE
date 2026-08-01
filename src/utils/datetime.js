/**
 * Utility functions for date and time formatting across the application.
 * Strips trailing 'Z' from scheduledTime ISO strings to prevent double UTC+7 offset shifts.
 */

export function parseLocalDate(isoStr) {
  if (!isoStr) return null;
  const cleanStr = typeof isoStr === 'string' ? isoStr.replace(/Z$/i, '') : isoStr;
  const dateObj = new Date(cleanStr);
  return isNaN(dateObj.getTime()) ? null : dateObj;
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
