'use strict';

module.exports = function(App) {

  class Comment extends App.db.Model {
    constructor(attrs) {
      super(attrs)
    }
  }

  return Comment
};
