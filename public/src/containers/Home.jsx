import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import request from 'superagent/lib/client'


class Home extends Component {

  constructor (props) {
    super()
    this.state = {
      url: 'http://localhost:3030/' + props.params.username + '/content/',
      data: null,
      pagination: null
    }
  }

  componentDidMount () {
    this.request = request.get(this.state.url)
      .end(function (error, response) {
        if (error) console.log(error)
        this.setState({
          data: response.body.data,
          pagination: response.body.metadata.pagination
        })
      }.bind(this))
  }

  componentWillUnmount () {
    this.request.abort()
  }

  render () {
    console.log(this.state)
    return (
      <div className="container">

      </div>
    )
  }

}


export default Home
