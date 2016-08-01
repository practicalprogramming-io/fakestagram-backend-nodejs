import React from 'react'
import ReactDom from 'react-dom'


export default React.createClass({
  render: function () {
    var headingStyle = {
      marginLeft: -15
    }
    return (
      <form className="form-horizontal" method="POST" action="http://localhost:3030/register/">
        <div className="row">
          <div className="col-md-4 col-md-offset-4">
            <h4 style={headingStyle}>Don't have an account?</h4>
            <div className="form-group">
              <input type="email" className="form-control" name="email" id="email" placeholder="Email" />
            </div>
            <div className="form-group">
              <input type="text" className="form-control" name="fullname" id="fullname" placeholder="Full Name" />
            </div>
            <div className="form-group">
              <input type="text" className="form-control" name="username" id="username" placeholder="Username" />
            </div>
            <div className="form-group">
              <input type="password" className="form-control" name="password" id="password" placeholder="Password" />
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary btn-block">Sign up</button>
            </div>
          </div>
        </div>
      </form>
    )
  }
})
