import React, { Component } from 'react'
import ReactDom from 'react-dom'
import request from 'superagent/lib/client'
import AuthActions from '../actions/AuthActions'
import AuthStore from '../stores/AuthStore'


class Login extends Component {

  constructor () {
    super()
    this.state = {
      authenticated: AuthStore.isAuthenticated()
    }
    this.processForm = this.processForm.bind(this)
  }

  processForm (event) {
    let self = this
    event.preventDefault()
    request.post('http://localhost:3030/login/')
      .type('form')
      .send({username: this.refs.username.value})
      .send({password: this.refs.password.value})
      .set('Accept', 'application/json')
      .end(function (error, response) {
        if (error) console.log(error)
        AuthActions.logUserIn(response.body.user, response.body.token)
        self.setState({authenticated: true})
      })
  }

  render () {
    let headingStyle = {
      marginLeft: -15
    }
    return (
      <form className="form-horizontal" onSubmit={this.processForm.bind(this)}>
        <div className="row">
          <div className="col-md-4 col-md-offset-4">
            <h4 style={headingStyle}>Already have an account?</h4>
            <div className="form-group">
              <input type="text" className="form-control" ref="username" id="username" placeholder="Username" />
            </div>
            <div className="form-group">
              <input type="password" className="form-control" ref="password" id="password" placeholder="Password" />
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary btn-block">Log in</button>
            </div>
          </div>
        </div>
      </form>
    )
  }
}


export default Login
