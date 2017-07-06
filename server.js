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
      //if the param IS a code exists in the database...redirect
      if (docs[0][toShorten]) {
        res.redirect('https://' + docs[0][toShorten]);
        db.close();
      }
      
      //if NOT:
      else {
        console.log('am here');
        //check if the param is a valid web-address by requesting header info. If gives an error, the web-address can't be valid
        var check = http.request(options, function(r) {
          console.log('now here');
          //now update database by finding clients doc (unique-id being its ipAddress prop)
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

            res.send(ans);
            db.close();
          });
        });
        
        //inform client if their param is not a valid web-address
        check.on('error', (e) => {
          res.send('That is not a valid web-address');
          db.close();
        });
        
        check.end();
      }
    });
  });
});

app.listen(process.env.PORT, function () {
  console.log('Node.js listening ...');
});

