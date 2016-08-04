import React, { Component } from 'react'
import ReactDOM from 'react-dom'


export class Brand extends Component {

  render () {
    return (
      <div className="navbar-header">
        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#fakestagram-navbar" aria-expanded="false">
          <span className="sr-only">Toggle navigation</span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
        </button>
        <a className="navbar-brand" href="/">Fakestagram</a>
      </div>
    )
  }

}


export class Search extends Component {

  render () {
    var navbarSearchStyle = {
      position: 'absolute',
      width: '100%',
      left: 0,
      margin: 'auto',
      marginLeft: '40%',
      marginTop: 7
    }

    return (
      <form className="navbar-form navbar-left" style={navbarSearchStyle}>
        <div className="input-group">
          <input type="text" className="form-control" placeholder="Search" />
          <span className="input-group-btn">
            <button className="btn btn-default" type="button">
              <span className="glyphicon glyphicon-search" aria-hidden="true"></span>
            </button>
          </span>
        </div>
      </form>
    )
  }

}


export class Favorites extends Component {

  render () {
    return (
      <li><a href="#"><span className="glyphicon glyphicon-heart" aria-hidden="true"></span></a></li>
    )
  }

}


export class User extends Component {

  render () {
    return (
      <li><a href="/:username/"><span className="glyphicon glyphicon-user" aria-hidden="true"></span></a></li>
    )
  }

}
