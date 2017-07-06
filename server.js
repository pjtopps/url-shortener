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
        //HOW THE FUCK TO REDIRECT??
        console.log('in here');
        console.log(docs);
        //var host = 
        http.request({method: 'GET', host: docs[0][toShorten], port: 80, path: '/'}, function(returned) {
          console.log('further in');
          console.log(returned);
          res.send(returned);
          db.close();
        })
      }
      
      //if param NOT a code in the database
      else {
        //check if the param is a valid web-address
        var check = http.request(options, function(r) {
          console.log('passed check');

          //now update database by finding clients doc - unique-id being its ipAddress prop
          collection.update({
            ipAddress: clientsIp
          }, {
            $set: {[randomNum]: toShorten}
          }, {
            'upsert': true
          })
            .then(function() {
            console.log('got to be here');

            //set up object to return to the client
            ans["Original Url"] = toShorten;
            ans["Shortened Url"] = "https://fcc-urlshortener.glitch.me/" + randomNum;

            db.close();
            res.send(ans);
          });
        });
        
        //inform client if their param is not a valid web-address
        check.on('error', (e) => {
          db.close();
          res.send('That is not a valid web-address');
        });
        
        check.end();
      }
    });
  });
});

app.listen(process.env.PORT, function () {
  console.log('Node.js listening ...');
});

