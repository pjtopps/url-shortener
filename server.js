var fs = require('fs');
var express = require('express');
var http = require('http');
var app = express();

app.use(express.static('public'));

var ans = {};

app.get('*', (req, res) => {
  
  //console.log(req.params)
  
  var options = {method: 'HEAD', host: req.params}
  
  var reqq = http.request(options, function(response) {
    console.log(JSON.stringify(response));
  });
});

app.listen(process.env.PORT, function () {
  console.log('Node.js listening ...');
});

