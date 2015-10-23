import React from 'react';
import Router from 'react-router';
var {RouteHandler} = Router;
import Menu from 'Menu';

class App extends React.Component {
  render() {
    return (
      <div>
        <Menu />
        <RouteHandler/>
      </div>
    );
  }
}

module.exports = App;

