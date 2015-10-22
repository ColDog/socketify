/** @jsx React.DOM */
var React = require('react');

var CommentBox = React.createClass({
  getInitialState: function() {
    // set a watcher for socket.io
    return {data: []}
  },
  componentDidMount: function() {
    //  get messages from socket.io when mounted
  },
	render: function() {
		return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.props.data} />
        <CommentForm />
      </div>
		)
	}
})

var Comment = React.createClass({
  render: function() {
    return (
      <div className="comment">
        <h5>{this.props.author}</h5>
        {this.props.children}
      </div>
    )
  }
})

var CommentList = React.createClass({
  render: function() {
    var nodes = this.props.data.map(function(comment){
      return (
        <Comment author={comment.author}>
          {comment.text}
        </Comment>
      )
    })
    return (
      <div className="commentList">
        {nodes}
      </div>
    )
  }
})

var CommentForm = React.createClass({
  render: function() {
    return (
      <div className="commentForm"></div>
    )
  }
})
	
module.exports = CommentBox
