'use strict';

module.exports = function(App){
  const Comment = require('../models/Comment')(App);

  App.controllers.Comment = {
    index: function(req, res, next){
      this.body = Comment.all();
      next()
    },
    show: function(req, res, next) {
      this.body = Comment.find( this.params.id );
      next()
    },
    create: function(req, res, next) {
      var rec = new Comment( safeParams(this.params) );
      if (rec.save()) {

        App.broadcast('update', {
          model: Comment.table,
          type: 'create',
          id: rec.id,
          record: rec._toObj()
        });

        this.body = rec;
        next()
      } else {
        this.error(400, rec._errors);
        next()
      }
    },
    update: function(req, res, next){
      var rec = Comment.find(this.params.id);
      if (rec.update( safeParams(this.params) )) {
        this.body = rec;
        next()
      } else {
        this.error(400, rec._errors);
        next()
      }
    },
    destroy: function(req, res, next) {
      var rec = Comment.find(this.params.id);
      if (rec.destroy()) {
        this.body = 'Destroyed successfully';
        next()
      } else {
        this.error(400, rec._errors);
        next()
      }
    },
    where: function(req, res, next){
      this.body = Comment.where(this.params.query);
      next()
    }
  };

  function safeParams(params) {
    return App.db.helpers.safeParams(params, [
      'name', 'content'
    ])
  }

  App.router.resource('/comments', App.controllers.Comment)
};
