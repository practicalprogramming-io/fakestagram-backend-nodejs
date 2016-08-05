import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import request from 'superagent/lib/client'
import ImageActions from '../actions/ImageActions'
import ImageStore from '../stores/ImageStore'
import HomeImageItem from '../components/HomeImages'


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
        if (error) throw error
        ImageActions.setCurrentData(response.body.data, response.body.metadata)
      }.bind(this))
  }

  componentWillUnmount () {
    this.request.abort()
    ImageStore.removeChangeListener()
  }

  generateThumbnails (image) {
    return <HomeImageItem data={image} />
  }

  render () {

    ImageStore.addChangeListener(function () {
      const data = ImageStore.getCurrentData()
      this.setState({
        data: data
      })
    }.bind(this))

    return (
      <div className="container">

      </div>
    )
  }

}


export default Home
