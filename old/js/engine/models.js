App = {}
/** App.insert
 *  Client version of the model constructor
 */
constructModel = function(name) {
  var Model = {}
  Model.show = {}
  Model.index = []
  Model.name = name
  Model.queries = []
  Model.events = new Evemit()

  Model.emit = function(act, par, cb) {
    Model.queries.push({act: act, par: par})
    par = (par || {})
    var id = genId()
    socket.emit('post', {id: id, model: Model.name, action: act, params: par, token: App.user().token})
    socket.once('response:' + id, function (data) {
      cb(data)
      //App.events.emit('render') todo should keep?
    })

  }

  // todo causing infinite loop
  //socket.on('update', function(name){
  //  if (name === Model.name) {
  //    Model.queries.forEach(function(query){
  //      Model.emit(query.act, query.par)
  //    })
  //  }
  //})

  // Reset queries if the url changes, since this will
  // render a new template with new queries
  App.events.on('url change', function(){
    Model.queries = []
  })


  Model.create    = function(par, cb)   { return Model.emit('create',   par, cb) }
  Model.update    = function(par, cb)   { return Model.emit('update',   par, cb) }
  Model.destroy   = function(par, cb)   { return Model.emit('destroy',  par, cb) }
  Model.find      = function(par, cb)   { return Model.emit('find',     par, cb) }
  Model.find_by   = function(par, cb)   { return Model.emit('find_by',  par, cb) }
  Model.all       = function(par, cb)   { return Model.emit('all',      null, cb) }
  Model.register  = function(par, cb)   { return Model.emit('register', par, cb) }
  Model.login     = function(par, cb)   { return Model.emit('login',    par, cb) }

  return Model
}

