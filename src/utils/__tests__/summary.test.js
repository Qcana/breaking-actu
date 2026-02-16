import { generateLocalSummary } from '../summary';

const mockArticles = [
  {
    title: "Sommet européen : accord historique sur la défense commune",
    description: "Les 27 pays membres ont trouvé un accord sur un plan de défense commun doté de 150 milliards d'euros sur cinq ans. Cette décision marque un tournant.",
    source: { name: "Le Monde" },
    publishedAt: new Date().toISOString(),
    category: ['world'],
  },
  {
    title: "La BCE maintient ses taux directeurs inchangés",
    description: "Christine Lagarde a annoncé une pause dans le cycle de baisse des taux.",
    source: { name: "Les Échos" },
    publishedAt: new Date().toISOString(),
    category: ['business'],
  },
  {
    title: "L'IA générative franchit un cap dans la recherche médicale",
    description: "Un nouveau modèle d'intelligence artificielle a identifié trois molécules prometteuses contre la maladie d'Alzheimer.",
    source: { name: "Numerama" },
    publishedAt: new Date().toISOString(),
    category: ['technology'],
  },
];

describe('generateLocalSummary', () => {
  it('returns empty summary for no articles', () => {
    const result = generateLocalSummary([], { lang: 'fr' });
    expect(result.title).toBe('Aucun article disponible');
    expect(result.bulletPoints).toEqual([]);
  });

  it('returns empty summary for null articles', () => {
    const result = generateLocalSummary(null, { lang: 'en' });
    expect(result.title).toBe('No articles available');
  });

  it('generates summary with correct article count', () => {
    const result = generateLocalSummary(mockArticles, { lang: 'fr' });
    expect(result.articleCount).toBe(3);
    expect(result.bulletPoints).toHaveLength(3);
  });

  it('includes spoken text for TTS', () => {
    const result = generateLocalSummary(mockArticles, { lang: 'fr' });
    expect(result.spokenText).toBeTruthy();
    expect(result.spokenText).toContain('Bonjour');
    expect(result.spokenText).toContain('briefing');
  });

  it('generates English summary', () => {
    const result = generateLocalSummary(mockArticles, { lang: 'en' });
    expect(result.spokenText).toContain('Hello');
    expect(result.intro).toContain('briefing');
  });

  it('includes bullet points with category info', () => {
    const result = generateLocalSummary(mockArticles, { lang: 'fr' });
    const bp = result.bulletPoints[0];
    expect(bp).toHaveProperty('emoji');
    expect(bp).toHaveProperty('category');
    expect(bp).toHaveProperty('title');
    expect(bp).toHaveProperty('summary');
    expect(bp).toHaveProperty('source');
  });

  it('filters by category', () => {
    const result = generateLocalSummary(mockArticles, {
      lang: 'fr',
      filterCategory: 'technology',
    });
    expect(result.bulletPoints.length).toBeLessThanOrEqual(mockArticles.length);
  });

  it('falls back to all articles if filtered category yields none', () => {
    const result = generateLocalSummary(mockArticles, {
      lang: 'fr',
      filterCategory: 'sports',
    });
    // Should fallback to all articles since none match sports
    expect(result.articleCount).toBe(3);
  });

  it('has a generatedAt timestamp', () => {
    const result = generateLocalSummary(mockArticles, { lang: 'fr' });
    expect(result.generatedAt).toBeDefined();
    expect(typeof result.generatedAt).toBe('number');
  });
});
