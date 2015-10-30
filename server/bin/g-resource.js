'use strict';

const fs = require('fs');
const pluralize = require('pluralize');
const path = require('path');

var name = process.argv[2];
var lowered = pluralize(name.toLowerCase());

var controller = `
'use strict';

module.exports = function(App){
  const ${name} = require('../models/${name}')(App);

  App.controllers.${name} = {
    index: function(req, res, next){
      this.body = ${name}.all();
      next()
    },
    show: function(req, res, next) {
      this.body = ${name}.find( this.params.id );
      next()\
    },
    create: function(req, res, next) {
      var rec = new ${name}( safeParams(this.params) );
      if (rec.save()) {
        this.body = rec;
        next()
      } else {
        this.error(400, rec._errors);
        next()
      }
    },
    update: function(req, res, next){
      var rec = ${name}.find(this.params.id);
      if (rec.update( safeParams(this.params) )) {
        this.body = rec;
        next()
      } else {
        this.error(400, rec._errors);
        next()
      }
    },
    destroy: function(req, res, next) {
      var rec = ${name}.find(this.params.id);
      if (rec.destroy()) {
        this.body = 'Destroyed successfully';
        next()
      } else {
        this.error(400, rec._errors);
        next()
      }
    },
    where: function(req, res, next){
      this.body = ${name}.where(this.params.query);
      next()
    }
  };

  function safeParams(params) {
    return App.db.helpers.safeParams(params, [
      'name', 'email', 'password' // todo more of your params
    ])
  }

  App.router.resource('/${pluralize(name.toLowerCase())}', App.controllers.${name})
};
`;

fs.writeFile(path.resolve(__dirname, '../', 'application', 'controllers', `${name}.js`), controller);
