import React from 'react'
import ReactDom from 'react-dom'


export default React.createClass({
  render: function () {
    var headingStyle = {
      marginLeft: -15
    }
    return (
      <form className="form-horizontal" method="POST" action="http://localhost:3030/login/">
        <div className="row">
          <div className="col-md-4 col-md-offset-4">
            <h4 style={headingStyle}>Already have an account?</h4>
            <div className="form-group">
              <input type="text" className="form-control" name="username" id="username" placeholder="Username" />
            </div>
            <div className="form-group">
              <input type="password" className="form-control" name="password" id="password" placeholder="Password" />
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary btn-block">Log in</button>
            </div>
          </div>
        </div>
      </form>
    )
  }
})
