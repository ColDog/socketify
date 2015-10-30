'use strict';

const fs = require('fs');
const pluralize = require('pluralize');
const path = require('path');
const ejs = require('ejs');

process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});


var modelName = process.argv[2];
var fields = [];
process.argv.slice(3, process.argv.length).forEach(function(arg){
  var spl = arg.split(':');
  fields.push({ name: spl[0], type: spl[1] })
});

// BUILD MODEL
var model = `
'use strict';

module.exports = function(App){
  class ${ modelName } extends App.db.Model {

  }

  App.db.Models.${ modelName } = ${ modelName }
};
`;

// BUILD SCHEMA
var midsection = "t.increments('id').primary();\nt.timestamps('updated_at');";
for (var i=0;i<fields.length;i++) {
  if (fields[i].type == 'references') {
    // t.integer('user_id').references('id').inTable('users');
                 //         t.increments('id').primary();
    midsection += `         t.integer('${fields[i].name}_id').references('id').inTable('${pluralize(fields[i].name)}');

    `
  } else {
    midsection += `         t.${fields[i].type}('${fields[i].name}');

    `
  }
}

var schema = `
'use strict';

module.exports = function(db){
  db.schema.hasTable('${pluralize(modelName.toLowerCase())}').then(function(exists) {
    if (!exists) {
      return db.schema.createTable('${ pluralize(modelName.toLowerCase()) }', function(t) {
        t.increments('id').primary();
        t.timestamps('updated_at');
        <% fields.forEach(function(field){ -%>
          <% if (field.type === 'references') { -%>
  <%- "t.integer('" + fields[i].name + "_id').references('id').inTable('" + pluralize(fields[i].name) + "');" -%>
          <% } else { -%>
  <%- "t." + field.type + "('" + field.name + "');" -%>
          <% } %>
        <% }) -%>
      });
    }
  });
};
`;


var rendered = ejs.render(schema, {fields: fields} );

fs.writeFile(path.resolve(__dirname, '../', 'application', 'models', `${modelName}.js`), model);
fs.writeFile(path.resolve(__dirname, '../', 'db', 'migrate', `${Date.now()}-${modelName}.js`), rendered);
