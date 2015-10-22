/** @jsx React.DOM */

// Globals
socket    = require('socket.io-client')('http://localhost:3000');
user      = require('./engine/user.js')
model     = require('./engine/models.js')

// React Modules
var React         = require('react');
var CommentBox    = require('./CommentBox.js');


React.render(<CommentBox data={data}/>, document.body);