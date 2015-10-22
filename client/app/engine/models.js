var Evemit = require('evemit');

controller = function(name) {
  var cntrl = {}
  cntrl.name = name
  cntrl.queries = []
  cntrl.events = new Evemit

  // When the application tells us a record has been updated,
  // we check if it affects our model, then we run through and
  // call the queries and their callbacks again.
  socket.on('update', function(name){
    if (name === cntrl.name) { // if name matches, go for it
      cntrl.queries.forEach(function(query){
        cntrl.emit(query.act, query.par, query.cb) // have to make sure these don't block each other
      })
    }
  })

  // The main emitter, caches the queries in a variable and calls
  // the socket on the server end. When ready, it calls the callback
  cntrl.emit = function(act, par, cb) {
    cntrl.queries.push({act: act, par: par, cb: cb})

    par = (par || {})
    var id = Math.random().toString(36).substring(7)

    socket.emit('post', {id: id, controller: cntrl.name, action: act, params: par, token: user().token})

    socket.once('response:' + id, function (data) {
      cb(data)
    })
  }

  // Helper functions for common controller functions which map to the back end
  cntrl.show    = function(id, cb)    { cntrl.emit('show', id, cb) }
  cntrl.all     = function(cb)        { cntrl.emit('all', null, cb) }
  cntrl.create  = function(pars, cb)  { cntrl.emit('create', pars, cb) }
  cntrl.destroy = function(id, cb)    { cntrl.emit('destroy', id, cb) }
  cntrl.update  = function(pars, cb)  { cntrl.emit('update', pars, cb) }

}

module.exports = controller
