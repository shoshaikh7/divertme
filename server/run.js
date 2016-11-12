'use strict';

var app = require('./server.js');
var port = process.argv[2] || process.env.PORT || 8080;

app.listen(port, function () {
  console.log('Server running at http://127.0.0.1:' + port);
});
