import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router'
import Bootstrap from 'bootstrap/dist/css/bootstrap.css'
import Landing from './containers/Landing'


ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={Landing}>
      <Route name="home" path="/:username/" handler={Home} />
    </Route>
  </Router>,
  document.getElementById('fakestagram')
)
