import React from 'react'
import ReactDOM from 'react-dom'
import Login from '../components/Login'
import Register from '../components/Register'


export default React.createClass({
  render: function () {
    var containerStyle = {
      marginTop: 50
    }
    , headingStyle = {
      marginLeft: -15
    }
    return (
      <div className="container" style={containerStyle}>
        <div className="row">
          <div className="col-md-4 col-md-offset-4">
            <h2 style={headingStyle}>Fakestagram</h2>
          </div>
        </div>
        <Login />
        <Register />
      </div>
    )
  }
})
