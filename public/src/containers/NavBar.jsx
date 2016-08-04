import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Brand, Search, NavItemOne, NavItemTwo } from '../components/NavBarItems'


class NavBar extends Component {

  render () {

    return (
      <nav className="navbar navbar-default">
        <div className="container">
            <Brand />
          <div className="collapse navbar-collapse" id="fakestagram-navbar">
            <Search />
            <ul className="nav navbar-nav navbar-right">
              <NavItemOne />
              <NavItemTwo />
            </ul>
          </div>
        </div>
      </nav>
    )
  }

}


export default NavBar
