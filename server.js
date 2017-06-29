var fs = require('fs');
var express = require('express');
var http = require('http');
var app = express();

app.use(express.static('public'));

var ans = {};

app.get('*', (req, res) => {
  
  
  var http = require('http'),
      options = {method: 'HEAD', host: req.originalUrl.slice(1), port: 80, path: '/'};
  
      
  var req = http.request(options, function(r) {
          if (r.headers['content-type']) console.log('you may pass....')
      });
  req.end();
});

app.listen(process.env.PORT, function () {
  console.log('Node.js listening ...');
});

