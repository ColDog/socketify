module.exports = (io, socket, App) ->
  # add socket emitters to the app using io.emit or socket.emit
  # get all users by accessing App.socketUsers = { username: socketId }