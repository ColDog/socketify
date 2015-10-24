var engine = require('engine')
engine.start(function(app){
  require('./brapp')(app); // loads all of brapps middleware, controllers, models into the application

})
