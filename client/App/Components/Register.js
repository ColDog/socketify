import React from 'react';
import Controller from 'controller';
import serialize from 'form-serialize';
import {Navigation} from 'react-router';
var RegistrationsController = new Controller({ name: 'RegistrationsController' });

export default class Login extends React.Component {
  constructor(props) {
    super(props)
    this.mixins = [ Navigation ]
  }

  login(e) {
    e.preventDefault()
    var nav = this.context.router
    var user = serialize('register-form')
    RegistrationsController.create(user).then(
      function(result){
        if(result.authenticated) {
          flash('Registration successful.')
          nav.transitionTo('/')
        } else {
          flash('Registration failed.')
        }
      },
      function(err)   { console.log(err) }
    )
  }

  render() {
    return (
      <form onSubmit={this.login.bind(this)} className="content" id="register-form">
        <input name="email"     type="text"     placeholder="email" />
        <input name="name"     type="text"     placeholder="email" />
        <input name="password"  type="password" placeholder="password" />
        <input name="password_confirmation"  type="password" placeholder="password confirmation" />
        <input type="submit" value="Login" />
      </form>
    )
  }
}

Login.contextTypes = {
  router: React.PropTypes.func.isRequired
}
