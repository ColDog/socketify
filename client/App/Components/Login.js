import React from 'react';
import Controller from 'controller';

export default class Login extends React.Component {
  constructor(props) {
    super(props)
    this.store = new Controller({
      name: 'LoginController'
    })
  }

  login(e) {
    e.preventDefault()
    var email = React.findDOMNode(this.refs.email).value.trim()
    var password = React.findDOMNode(this.refs.password).value.trim()
    this.store.create({
      email: email,
      password: password
    }).then(function(result){
      RouterContainer.get().transitionTo('/')
    }, function(err){

    })
  }

  render() {
    return (
      <form onSubmit={this.login.bind(this)}>
        <input type="email" refs="email" placeholder="email" />
        <input type="password" refs="password" placeholder="password" />
        <input type="submit" value="Login" />
      </form>
    )
  }
}
