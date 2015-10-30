'use strict';

const fs = require('fs');
const pluralize = require('pluralize');
const path = require('path');

var name = process.argv[2];
var lowered = pluralize(name.toLowerCase());

var actions = [];
process.argv.slice(3, process.argv.length).forEach(function(arg){
  actions.push(arg)
});

var controller =
`'use strict';

module.exports = function(App){
  App.controllers.${name} = {
`;

actions.forEach(function(action, idx){
  controller +=
    `
      ${action}: function(req, res, next){
        next()
      }${idx == action.length - 1 ? '' : ','}

    `;
});

controller += `
  }
};
`;

fs.writeFile(path.resolve(__dirname, '../', 'application', 'controllers', `${name}.js`), controller);
