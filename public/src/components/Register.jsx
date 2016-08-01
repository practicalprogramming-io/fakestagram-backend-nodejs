import React from 'react'
import ReactDom from 'react-dom'
import request from 'superagent/lib/client'


export default React.createClass({
  processForm: function (event) {
    event.preventDefault()
    request.post('http://localhost:3030/register/')
      .type('form')
      .send({username: this.refs.username.value})
      .send({password: this.refs.password.value})
      .send({email: this.refs.email.value})
      .send({fullname: this.refs.fullname.value})
      .set('Accept', 'application/json')
      .end(function (error, response) {
        if (error) console.log(error)
        console.log(response)
      })
  },

  render: function () {
    var headingStyle = {
      marginLeft: -15
    }
    return (
      <form className="form-horizontal" onSubmit={this.processForm}>
        <div className="row">
          <div className="col-md-4 col-md-offset-4">
            <h4 style={headingStyle}>Don't have an account?</h4>
            <div className="form-group">
              <input type="email" className="form-control" ref="email" id="email" placeholder="Email" />
            </div>
            <div className="form-group">
              <input type="text" className="form-control" ref="fullname" id="fullname" placeholder="Full Name" />
            </div>
            <div className="form-group">
              <input type="text" className="form-control" ref="username" id="username" placeholder="Username" />
            </div>
            <div className="form-group">
              <input type="password" className="form-control" ref="password" id="password" placeholder="Password" />
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
