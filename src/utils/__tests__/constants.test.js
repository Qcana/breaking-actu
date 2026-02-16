import { getCategoryInfo, CATEGORIES } from '../../constants';

describe('getCategoryInfo', () => {
  it('maps API politics category to politique', () => {
    const result = getCategoryInfo('Unknown', ['politics']);
    expect(result.key).toBe('politique');
  });

  it('maps API business category to economie', () => {
    const result = getCategoryInfo('Unknown', ['business']);
    expect(result.key).toBe('economie');
  });

  it('maps API technology category', () => {
    const result = getCategoryInfo('Unknown', ['technology']);
    expect(result.key).toBe('technology');
  });

  it('maps API sports category', () => {
    const result = getCategoryInfo('Unknown', ['sports']);
    expect(result.key).toBe('sports');
  });

  it('maps API science category', () => {
    const result = getCategoryInfo('Unknown', ['science']);
    expect(result.key).toBe('science');
  });

  it('maps API world category to international', () => {
    const result = getCategoryInfo('Unknown', ['world']);
    expect(result.key).toBe('international');
  });

  it('maps API health category to societe', () => {
    const result = getCategoryInfo('Unknown', ['health']);
    expect(result.key).toBe('societe');
  });

  it('detects tech sources by name', () => {
    const result = getCategoryInfo('Numerama', []);
    expect(result.key).toBe('technology');
  });

  it('detects sports sources by name', () => {
    const result = getCategoryInfo("L'Equipe", []);
    expect(result.key).toBe('sports');
  });

  it('detects economy sources by name', () => {
    const result = getCategoryInfo('Les Échos', []);
    expect(result.key).toBe('economie');
  });

  it('defaults to international for unknown source', () => {
    const result = getCategoryInfo('Random Source', []);
    expect(result.key).toBe('international');
  });

  it('handles null/undefined categories gracefully', () => {
    const result = getCategoryInfo('Test', null);
    expect(result).toBeDefined();
    expect(result.key).toBe('international');
  });

  it('prioritizes API categories over source name', () => {
    // Even though "L'Équipe" is a sports source, if API says technology, use that
    const result = getCategoryInfo("L'Équipe", ['technology']);
    expect(result.key).toBe('technology');
  });
});

describe('CATEGORIES', () => {
  it('has all expected categories', () => {
    const expectedKeys = ['all', 'international', 'politique', 'economie', 'societe', 'technology', 'science', 'sports'];
    expectedKeys.forEach((key) => {
      expect(CATEGORIES[key]).toBeDefined();
      expect(CATEGORIES[key].emoji).toBeDefined();
      expect(CATEGORIES[key].color).toBeDefined();
    });
  });
});
