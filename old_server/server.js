express         = require('express')
app             = express()
appHttp         = require('http').Server(app)
_               = require('underscore')
//redis           = require('redis').createClient(process.env.REDIS_URL ? process.env.REDIS_URL : null)
bcrypt          = require('bcrypt')
db              = require('mongous').Mongous
jwt             = require('jsonwebtoken')
io              = require('socket.io')(appHttp)
emitter         = new require('events').EventEmitter()
constructModel  = require('./lib/models')
secret  = 'alsdkfnasdlkfna123828130sdjfasdfn;alsdnfasldkfnaskldfn'
port    = (process.env.PORT || 3000)

/** Middleware and configuration */
app.use(express.static('../client'))
app.set('view engine', 'ejs');

/** Engine */
Models = {}
engine = {}
engine.middleware = []
engine.add = function(middleware) {
  engine.middleware.push(middleware)
  return engine
}
engine.run = function(req, res, cb) {
  var runAsync = function(funcs, req, res) {
    (function next() {
      if(funcs.length > 0) {
        var f = funcs.shift()
        f(req, res, next)
      }
    })()
  }

  // Prepare Middleware
  if (req.model && req.action) {
    engine.middleware.push(Models[req.model][req.action])
  }
  if (req.methods) {
    req.methods.forEach(function(method){
      engine.middleware.push(Models[method.model][method.action])
    })
  }
  engine.middleware.push(cb)

  // Run Middleware
  req.emitter = emitter
  runAsync(engine.middleware, req, res)
}

// Runs middleware for socket request
engine.socket = function(req, cb) {
  var res = {}
  engine.run(req, res, cb)
}

engine.http = function(req, res, next) {
  if (_.isEmpty(req.params)) {
    next()
  } else {
    console.log('http req not empty', req)
    var req_eng = req.params
    var res_eng = {}
    res_eng.http = res
    req_eng.http = req

    engine.run(req_eng, res_eng, function(req, res) {
      return res.http.json(res)
    })
  }
}

engine.draw = function(){
  for (var path in engine.routes) {
    if (engine.routes.hasOwnProperty(path)) {
      (function(path, route){
        var action;
        if (route.file) {
          action = function(req, res) { return res.sendFile(engine.routes[path].file, {root: '../client/views'}) }
        } else if (route.action) {
          action = route.action
        } else {
          throw 'No action attached to current route'
        }
        app.get(path, action)
      })(path, engine.routes[path])
    }
  }

}

/** Engine Sockets */
io.on('connection', function(socket){
  console.log('socket connected')

  // Socket post calls and returns the result of a model method
  socket.on('post', function (req) {
    console.log('recieved post', req)
    engine.socket(req, function(req, res){
      var payload = {model: req.model, action: req.action, data: res}
      console.log('responding with', payload)
      socket.emit('response:'+req.id, payload)
    })
  })

  //emitter.on('update', function(name){
  //  io.emit('update', name)
  //})

});

// Engine http
// create routes, add my http functions
app.use(engine.http)
app.post('/engine', function(req, res){ return {} })

require('../app.js')    // require the application
engine.draw()           // draw the routes for the app
appHttp.listen(port, function(){
  console.log('listening on', port)
  console.log(engine, Models)
});
