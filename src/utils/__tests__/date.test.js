import { formatDate, getDateKey, formatDateGroupLabel, getTodayFormatted } from '../date';

describe('getDateKey', () => {
  it('returns YYYY-MM-DD format', () => {
    const date = new Date('2026-02-16T14:30:00Z');
    expect(getDateKey(date)).toBe('2026-02-16');
  });

  it('defaults to today', () => {
    const result = getDateKey();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('formatDate', () => {
  it('shows minutes ago in French', () => {
    const tenMinAgo = new Date(Date.now() - 10 * 60000).toISOString();
    expect(formatDate(tenMinAgo, 'fr')).toBe('Il y a 10 min');
  });

  it('shows minutes ago in English', () => {
    const tenMinAgo = new Date(Date.now() - 10 * 60000).toISOString();
    expect(formatDate(tenMinAgo, 'en')).toBe('10 min ago');
  });

  it('shows hours ago for recent dates', () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 3600000).toISOString();
    expect(formatDate(threeHoursAgo, 'fr')).toBe('Il y a 3h');
    expect(formatDate(threeHoursAgo, 'en')).toBe('3h ago');
  });

  it('shows date for older articles', () => {
    const oldDate = new Date(Date.now() - 3 * 86400000).toISOString();
    const result = formatDate(oldDate, 'fr');
    // Should not contain "Il y a" for dates older than 24h
    expect(result).not.toContain('Il y a');
  });
});

describe('formatDateGroupLabel', () => {
  it('returns "Aujourd\'hui" for today in French', () => {
    const today = getDateKey();
    expect(formatDateGroupLabel(today, 'fr')).toBe("Aujourd'hui");
  });

  it('returns "Today" for today in English', () => {
    const today = getDateKey();
    expect(formatDateGroupLabel(today, 'en')).toBe('Today');
  });

  it('returns "Hier" for yesterday in French', () => {
    const yesterday = getDateKey(new Date(Date.now() - 86400000));
    expect(formatDateGroupLabel(yesterday, 'fr')).toBe('Hier');
  });

  it('returns "Yesterday" for yesterday in English', () => {
    const yesterday = getDateKey(new Date(Date.now() - 86400000));
    expect(formatDateGroupLabel(yesterday, 'en')).toBe('Yesterday');
  });

  it('returns formatted date for older dates', () => {
    const result = formatDateGroupLabel('2026-01-01', 'fr');
    expect(typeof result).toBe('string');
    expect(result).not.toBe("Aujourd'hui");
    expect(result).not.toBe('Hier');
  });
});

describe('getTodayFormatted', () => {
  it('returns a string in French by default', () => {
    const result = getTodayFormatted('fr');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(5);
  });

  it('returns a string in English', () => {
    const result = getTodayFormatted('en');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(5);
  });
});
