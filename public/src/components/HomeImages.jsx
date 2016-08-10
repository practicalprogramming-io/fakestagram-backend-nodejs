import React, { Component } from 'react'
import ReactDOM from 'react-dom'


export class HomeImageItem extends Component {

  render () {
    return (
      <img src={this.props.location} className="img-responsive" name={this.props.contentid} />
    )
  }

}


export class HomeImageView extends Component {

  render () {
    return (
      <div></div>
    )
  }

}
