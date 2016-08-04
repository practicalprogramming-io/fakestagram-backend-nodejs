import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import NavBar from './NavBar'


class App extends Component {

  render () {
    return (
        <div>
          <NavBar />
          <div>
            {this.props.children}
          </div>
        </div>
    )
  }

}


export default App
