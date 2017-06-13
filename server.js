var fs = require('fs');
var express = require('express');
var app = express();

app.use(express.static('public'));



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.listen(process.env.PORT, function () {
  console.log('Node.js listening ...');
});

