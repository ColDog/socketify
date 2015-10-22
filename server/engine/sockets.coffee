module.exports = (App) ->
  App.io.on('connection', (socket)->
    console.log('socket connected')


    require('../app/sockets')(App.io, socket, App)

    socket.on('post', (req)->               # post is what will trigger the middleware functions
      console.log('socket post', req)

      res = {}                              # set up an empty response
      App.run(req, res, (req, res)->        # run the middleware
        console.log('responding with', res)
        socket.emit('response'+req.id, res) # return the response
      )

    )

  )
