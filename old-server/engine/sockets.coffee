module.exports = (App) ->
  App.io.on('connection', (socket)->
    console.log('socket connected')
    require('../app/sockets')(App.io, socket, App)  # user defined sockets

    socket.on('post', (req)->                       # post is what will trigger the middleware functions

      console.log(Date.now(),
        'recieved:', 'post',
        'will respond:', 'response:'+req.id,
        'controller:', req.controller,
        'action:', req.action
      )

      res = {}                                      # set up an empty response
      App.run(req, res, (req, res)->                # run the middleware
        if req.respond
          socket.emit('response:'+req.id, res)      # return the response
        console.log(Date.now(),
          'sending:', 'response:'+req.id,
          'controller:', req.controller,
          'action:', req.action,
          'res:', typeof res
        )
      )
    )
  )
