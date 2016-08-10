import AppDispatcher from '../dispatcher/AppDispatcher'
import ImageConstants from '../constants/ImageConstants'
import { EventEmitter } from 'events'


const CHANGE_EVENT = 'change'


class ImageStoreClass extends EventEmitter {
    constructor () {
      super()
      this.page = this.page ? this.page : 1
    }
    emitChange () {
      this.emit(CHANGE_EVENT)
    }
    addChangeListener (callback) {
      this.on(CHANGE_EVENT, callback)
    }
    removeChangeListener (callback) {
      delete this.username
      this.removeListener(CHANGE_EVENT, callback)
    }
    setCurrentUser (username) {
      this.username = username
      this.nextURL = this.nextURL ? this.nextURL : 'http://localhost:3030/' + this.username + '/content/?page=' + this.page
      return this.username
    }
    getCurrentData () {
      if (!this.data) return new Error('No current data!')
      return this.data
    }
    getCurrentMetadata () {
      if (!this.metadata) return new Error('No current metadata!')
      return this.metadata
    }
    getNextURL () {
      return this.nextURL
    }
    setCurrentData (data, metadata, callback) {
      this.data = data
      this.metadata = metadata
      this.page = metadata.pagination.page + 1
      this.nextURL = 'http://localhost:3030/' + this.username + '/content/?page=' + this.page
      callback()
    }
}


const ImageStore = new ImageStoreClass()


ImageStore.dispatchImages = AppDispatcher.register(function (payload) {
  switch (payload.actionType) {
    case ImageConstants.SET_DATA:
      ImageStore.setCurrentData(payload.data, payload.metadata, function () {
        ImageStore.emitChange()
      })
      break
  }
})


export default ImageStore
