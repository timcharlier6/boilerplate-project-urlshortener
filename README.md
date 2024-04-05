# URL Shortener Microservice

This is the boilerplate code for the URL Shortener Microservice project. Instructions for building your project can be found at https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/url-shortener-microservice.

```js
const express = require('express');
const bodyParser = require('body-parser');
const dns = require('dns');
const { nanoid } = require('nanoid');

const app = express();
const PORT = 3000;

// Dummy database to store original URLs and their corresponding short URLs
const urlDatabase = {};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Endpoint to create a short URL
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  // Check if the URL is valid using DNS lookup
  const urlPattern = /^(http|https):\/\/[^ "]+$/;
  if (!urlPattern.test(originalUrl)) {
    return res.status(400).json({ error: 'invalid url' });
  }

  const urlHost = new URL(originalUrl).hostname;
  dns.lookup(urlHost, (err) => {
    if (err) {
      return res.status(400).json({ error: 'invalid url' });
    }

    // Generate a short URL
    const shortUrl = nanoid(6);

    // Store the original URL and its corresponding short URL in the database
    urlDatabase[shortUrl] = originalUrl;

    res.json({ original_url: originalUrl, short_url: shortUrl });
  });
});

// Endpoint to redirect to the original URL
app.get('/api/shorturl/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl;

  // Check if the short URL exists in the database
  if (!urlDatabase.hasOwnProperty(shortUrl)) {
    return res.status(404).json({ error: 'short url not found' });
  }

  // Redirect to the original URL
  res.redirect(urlDatabase[shortUrl]);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

```
