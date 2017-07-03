var fs = require('fs'),
    express = require('express'),
    http = require('http'),
    app = express(),
    ans = {},
    url = "mongodb://petey:randomuser@ds143532.mlab.com:43532/urls",
    mongo = require('mongodb').MongoClient;

app.use(express.static('public'));



app.get('*', (req, res) => {
  
  console.log('everything ok?')
  //var reg = /\./g;
  var toShorten = req.originalUrl.slice(1),
      clientsIp = req.headers['x-forwarded-for'].split(',')[0],
      randomNum = Math.round(9999 * Math.random());
  
  toShorten = toShorten.replace('/\./g', '-');
  
  var http = require('http'),
      options = {method: 'HEAD', host: toShorten, port: 80, path: '/'};
  
      
  var check = http.request(options, function(r) {
          if (r.headers['content-type']) {
            console.log('passed check');
            console.log(toShorten);
            
            mongo.connect(url, function(err, db) {
              if (err) throw err;
              
              var collection = db.collection('ips');
              
              collection.update({
                ipAddress: clientsIp
              }, {
                $set: {[toShorten]: randomNum}
              }).then(function() {
                console.log('got to be here');
                db.close();
              });
              
              /*
              collection.insertOne({
                    ipAddress: clientsIp
                  });
              
              
              collection.find({ipAddress: clientsIp}).toArray(function(err, docs) {
                
                console.log(docs);
                
                if (docs.length === 0) {
                  console.log('a new addition...');
                  
                  
                  
                }
                else {
                  console.log('in here');
                  /*
                  collection.updateOne({
                    ipAddress: clientsIp
                  }, {
                    $set: {toShorten: randomNum}
                  });*//*
                  
                }
              });
              
              db.close();
            */
            });
            
          }
      });
  check.end();
});

app.listen(process.env.PORT, function () {
  console.log('Node.js listening ...');
});

