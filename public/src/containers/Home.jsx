import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import request from 'superagent/lib/client'
import ImageActions from '../actions/ImageActions'
import ImageStore from '../stores/ImageStore'
import { HomeImageItem, HomeImageView } from '../components/HomeImages'


export default class Home extends Component {

  constructor (props) {
    super()
    ImageStore.setCurrentUser(props.params.username)
    this.state = {
      data: null,
      url: null,
      thumbnails: null
    }
    this.loadMoreImages = this.loadMoreImages.bind(this)
    this.loadImages = this.loadImages.bind(this)
  }

  componentDidMount () {
    this.loadImages()
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

  loadImages () {
    const url = ImageStore.getNextURL()
    this.request = request.get(url).end(function (error, response) {
        if (error) throw error
        ImageActions.setCurrentData(response.body.data, response.body.metadata)
      }.bind(this))
  }

  loadMoreImages () {
    this.loadImages()
    const node = React.findDOMNode(this)
    console.log(node)
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
        <button type="button" className="btn btn-primary btn-lg btn-block" onClick={this.loadMoreImages}>Load more</button>
      </div>
    )
  }

}
