var express = require('express');
var app = express();
var path = require('path');

app.use('/', express.static('build'))
app.get('*/*', function(req, res, next){
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
});

app.listen(3000, function(){
  console.log('static server listening on 3000')
});
