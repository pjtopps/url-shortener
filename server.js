var fs = require('fs');
var express = require('express');
var http = require('http');
var app = express();

app.use(express.static('public'));

var ans = {};

app.get('*', (req, res) => {
  
  console.log(req.params)
  
  var http = require('http'),
      options = {method: 'HEAD', host: req.params[0], port: 80, path: '/'};
  
  console.log(options.host);
      
  var req = http.request(options, function(r) {
          console.log(JSON.stringify(r.headers));
          if (r.headers['content-type']) console.log('you may pass....')
      });
  req.end();
});

app.listen(process.env.PORT, function () {
  console.log('Node.js listening ...');
});

