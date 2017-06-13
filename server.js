var fs = require('fs');
var express = require('express');
var app = express();

app.use(express.static('public'));

var ans = {};

app.get('*', (req, res) => {
  
  ans.ipaddress = req.ip;
  
  ans.
  
  res.send(ans);
});

app.listen(process.env.PORT, function () {
  console.log('Node.js listening ...');
});

