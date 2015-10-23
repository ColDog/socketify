import React from 'react';
import Router from 'react-router';
import Layout from './Layout';
import Home from 'Home';
import Dashboard from 'Dashboard';
var {DefaultRoute, Route} = Router;
import user from 'user';

var routes = (
  <Route name="app" path="/" handler={Layout}>
    <Route name="dashboard" handler={Dashboard} onEnter={user().authenticate}/>
    <DefaultRoute handler={Home}/>
  </Route>
);

module.exports = routes;
