require('dotenv').config();
const express = require('express');
const cors = require('cors');

const NEWSDATA_KEY = process.env.NEWSDATA_KEY || '';
const ELEVENLABS_KEY = process.env.ELEVENLABS_KEY || '';
const API_SECRET = process.env.API_SECRET || '';
const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
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

// === TTS ElevenLabs ===
const ELEVENLABS_VOICES = [
  { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger', description: 'Décontracté, casual', gender: 'male' },
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', description: 'Chaleureux, captivant', gender: 'male' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', description: 'Mature, rassurante', gender: 'female' },
  { id: 'Xb7hH8MSUJpSbSDYk0k2', name: 'Alice', description: 'Claire, engageante', gender: 'female' },
];

app.get('/api/tts/voices', (req, res) => {
  res.json({ voices: ELEVENLABS_VOICES });
});

app.post('/api/tts/speak', async (req, res) => {
  const { text, voiceId } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const voice = voiceId || ELEVENLABS_VOICES[0].id;

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: err.detail?.message || 'TTS error' });
    }

    res.set({
      'Content-Type': 'audio/mpeg',
      'Transfer-Encoding': 'chunked',
    });

    const reader = response.body.getReader();
    const pump = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
    };
    await pump();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy running on http://localhost:${PORT}`);
});
