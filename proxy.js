require('dotenv').config();
const express = require('express');
const cors = require('cors');

const NEWSDATA_KEY = process.env.NEWSDATA_KEY || '';
const API_SECRET = process.env.API_SECRET || '';
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

app.listen(PORT, () => {
  console.log(`Proxy running on http://localhost:${PORT}`);
});
