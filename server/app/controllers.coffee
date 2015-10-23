module.exports = (App)->
  App.Controllers = {
    CommentsController: App.BaseController(App.Comments, App, 'CommentsController')
  }