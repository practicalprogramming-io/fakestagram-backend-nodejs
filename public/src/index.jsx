import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router'
import Bootstrap from 'bootstrap/dist/css/bootstrap.css'
import Landing from './containers/Landing'
import Home from './containers/Home'
import App from './containers/App'


ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={Landing} />
    <Route path="/" component={App}>
      <Route name="home" path="/:username/" component={Home} />
    </Route>
  </Router>,
  document.getElementById('fakestagram')
)
