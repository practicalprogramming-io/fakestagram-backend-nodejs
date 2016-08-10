import AppDispatcher from '../dispatcher/AppDispatcher'
import ImageConstants from '../constants/ImageConstants'
import { EventEmitter } from 'events'


const CHANGE_EVENT = 'change'


class ImageStoreClass extends EventEmitter {
    emitChange () {
      this.emit(CHANGE_EVENT)
    }
    addChangeListener (callback) {
      this.on(CHANGE_EVENT, callback)
    }
    removeChangeListener (callback) {
      this.removeListener(CHANGE_EVENT, callback)
    }
    getCurrentData () {
      if (!this.data) return new Error('No current data!')
      return this.data
    }
    getCurrentMetadata () {
      if (!this.metadata) return new Error('No current metadata!')
      return this.metadata
    }
    setCurrentData (data, metadata, callback) {
      this.data = data
      this.metadata = metadata
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
