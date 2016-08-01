import AppDispatcher from '../dispatcher/AppDispatcher'
import AuthConstants from '../constants/AuthConstants'
import { EventEmitter } from 'events'


const CHANGE_EVENT = 'change'


function setUser (user, token) {
  if (!localStorage.getItem('token') || localStorage.getItem('token') === 'undefined') {
    console.log(user, token)
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', token)
  }
}

function removeUser () {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
}


class AuthStoreClass extends EventEmitter {
  emitChange () {
    this.emit(CHANGE_EVENT)
  }
  addChangeListener (callback) {
    this.on(CHANGE_EVENT, callback)
  }
  removeChangeListener (callback) {
    this.removeListener(CHANGE_EVENT, callback)
  }
  isAuthenticated () {
    if (localStorage.getItem('token')) return true
    else return false
  }
  getUser () {
    return localStorage.getItem('user')
  }
  getJWT () {
    return localStorage.getItem('token')
  }
}


const AuthStore = new AuthStoreClass()


AuthStore.dispatchToken = AppDispatcher.register(function (payload) {
  switch (payload.actionType) {
    case AuthConstants.LOGIN_USER:
      setUser(payload.user, payload.token)
      AuthStore.emitChange()
      break
    case AuthConstants.LOGOUT_USER:
      removeUser()
      AuthStore.emitChange()
      break
  }
})


export default AuthStore
