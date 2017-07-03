var fs = require('fs'),
    express = require('express'),
    http = require('http'),
    app = express(),
    ans = {},
    url = "mongodb://petey:randomuser@ds143532.mlab.com:43532/urls",
    mongo = require('mongodb').MongoClient;

app.use(express.static('public'));



app.get('*', (req, res) => {
  
  var toShorten = req.originalUrl.slice(1);
  
  var http = require('http'),
      options = {method: 'HEAD', host: toShorten, port: 80, path: '/'};
  
      
  var check = http.request(options, function(r) {
          if (r.headers['content-type']) {
            console.log('passed check');
            
            mongo.connect(url, function(err, db) {
              if (err) throw err;
              
              var collection = db.collection('ips');
              
              /**/
              
              var client = collection.find({ipAdress: req.headers['x-forwarded-for'].split(',')[0]}).toArray(function(err, docs) {
                if (docs.length === 0) {
                  console.log('a new addition...');
                  
                  var randomNum = (9999 * Math.random()).round();
                  
                  collection.insertOne({
                    ipAddress: req.headers['x-forwarded-for'].split(',')[0],
                    urls: {
                      [toShorten]: randomNum
                    }
                  });
                }
                else {
                  
                }
              });
              
              db.close();
            });
            
          }
      });
  check.end();
});

app.listen(process.env.PORT, function () {
  console.log('Node.js listening ...');
});

