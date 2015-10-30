'use strict';

import React from 'react';
const Resource = require('./tela').Resource;

export default class CommentBox extends React.Component {

  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
    this.state = {data: []}
    this.handleSubmit = this.handleSubmit.bind(this)
    this.store = new Resource({
      path: '/comments',
      after: this.handleUpdate.bind(this)
    })
  }

  handleUpdate(data){
    console.log('handle update')
    this.setState(data)
  }

  handleSubmit(comment) {
    this.state.data.push(comment)
    this.store.create(comment)
  }

  componentDidMount() {
    this.store.all()
  }

  render() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onSubmit={this.handleSubmit.bind(this)} />
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
      <div className="comment" key={this.props.id}>
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
    console.log( 'comment list data', this.props.data )
    var nodes = this.props.data.map(function(comment){
      return (
        <Comment name={comment.name} key={comment.id}>
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
      this.props.onSubmit({name: author, content: text})
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

React.render
