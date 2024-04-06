require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const bodyParser = require('body-parser');
const urlDatabase = {};

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
    const originalUrl = req.body.url;

    const httpRegex = /^(http|https)(:\/\/)/;
    if (!httpRegex.test(originalURL)) {return res.json({ error: 'invalid url' })}



    const urlHost = new URL(originalUrl).hostname;
    dns.lookup(urlHost, (err) => {

        if (err) {
            return res.status(400).json({ error: 'Invalid URL'});
        }

        function generateUniqueId() {
          const timestamp = Date.now().toString(36);
          const randomStr = Math.random().toString(36).substr(2, 5); // Using substring to remove "0."

          return `${timestamp}-${randomStr}`;
        }

        const shortUrl = generateUniqueId();

        urlDatabase[shortUrl] = originalUrl;
        console.log(urlDatabase);

        res.json({ original_url: originalUrl, short_url: shortUrl });
    });
});

app.get('/api/shorturl/:shortUrl', (req, res) => {
    const shortUrl = req.params.shortUrl;

    if (!urlDatabase.hasOwnProperty(shortUrl)) {
        return res.status(404).json({ error: 'short url not found' });
    }

    res.redirect(urlDatabase[shortUrl]);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
