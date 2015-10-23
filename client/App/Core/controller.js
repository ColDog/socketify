import user from 'user';

class Controller {
  constructor(opts = {}) {
    this.name = opts['name']
    this.onUpdate = opts['onUpdate']
    this.queries = {}

    // When the application tells us a record has been updated,
    // we check if it affects our model, then we run through and
    // call the queries and their callbacks again.
    var self = this;
    socket.on('update', function(name){
      if (name === self.name) {                       // if name matches, go for it
        for (var act in self.queries) {               // loop through and call queries
          self.emit(act, self.queries[act], true, self.queries[cb])
        }
      }
    })
  }

  // The main emitter, caches the queries in a variable and calls
  // the socket on the server end. When ready, it calls the callback
  // takes 4 arguments action, parameters = {}, cache[true|false], callback(function)
  // the action decides the controller action to be called along with the name,
  // the paremeters are passed into the request object on the server. Cache set to true
  // will re-call the function if an update happens on the server, and the callback is invoked after the
  // data returns
  emit(act, par, cache, cb) {
    if (cache) {
      this.queries[act] = {par: par, cb: cb}
    }

    var id = Math.random().toString(36).substring(7)

    // send the post request
    socket.emit('post', {
      id: id, controller: this.name,
      action: act,
      params: par,
      token: user().token
    })

    console.log('should hear at', 'response:'+id)
    socket.once('response:'+id, function (data) {
      console.log('incoming')
      cb(data)
    })
  }

  // Helper functions for common controller functions which map to the back end default functions
  show    (id, cb) { this.emit('show',    {id: id}, true,  cb) }
  all     (cb)     { this.emit('all',     null,     true,  cb) }
  create  (pars)   { this.emit('create',  pars,     false, function(){ console.log('created') }) }
  destroy (id)     { this.emit('destroy', {id: id}, false, function(){ console.log('updated') } ) }
  update  (pars)   { this.emit('update',  pars,     false, function(){ console.log('destroyed') } ) }
}

module.exports = Controller
