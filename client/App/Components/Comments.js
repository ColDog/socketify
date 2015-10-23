'use strict';

import React from 'react';
var Controller = require('controller')
var CommentsController = new Controller('CommentsController')

export default class CommentBox extends React.Component {

  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
    this.state = {data: []}
  }

  componentDidMount() {
    var self = this
    CommentsController.all(function(data) {
      self.setState(data)
      console.log('this state', self.state)
    })
  }

  render() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm />
      </div>
    )
  }
}

class Comment extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="comment">
        <h5>{this.props.name}</h5>
        {this.props.children}
      </div>
    )
  }
}

class CommentList extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    var nodes = this.props.data.map(function(comment){
      return (
        <Comment name={comment.name}>
          {comment.content}
        </Comment>
      )
    })

    return (
      <div className="commentList">
        {nodes}
      </div>
    )
  }
}

class CommentForm extends React.Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(e) {
    e.preventDefault();
    var author  = React.findDOMNode(this.refs.author).value.trim();
    var text    = React.findDOMNode(this.refs.text).value.trim();
    if (text && author) {
      CommentsController.create({name: author, content: text})
      React.findDOMNode(this.refs.author).value = '';
      React.findDOMNode(this.refs.text).value = '';
    }
  }

  render() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit.bind(this)}>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="text" />
        <input type="submit" value="Post" />
      </form>
    );
  }
}

