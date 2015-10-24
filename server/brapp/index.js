module.exports = function(app) {
  "use strict";
  require('./app/controllers')(app);
  require('./app/middleware')(app);
  require('./app/models')(app);
  require('./app/routes')(app)
}
