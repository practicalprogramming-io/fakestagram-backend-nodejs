import AppDispatcher from '../dispatcher/AppDispatcher'
import ImageConstants from '../constants/ImageConstants'


export default {
  setCurrentData: (data, metadata) => {
    AppDispatcher.dispatch({
      actionType: ImageConstants.SET_DATA,
      data: data,
      metadata: metadata
    })
  }
}
