'use strict';

const fileTools = require('tela/file-tools');
const path = require('path');

module.exports = function(App){
  fileTools.requireAllWith(path.resolve(__dirname, 'migrate'), [App.db]);
};
