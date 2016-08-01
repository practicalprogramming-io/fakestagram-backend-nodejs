import AppDispatcher from '../dispatcher/AppDispatcher'
import AuthConstants from '../constants/AuthConstants'


export default {
  logUserIn: (user, token) => {
    AppDispatcher.dispatch({
      actionType: AuthConstants.LOGIN_USER,
      user: user,
      token: token
    })
  },
  logUserOut: () => {
    AppDispatcher.dispatch({
      actionType: AuthConstants.LOGOUT_USER
    })
  }
}
