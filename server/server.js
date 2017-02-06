'use strict';

// packages
var express = require('express'),
    morgan = require('morgan'),
    compress = require('compression'),
    requestProxy = require('express-request-proxy');

// instantiate express
var app = express();

// compression
app.use(compress());

// logging
app.use(morgan('combined'));

// serve files in `/public` directory
app.use(express.static('public'));

// Proxy all requests to an API so sensitive information, e.g. API keys, are not exposed client-side.
// Client should make requests to /api as usual with the request path and parameters, but not include the API key.
// Query parameters are appended or replaced in `query` object.
// Any API keys should be removed client-side and set in `query`.
// See documentation here: https://github.com/4front/express-request-proxy

// BASIC FORMAT:
// `/api/*` is the url we want to call from the client, e.g. `app.js`, for the API. Make sure you keep the `*` is kept.
app.all('/api/*', requestProxy({
  url: 'http://api.giphy.com/v1/gifs/*', // must keep `*`
  query: {
    // `apiKey` should correspond to the name of the query param the API expects
    apikey: 'process.env.GIPHY_API_KEY'
  }
}));
app.all('/api/*', requestProxy({
  url: 'https://pixabay.com/api/*', // must keep `*`
  query: {
    // `apiKey` should correspond to the name of the query param the API expects
    apikey: 'process.env.PIXABAY_API_KEY'
  }
}));
app.all('/api/*', requestProxy({
  url: 'https://andruxnet-random-famous-quotes.p.mashape.com/*', // must keep `*`
  query: {
    // `apiKey` should correspond to the name of the query param the API expects
    apikey: 'process.env.RANDOMFAMOUSQUOTES_API_KEY'
  }
}));

module.exports = app;
