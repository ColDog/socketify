module.exports = (App) ->
  App.middleware = []

  App.add = (middleware)->
    App.middleware.push(middleware)
    return App

  App.run = (req, res, cb)->

    # main function that runs the actual middleware
    doAsync = (funcs, req, res) ->
      (next = ->
        if funcs.length > 0
          f = funcs.shift()
          f(req, res, next)
      )()

    # check if this socket or request fits the parameters
    if req.controller && req.action
      App.middleware.push( App.Controllers[ req.controller ][ req.action ] )

    # push whatever callback onto the list of functions
    App.middleware.push( cb )

    # do the actual middleware
    doAsync(App.middleware, req, res)

  App.httpMiddleware = (req, res, next)->
    areq = req.params # change into App.middleware version
    ares = {}

    App.run(areq, ares, ->
      res.app = ares
      req.app = areq
      next()
    )