const App = require('engine');

App.useBefore(function(req, res, next){
  res.hello = 'hello person';
  next()
});

App.listen(8000);
