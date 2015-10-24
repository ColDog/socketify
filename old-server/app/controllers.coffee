# This is where you define all your controllers which are callable from the client
# Controllers must be defined on 'App.Controllers' and not just on App.
# This is a basic security feature, since middleware can dynamically call anything on
# App.Controllers but not on App. Therefore, make sure every function on App.Controllers
# is protected from exploitation.

module.exports = (App)->
  App.Controllers.CommentsController = App.BaseController(App.Comments, 'CommentsController')

  App.Controllers.LoginController = {
    create: App.methods.authenticate
  }

  App.Controllers.RegistrationsController = {
    create: App.methods.register
  }
