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
    console.log('email', this.refs.email.value)
    var email     = this.refs.email.value.trim()
    var password  = React.findDOMNode(this.refs.password).value.trim()
    this.store.create({
      email: email,
      password: password
    }).then(
      function(result){ console.log('login result', result) },
      function(err)   { }
    )
  }

  render() {
    return (
      <form onSubmit={this.login.bind(this)} className="content">
        <input name="email" type="email" refs="email" placeholder="email" />
        <input name="password"  type="password" refs="password" placeholder="password" />
        <input type="submit" value="Login" />
      </form>
    )
  }
}
