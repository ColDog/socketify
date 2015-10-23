module.exports = (App) ->
  App.io.on('connection', (socket)->
    console.log('socket connected')


    require('../app/sockets')(App.io, socket, App)

    socket.on('post', (req)->               # post is what will trigger the middleware functions
      res = {}                              # set up an empty response
      App.run(req, res, (req, res)->        # run the middleware
        console.log('responding with', res, 'to', 'response:'+req.id)
        socket.emit('response:'+req.id, res) # return the response
      )
    )

    # when an update event is emitted from the controller, pass
    # along the message to the clients. They are expected to monitor
    # and rerender their queries if the update affects them.
    App.updates.on('new', (name)-> App.io.emit('update', name))

  )
