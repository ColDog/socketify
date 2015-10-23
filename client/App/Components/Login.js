import React from 'react';
import Controller from 'controller';
import serialize from 'form-serialize';
import {Navigation} from 'react-router';
var LoginController = new Controller({ name: 'LoginController' });

export default class Login extends React.Component {
  constructor(props) {
    super(props)
    this.mixins = [ Navigation ]
  }

  login(e) {
    e.preventDefault()

    var user = serialize('login-form')
    LoginController.create(user).then(
      function(result){
        if(result.authenticated) {
          flash('Authentication successful.')
          Navigation.transitionTo('/')
        } else {
          flash('Authentication failed.')
        }
      },
      function(err)   { console.log(err) }
    )
  }

  render() {
    return (
      <form onSubmit={this.login.bind(this)} className="content" id="login-form">
        <input name="email"     type="text"     placeholder="email" />
        <input name="password"  type="password" placeholder="password" />
        <input type="submit" value="Login" />
      </form>
    )
  }
}
