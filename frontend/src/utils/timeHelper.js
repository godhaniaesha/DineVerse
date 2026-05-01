/**
 * Convert a timestamp to a human-readable relative time format
 * Examples: "1 min", "5 min", "12h", "1 day", "2 days", "1 year"
 */
export const getRelativeTime = (createdAt) => {
  if (!createdAt) return "Unknown";

  const date = new Date(createdAt);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffYears = Math.floor(diffDays / 365);

  if (diffMins < 1) return "now";
  if (diffMins < 2) return "1 min";
  if (diffMins < 60) return `${diffMins} min`;
  if (diffHours < 1) return "now";
  if (diffHours === 1) return "1h";
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays === 1) return "1 day";
  if (diffDays < 365) return `${diffDays} days`;
  if (diffYears === 1) return "1 year";
  return `${diffYears} years`;
};

/**
 * Format timestamp to show date and time
 * Examples: "May 1, 2026 at 3:45 PM"
 */
export const getFormattedDateTime = (createdAt) => {
  if (!createdAt) return "Unknown";

  const date = new Date(createdAt);
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };

  return date.toLocaleDateString('en-US', options);
};
