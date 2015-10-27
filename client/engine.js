user = function(data) {
  // if initialized with an argument, set the localstorage elements
  if (data) {
    localStorage.setItem('fabtoken', data.token);
    localStorage.setItem('fabemail', data.user.email);
    localStorage.setItem('fabname', data.user.name);
    localStorage.setItem('fabid', data.user.id);
    localStorage.setItem('fabexpires', data.expiry)
  }

  var expires = localStorage.getItem('fabexpires');
  var valid = Math.floor(expires) > Math.floor(new Date() / 1000);
  var token = localStorage.getItem('fabtoken');
  return {

    token:    token,
    email:    localStorage.getItem('fabemail'),
    name:     localStorage.getItem('fabname'),
    id:      localStorage.getItem('fabid'),
    expires:  expires,
    valid:    valid,
    loggedIn: valid && token,

    // redirect if not authenticated
    authenticate: function(nextState, transition) {
      if (!valid && token) {
        transition.to('/login')
      }
    },

    // logout a user by removing credentials
    logout: function() {
      localStorage.removeItem('fabtoken');
      localStorage.removeItem('fabemail');
      localStorage.removeItem('fabname');
      localStorage.removeItem('fabexpires')
    }
  }
};
socket = {};
var SOCKET_URL = (SOCKET_URL || 'ws://localhost:8000');
socket.ws = new WebSocket(SOCKET_URL);

socket.callbacks = {};
socket.channels = {};

socket.on = function(channel, callback) {
  (socket.channels[channel] = (socket.channels[channel] || [])).push(callback)
};

socket.emit = function(channel, data) {
  socket.ws.send(JSON.stringify({
    channel: channel,
    data: data
  }))
};

socket.onconnection = function() {
  console.log('socket connected')
};

socket.request = function(opts, callback) {
  var id = Math.random().toString(35).substring(2,30);
  if (typeof opts !== 'object') {
    opts = {data: opts}
  }
  opts.id = id;
  socket.ws.send(JSON.stringify(opts));
  socket.callbacks[id] = callback
};

socket.ws.onmessage = function(msg) {
  var data = JSON.parse(msg.data);
  if (data.id) {
    socket.callbacks[data.id](data.data)
  } else if (data.channel) {
    for (var i=0;i<socket.channels[data.channel].length;i++) {
      socket.channels[data.channel][i](data.data)
    }
  }
};

socket.ws.onopen = function(evt) {
  socket.onconnection(evt)
};

function Resource(opts) {
  this.name       = opts['name'];                // controller name to be used on the server
  this.updatesTo  = (opts['updatesTo'] || {});   // methods to be called when new data is recieved for an action
  this.errorsTo   = (opts['errorsTo']  || {});   // methods to be called when there is an error
  this.queries    = (opts['queries'] || {});     // a cache of queries called when the server says data has been updated
  this.mode       = (opts['mode'] || 'socket');  // mode of transportation 'http' or 'socket'.
  this.path       = opts['path'];                // path prefix for restful resourced

  this.fetch = function(opts) {
    var self = this;
    console.log('this', this);
    return new Promise(function (resolve, reject) {
      var act = (opts['action'] || '');
      var par = (opts['params'] || {});
      var cache = (opts['cache'] || false);
      var token = (opts['token'] || user().token);
      var controller = (opts['controller'] || self.name);
      var route = (opts['route'] || '/');
      var mode = (opts['mode'] || self.mode);
      console.log(self);
      if (cache) { self.queries[act] = par } // if is a reader request, cache the query

      if (mode === 'socket') {
        socket.request({
            controller: controller, action: act, params: par, token: token
          }, function (data) {
            if (!data.authenticated) {
              user().logout()
            }
            if (data.user) {
              user(data.user)
            }
            if (data.error) {
              reject(data);
              throw data.errorMessage
            }
            if (typeof self.updatesTo[act] === 'function') {
              self.updatesTo[act](data)
            }
            resolve(data)
          })
      } else if (mode === 'http') {
        console.log('sending POST:', self.path + route);
        var http = new XMLHttpRequest();
        http.open("POST", self.path + route, true);
        http.setRequestHeader("Content-type", "application/json");
        http.send(JSON.stringify({params: par, token: token}))
        http.onreadystatechange = function () {
          if (http.readyState == 4 && http.status == 200) {
            console.log('recieved response');
            resolve(JSON.parse(http.responseText))
          }
        }
      } else {
        throw 'Mode must be either http or socket'
      }
    })
  }
}


Resource.prototype.show      = function(id)    { return this.fetch({mode: 'socket', action: 'show', params: {id: id}, cache: true }) }
Resource.prototype.where     = function(pars)  { return this.fetch({mode: 'socket', action: 'where', params: pars, cache: true }) }
Resource.prototype.all       = function()      { return this.fetch({mode: 'socket', action: 'all', params: {}, cache: true }) }
Resource.prototype.create    = function(pars)  { return this.fetch({mode: 'socket', action: 'create', params: pars, cache: false }) }
Resource.prototype.destroy   = function(id)    { return this.fetch({mode: 'socket', action: 'destroy', params: {id: id}, cache: false }) }
Resource.prototype.update    = function(pars)  { return this.fetch({mode: 'socket', action: 'update', params: pars, cache: false }) }
Resource.prototype.$show     = function(id)    { return this.fetch({route: '/'+id, mode: 'http', action: 'show', params: {id: id}, cache: true }) }
Resource.prototype.$where    = function(pars)  { return this.fetch({route: '/search', mode: 'http', action: 'where', params: pars, cache: true }) }
Resource.prototype.$all      = function()      { return this.fetch({route: '/', mode: 'http', action: 'all', params: {}, cache: true }) }
Resource.prototype.$create   = function(pars)  { return this.fetch({route: '/create', mode: 'http', action: 'create', params: pars, cache: false }) }
Resource.prototype.$destroy  = function(id)    { return this.fetch({route: '/'+id+'/destroy', mode: 'http', action: 'destroy', params: {id: id}, cache: false }) }
Resource.prototype.$update   = function(pars)  { return this.fetch({route: '/'+pars.id+'/update', mode: 'http', action: 'update', params: pars, cache: false }) }
