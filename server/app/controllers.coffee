module.exports = (App)->
  App.Controllers = {
    CommentsController: new App.BaseController(App.Comments)
  }