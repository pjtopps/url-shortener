var fs = require('fs'),
    express = require('express'),
    http = require('http'),
    app = express(),
    url = "mongodb://petey:randomuser@ds143532.mlab.com:43532/urls",
    mongo = require('mongodb').MongoClient;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
})

app.get('*', (req, res) => {
  
  var toShorten = req.originalUrl.slice(1),
      replaced = toShorten.replace(/[.]/g, '-'),
      clientsIp = req.headers['x-forwarded-for'].split(',')[0],
      randomNum = Math.round(9999 * Math.random()),
      ans = {},
      options = {method: 'HEAD', host: toShorten, port: 80, path: '/'};
  
  
  mongo.connect(url, function(err, db) {
    if (err) throw err;
    
    var collection = db.collection('ips');
    
    //first check whether the parameter is a url code in the database.
    collection.find({
      ipAddress: clientsIp
    })
      .project({
      [toShorten]: 1,
      _id: 0
    })
      .toArray(function(err, docs) {
      
      //if the param IS a code exists in the database...
      if (docs[0][toShorten]) {
        
      }
      else {
        //check if the 
        var check = http.request(options, function(r) {
    
          //i.e. follwing code will only execute if web-address is valid
          if (r.headers['content-type']) {
            console.log('passed check');

            //now connect to database and update it by finding clients doc - unique-id being its ipAddress prop
            mongo.connect(url, function(err, db) {
              if (err) throw err;

              var collection = db.collection('ips');

              collection.update({
                ipAddress: clientsIp
              }, {
                $set: {[randomNum]: toShorten}
              }, {
                'upsert': true
              })
                .then(function() {
                console.log('got to be here');

                ans["Original Url"] = toShorten;
                ans["Shortened Url"] = "https://fcc-urlshortener.glitch.me/" + randomNum;

                res.send(ans);
                db.close();
              });
            });
          }
        });
        check.end();
      }
    });
  });
  
  /*
  //check that the web-address passed as a parameter is valid    
  var check = http.request(options, function(r) {
    
    //i.e. follwing code will only execute if web-address is valid
    if (r.headers['content-type']) {
            console.log('passed check');
            
            //now connect to database and update it by finding clients doc - unique-id being its ipAddress prop
            mongo.connect(url, function(err, db) {
              if (err) throw err;
              
              var collection = db.collection('ips');
              
              collection.update({
                ipAddress: clientsIp
              }, {
                $set: {[randomNum]: toShorten}
              }, {
                'upsert': true
              })
                .then(function() {
                console.log('got to be here');
                
                ans["Original Url"] = toShorten;
                ans["Shortened Url"] = "https://fcc-urlshortener.glitch.me/" + randomNum;
                
                res.send(ans);
                db.close();
              });
              
            });
            
          }
    
      });
  
  check.end();
  */
});

app.listen(process.env.PORT, function () {
  console.log('Node.js listening ...');
});

