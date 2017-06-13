var fs = require('fs');
var express = require('express');
var app = express();

app.use(express.static('public'));

var ans = {};

app.get('*', (req, res) => {
  
  ans.ipaddress = req.headers['x-forwarded-for'].split(',')[0];
  
  ans.language = req.headers['accept-language'].split(',')[0];
  
  ans.software = req.headers['user-agent'].split(/[()]/g)[1];
  
  res.send(ans);
});

app.listen(process.env.PORT, function () {
  console.log('Node.js listening ...');
});

