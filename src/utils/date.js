export function formatDate(dateString, lang = 'fr') {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (lang === 'en') {
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  }

  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export function getTodayFormatted(lang = 'fr') {
  const locale = lang === 'en' ? 'en-US' : 'fr-FR';
  return new Date().toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function getDateKey(date = new Date()) {
  return date.toISOString().split('T')[0];
}

export function formatFullDate(dateString, lang = 'fr') {
  const date = new Date(dateString);
  const locale = lang === 'en' ? 'en-US' : 'fr-FR';
  const datePart = date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const timePart = date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
  return lang === 'en' ? `${datePart} at ${timePart}` : `${datePart} à ${timePart}`;
}

export function formatDateGroupLabel(dateKey, lang = 'fr') {
  const today = getDateKey();
  const yesterday = getDateKey(new Date(Date.now() - 86400000));

  if (dateKey === today) return lang === 'en' ? 'Today' : "Aujourd'hui";
  if (dateKey === yesterday) return lang === 'en' ? 'Yesterday' : 'Hier';

  const locale = lang === 'en' ? 'en-US' : 'fr-FR';
  const date = new Date(dateKey + 'T12:00:00');
  return date.toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}
