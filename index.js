require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const validator = require('validator');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

const urlLookup = {};
let URL_NUMBER = 0;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.use(bodyParser.urlencoded({extended: false}));

app.get('/api/shorturl/:id', (req, res) => {
  res.redirect(urlLookup[req.params.id]);
});

app.post('/api/shorturl', (req, res) => {
  if(!validator.isURL(req.body.url))
  {
    res.json({
      error: 'invalid url'
    });
    return;
  }
  for (const key in urlLookup) {
    if(urlLookup[key] == req.body.url)
    {
      res.json({
        original_url: req.body.url,
        short_url: key
      });
      return;
    }
  }
  
  urlLookup[URL_NUMBER++] = req.body.url;
  res.json({
    original_url: req.body.url,
    short_url: URL_NUMBER - 1
  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
