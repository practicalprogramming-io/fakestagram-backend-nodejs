import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import request from 'superagent/lib/client'
import ImageActions from '../actions/ImageActions'
import ImageStore from '../stores/ImageStore'
import { HomeImageItem, HomeImageView } from '../components/HomeImages'


export default class Home extends Component {

  constructor (props) {
    super()
    this.state = {
      url: 'http://localhost:3030/' + props.params.username + '/content/',
      data: null,
      thumbnails: null
    }
  }

  componentDidMount () {
    this.request = request.get(this.state.url).end(function (error, response) {
        if (error) throw error
        ImageActions.setCurrentData(response.body.data, response.body.metadata)
      }.bind(this))
  }

  componentWillUnmount () {
    this.request.abort()
    ImageStore.removeChangeListener()
  }

  generateThumbnails (image) {
    return <HomeImageItem
      location={"http://localhost:3030/images/" + image.name}
      contentid={image.content_id}
    />
  }

  generateThumbnailView () {
    return <HomeImageView thumbnails={this.state.thumbnails}/>
  }

  render () {

    ImageStore.addChangeListener(function () {
      const data = ImageStore.getCurrentData()
      const metadata = ImageStore.getCurrentMetadata()
      this.setState({data: data})
      this.setState({thumbnails: this.state.data.map(this.generateThumbnails)})
    }.bind(this))

    const thumbnails = this.generateThumbnailView()

    return (
      <div className="container">
        {thumbnails}
      </div>
    )
  }

}
