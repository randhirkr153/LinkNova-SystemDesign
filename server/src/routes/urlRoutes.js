const express = require('express');
const router = express.Router();
const { encodeBase62 } = require('../utils/base62');
const rateLimit = require('express-rate-limit');

// In-Memory Storage since Docker/DB is missing
let urlsDb = [];
let sequenceCounter = 1000000;

// Rate limiting for URL creation to prevent abuse
const shortenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many URLs created from this IP, please try again'
});

const isValidUrl = (urlString) => {
  try {
    const url = new URL(urlString);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (err) {
    return false;
  }
};

router.post('/shorten', shortenLimiter, (req, res) => {
  const { long_url } = req.body;

  if (!isValidUrl(long_url)) {
    return res.status(400).json({ error: 'Invalid URL provided' });
  }

  try {
    const existingUrl = urlsDb.find(u => u.long_url === long_url);
    if (existingUrl) {
      return res.json(existingUrl);
    }

    // Assign sequence and generate base62 code
    sequenceCounter += 1;
    const short_url = encodeBase62(sequenceCounter);

    const newUrl = {
      short_url,
      long_url,
      numeric_id: sequenceCounter,
      clicks: 0,
      created_at: new Date()
    };

    urlsDb.push(newUrl);

    res.status(201).json(newUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while shortening URL' });
  }
});

router.get('/:code', (req, res) => {
  const { code } = req.params;

  try {
    const urlDoc = urlsDb.find(u => u.short_url === code);
    if (urlDoc) {
      urlDoc.clicks += 1;
      return res.redirect(301, urlDoc.long_url);
    } else {
      return res.status(404).json({ error: 'No URL found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during redirection' });
  }
});

router.get('/api/url/analytics/:code', (req, res) => {
  try {
    const urlDoc = urlsDb.find(u => u.short_url === req.params.code);
    if (urlDoc) {
      return res.json({
        short_url: urlDoc.short_url,
        long_url: urlDoc.long_url,
        clicks: urlDoc.clicks,
        created_at: urlDoc.created_at
      });
    } else {
      return res.status(404).json({ error: 'URL not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching analytics' });
  }
});

module.exports = router;
