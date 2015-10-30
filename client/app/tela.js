var socket = {};
socket.url = (socket.url || 'ws://localhost:3000');
socket.ws = new WebSocket(socket.url);

socket.callbacks = {};
socket.channels = {};
socket.ready = false;
socket.queue = [];

socket.on = function(channel, callback) {
  (socket.channels[channel] = (socket.channels[channel] || [])).push(callback)
};

socket.emit = function(channel, data) {

  var toSend = JSON.stringify({
    channel: channel,
    data: data
  });

  if (socket.ready) {
    socket.ws.send(toSend);
  } else {
    socket.queue.push(toSend)
  }
};

socket.onconnection = function() {
  console.log('socket connected');
  socket.ready = true;
  socket.queue.forEach(function(msg){
    socket.ws.send(msg);
  })
};

socket.request = function(opts, callback) {
  var sockId = Math.random().toString(35).substring(2,30);
  if (typeof opts !== 'object') {
    opts = {data: opts}
  }
  opts.sockId = sockId;
  if (socket.ready) {
    socket.ws.send(JSON.stringify(opts));
  } else {
    socket.queue.push(JSON.stringify(opts))
  }
  socket.callbacks[sockId] = callback
};

socket.ws.onmessage = function(msg) {
  console.log('recieved message', msg);
  var data = JSON.parse(msg.data);
  console.log('recieved message', data, socket.channels);
  if (data.sockId) {
    socket.callbacks[data.sockId](data.data)
  } else if (data.channel) {
    console.log('channel', data.channel);
    var channel = socket.channels[data.channel];
    if (channel) {
      for (var i=0;i<channel.length;i++) {
        socket.channels[data.channel][i](data.data)
      }
    }
  }
};

socket.ws.onopen = function(evt) {
  socket.onconnection(evt)
};

var post = function(url, params) {
  return new Promise(function(resolve, reject){
    var xhr;

    if(typeof XMLHttpRequest !== 'undefined') xhr = new XMLHttpRequest();
    else {
      var versions = [
        "MSXML2.XmlHttp.5.0",
        "MSXML2.XmlHttp.4.0",
        "MSXML2.XmlHttp.3.0",
        "MSXML2.XmlHttp.2.0",
        "Microsoft.XmlHttp"
      ];

      for(var i = 0, len = versions.length; i < len; i++) {
        try { xhr = new ActiveXObject(versions[i]); break; }
        catch(e){}
      }
    }

    xhr.onreadystatechange = ensureReadiness;
    function ensureReadiness() {
      if(xhr.readyState < 4) { reject(xhr) }
      if(xhr.status !== 200) { reject(xhr) }
      if(xhr.readyState === 4) { resolve(xhr) }
    }

    xhr.open('POST', url, true);
    xhr.send(JSON.stringify(params));
  })
};

var Resource = function(opts) {
  if (!opts || !opts.path) { throw 'Resource definition requires a `path` attribute, ie: new Resource({path: "/users"})' }
  this.queries    = (opts['queries'] || {});     // a cache of queries called when the server says data has been updated
  this.mode       = (opts['mode'] || 'socket');  // mode of transportation 'http' or 'socket'.
  this.path       = opts['path'];                // path prefix for restful resourced
  this.model      = opts['model'];               // path prefix for restful resourced
  this.before     = opts['before'];
  this.after      = opts['after'];
  this.mode       = (opts['mode'] || 'socket');

  var self = this;

  socket.on('update', function(msg){
    if (msg.model == self.model) {
      for (var path in self.queries) {
        self.fetch({
          route: path,
          params: self.queries[path]
        })
      }
    }
  });

  this.fetch = function(opts) {
    var self        = this;

    var par         = (opts['params'] || {});
    var cache       = (opts['cache'] || false);
    var controller  = (opts['controller'] || self.name);
    var route       = (opts['route'] || '/');
    var mode        = (opts['mode'] || self.mode);

    return new Promise(function (resolve, reject) {
      try {

        if (cache) { self.queries[ self.path+route ] = par } // if is a reader request, cache the query
        var req = {params: par, path: self.path+route};

        if (typeof self.before === 'function') { self.before(req) }

        if (mode === 'socket') {

          socket.request(req, function (data) {
            if (typeof self.after === 'function') { self.after(data) }
            resolve(data);
          })

        } else if (mode === 'http') {

          post(req.path, req)
            .then(function(data){
              if (typeof self.after === 'function') { self.after(data) }
              resolve(data);
            })

        } else {
          reject('Mode must be either http or socket')
        }

      } catch (err) {
        reject(err)
      }
    })
  }
};


Resource.prototype.show      = function(id)    { return this.fetch({route: '/'+id, action: 'show', params: {id: id}, cache: true }) }
Resource.prototype.where     = function(pars)  { return this.fetch({route: '/where', action: 'where', params: {query: pars}, cache: true }) }
Resource.prototype.all       = function()      { return this.fetch({route: '/', action: 'all', params: {}, cache: true }) }
Resource.prototype.create    = function(pars)  { return this.fetch({route: '/create', action: 'create', params: pars, cache: false }) }
Resource.prototype.destroy   = function(id)    { return this.fetch({route: '/'+id+'/destroy', action: 'destroy', params: {id: id}, cache: false }) }
Resource.prototype.update    = function(pars)  { return this.fetch({route: '/'+pars.id+'/update', action: 'update', params: pars, cache: false }) }

if (typeof module === 'undefined') {
  window.socket = socket;
  window.Resource = Resource;
} else {
  module.exports.Resource = Resource;
  module.exports.socket = socket;
}
