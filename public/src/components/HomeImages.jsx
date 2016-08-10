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
    const rowStyle = {
      paddingTop: 15,
      paddingBottom: 15
    }

    if (this.props.thumbnails) {
      return (
        <div>
          <div className="row" style={rowStyle}>
            <div className="col-md-4">{this.props.thumbnails[0]}</div>
            <div className="col-md-4">{this.props.thumbnails[1]}</div>
            <div className="col-md-4">{this.props.thumbnails[2]}</div>
          </div>
          <div className="row" style={rowStyle}>
            <div className="col-md-4">{this.props.thumbnails[3]}</div>
            <div className="col-md-4">{this.props.thumbnails[4]}</div>
            <div className="col-md-4">{this.props.thumbnails[5]}</div>
          </div>
          <div className="row" style={rowStyle}>
            <div className="col-md-4">{this.props.thumbnails[6]}</div>
            <div className="col-md-4">{this.props.thumbnails[7]}</div>
            <div className="col-md-4">{this.props.thumbnails[8]}</div>
          </div>
          <div className="row" style={rowStyle}>
            <div className="col-md-4">{this.props.thumbnails[9]}</div>
            <div className="col-md-4">{this.props.thumbnails[10]}</div>
            <div className="col-md-4">{this.props.thumbnails[11]}</div>
          </div>
        </div>
      )
    }
    return (
      <div></div>
    )
  }

}
