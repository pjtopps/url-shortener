var fs = require('fs'),
    express = require('express'),
    http = require('http'),
    app = express(),
    ans = {},
    url = "mongodb://petey:randomuser@ds143532.mlab.com:43532/urls";

app.use(express.static('public'));



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

