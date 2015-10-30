'use strict';

module.exports = function(db){
  db.schema.hasTable('comments').then(function(exists) {
    if (!exists) {
      return db.schema.createTable('comments', function(t) {
        t.increments('id').primary();
        t.timestamps('updated_at');
        t.string('name');
        t.text('content');
      });
    }
  });
};
