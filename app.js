'use strict';

const App = require('tela');
App.db  = require('tela/orm')({
  client: 'sqlite3',
  connection: {
    filename: './test.sqlite'
  }
});

App.middleware = [
  App.router.match,
  App.db.helpers.toJson
];

require('./application')(App);
require('./db')(App);
require('./routes')(App);


App.listen(3000);

module.exports = App;
