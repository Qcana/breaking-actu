require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const NEWSDATA_KEY = process.env.NEWSDATA_KEY || '';
const API_SECRET = process.env.API_SECRET || '';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors({
  origin: true,
  allowedHeaders: ['Content-Type', 'x-api-token'],
}));
app.use(express.json({ limit: '5mb' }));

// Protection par token secret
app.use('/api', (req, res, next) => {
  if (!API_SECRET) return next(); // pas de secret = pas de protection (dev local)
  const token = req.headers['x-api-token'] || req.query.token;
  if (token !== API_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

// === NEWS ===
app.get('/api/top-headlines', async (req, res) => {
  const { sources, pageSize = 5 } = req.query;

  let url = `https://newsdata.io/api/1/latest?apikey=${NEWSDATA_KEY}&country=fr&language=fr&size=${pageSize}`;

  if (sources) {
    url += `&domain=${sources}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'success' && data.results) {
      const articles = data.results.map((a) => ({
        title: a.title,
        description: a.description || a.content || '',
        url: a.link,
        urlToImage: a.image_url,
        publishedAt: a.pubDate,
        source: { name: a.source_name || 'Inconnu' },
        category: Array.isArray(a.category) ? a.category : [],
      }));

      res.json({ status: 'ok', totalResults: articles.length, articles });
    } else {
      res.json({ status: 'ok', totalResults: 0, articles: [] });
    }
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// === SUMMARY IA (Claude) ===
app.post('/api/summary', async (req, res) => {
  const { articles, lang = 'fr' } = req.body;

  if (!articles || !Array.isArray(articles) || articles.length === 0) {
    return res.status(400).json({ error: 'Articles array is required' });
  }

  if (!ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: 'AI summary not configured' });
  }

  const isFr = lang === 'fr';
  const locale = isFr ? 'fr-FR' : 'en-US';
  const date = new Date().toLocaleDateString(locale, {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  // Préparer les articles pour le prompt
  const articleList = articles.map((a, i) =>
    `${i + 1}. [${a.source?.name || 'Inconnu'}] ${a.title}\n   ${a.description || ''}`
  ).join('\n');

  const systemPrompt = isFr
    ? `Tu es un journaliste français qui rédige des briefings d'actualité concis et engageants. Tu dois répondre UNIQUEMENT avec du JSON valide, sans texte avant ou après.`
    : `You are a journalist writing concise and engaging news briefings. You must respond ONLY with valid JSON, no text before or after.`;

  const userPrompt = isFr
    ? `Voici les ${articles.length} actualités du ${date}. Génère un briefing structuré en JSON avec ce format exact :

{
  "intro": "Une phrase d'introduction engageante mentionnant la date et le nombre d'actus",
  "bulletPoints": [
    {
      "title": "Titre court reformulé",
      "summary": "Résumé en 1-2 phrases claires et informatives",
      "emoji": "emoji pertinent",
      "category": "CATÉGORIE EN MAJUSCULES",
      "color": "couleur hex de la catégorie",
      "source": "nom de la source"
    }
  ],
  "spokenText": "Texte naturel et fluide pour lecture à voix haute, comme un présentateur radio. Commence par Bonjour, inclus tous les articles, termine par une formule de conclusion."
}

Les catégories possibles : INTERNATIONAL, POLITIQUE, ÉCONOMIE, SOCIÉTÉ, TECHNO, SCIENCE, SPORT
Les couleurs : INTERNATIONAL=#a5b4fc, POLITIQUE=#cbd5e1, ÉCONOMIE=#6ee7b7, SOCIÉTÉ=#fdba74, TECHNO=#fcd34d, SCIENCE=#c4b5fd, SPORT=#93c5fd

Articles :
${articleList}`
    : `Here are ${articles.length} news items for ${date}. Generate a structured briefing as JSON with this exact format:

{
  "intro": "An engaging intro sentence mentioning the date and number of items",
  "bulletPoints": [
    {
      "title": "Short reformulated title",
      "summary": "Summary in 1-2 clear informative sentences",
      "emoji": "relevant emoji",
      "category": "CATEGORY IN CAPS",
      "color": "hex color for category",
      "source": "source name"
    }
  ],
  "spokenText": "Natural flowing text for text-to-speech, like a radio presenter. Start with Hello, include all articles, end with a closing line."
}

Possible categories: WORLD, POLITICS, ECONOMY, SOCIETY, TECH, SCIENCE, SPORTS
Colors: WORLD=#a5b4fc, POLITICS=#cbd5e1, ECONOMY=#6ee7b7, SOCIETY=#fdba74, TECH=#fcd34d, SCIENCE=#c4b5fd, SPORTS=#93c5fd

Articles:
${articleList}`;

  try {
    const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text = message.content[0].text;
    const summary = JSON.parse(text);

    res.json({ status: 'ok', summary, source: 'ai' });
  } catch (err) {
    console.error('AI summary error:', err.message);
    res.status(500).json({ error: 'AI summary failed', message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy running on http://localhost:${PORT}`);
});
