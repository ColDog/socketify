module.exports = (App) ->
  App.middleware = []

  # Adds middleware onto the stack
  App.add = (middleware)->
    App.middleware.push(middleware)
    return App

  # Simple async function available. Calls next with a
  # request and response object passed in.
  App.doAsync = (funcs, req, res) ->
    (next = ->
      if funcs.length > 0
        f = funcs.shift()
        f(req, res, next)
    )()

  # Run the middleware with a request, a response and a callback function once it is
  # completed.
  App.run = (req, res, cb)->
    # check if this socket or request fits the parameters. There must be a controller
    # at that route, and the parameters must have a controller and action specified
    # there is a little debugging script that will warn you if no controller is defined
    if req.controller && req.action
      if !App.Controllers[req.controller]
        console.warn('You do not have a controller defined for this request:', req.controller, 'to:', req.action)
      else
        App.middleware.push( App.Controllers[ req.controller ][ req.action ] )

    App.middleware.push( cb )             # push the final handler onto the middleware stack
    App.doAsync(App.middleware, req, res) # do the actual middleware

  App.httpMiddleware = (req, res, next)->
    ares = {} # this version wants an empty object.
    App.run(req, ares, ->
      res.app = ares
      req.app = areq
      next()
    )
