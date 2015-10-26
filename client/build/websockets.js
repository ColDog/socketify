socket = {};
socket.ws = new WebSocket('ws://localhost:8000');
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
  console.log('socket opened');
};
