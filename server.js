var fs = require('fs');
var express = require('express');
var app = express();

app.use(express.static('public'));

var ans = {};

app.get('*', (req, res) => {
  
  console.log(req.para)
});

app.listen(process.env.PORT, function () {
  console.log('Node.js listening ...');
});

