import React from 'react';
import Router from 'react-router';
var {RouteHandler} = Router;
import Menu from 'Menu';
import Login from 'login';
import user from 'user'

class App extends React.Component {
  render() {
    console.log('user().loggedIn =', user().loggedIn)
    var main = (user().loggedIn) ? <RouteHandler /> : <Login />
    return (
      <div>
        <Menu />
        {main}
      </div>
    );
  }
}

module.exports = App;

