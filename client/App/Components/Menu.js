import React from 'react';
import {Link} from 'react-router';

class MenuItem extends React.Component {
  render() {
    return (
      <li>
        <Link to={this.props.route}>
          {this.props.text}
        </Link>
      </li>
    );
  }
}

class Menu extends React.Component {
  render() {
    return (
      <header>
        <ul>
          <MenuItem route="app" text="Home" />
          <MenuItem route="dashboard" text="Dashboard" />
        </ul>
      </header>
    );
  }
}

module.exports = Menu;
