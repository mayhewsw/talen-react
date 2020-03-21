import {
    SET_AUTH,
    CHANGE_FORM,
    SENDING_REQUEST,
    SET_ERROR_MESSAGE
  } from './types'
import { Dispatch } from 'redux'
import Axios from 'axios';

export const login = (username: string, password: string) => {
  return (dispatch: Dispatch) => {
    dispatch(sendingRequest(true))
    dispatch(setErrorMessage(''))
    Axios.post('http://127.0.0.1:5000/api/login', { withCredentials: true, username, password })
      .then(data => {
        console.log(data);
        console.log(username);
        dispatch(sendingRequest(false))
        dispatch(setAuthState(true, username))
      })
      .catch(error => {
        dispatch(sendingRequest(false))
        dispatch(setErrorMessage('Login failed'))
      })
  }
}
  
  // export const loadData = (path, name) => {
  //   return dispatch => {
  //     dispatch(setData({ [name]: '' }))
  //     dispatch(sendingRequest(true))
  //     dispatch(setErrorMessage(''))
  //     api(`/api${path}`)
  //       .then(data => {
  //         dispatch(sendingRequest(false))
  //         dispatch(setData({ [name]: data.message }))
  //       })
  //       .catch(error => {
  //         dispatch(sendingRequest(false))
  //         dispatch(setErrorMessage('Error loading data'))
  //         if (error.message === '401') {
  //           dispatch(setAuthState(false))
  //         }
  //       })
  //   }
  // }
  
export const loadMe = () => {
  return (dispatch: Dispatch) => {
    // dispatch(loadingAuth(true))
    dispatch(setErrorMessage(''))
    Axios.get('http://127.0.0.1:5000/api/me', {withCredentials: true})
      .then((data: any) => {
        console.log(data);
        // dispatch(loadingAuth(false))
        dispatch(setAuthState(data.data.isLoggedIn, "unknown?"))
      })
      .catch(error => {
        // dispatch(loadingAuth(false))
      })
  }
}

export const logout = () => {
  return (dispatch: Dispatch) => {
    dispatch(sendingRequest(true))
    dispatch(setErrorMessage(''))
    Axios.get('http://127.0.0.1:5000/api/logout')
      .then((data: any) => {
        dispatch(sendingRequest(false))
        // TODO: there may be a problem with setting user to null if the logout failed
        dispatch(setAuthState(data.isLoggedIn, null))
      })
      .catch(error => {
        dispatch(sendingRequest(false))
        dispatch(setErrorMessage('Error logging out'))
      })
  }
}

export const setErrorMessage = (message: string) => {
  return { type: SET_ERROR_MESSAGE, message }
}

export const changeForm = (newState: any) => {
  console.log("inside login/changeForm")
  return { type: CHANGE_FORM, newState }
}

const setAuthState = (newState: boolean, username: string | null) => {
  return { type: SET_AUTH, newState, username }
}

const sendingRequest = (sending: boolean) => {
  return { type: SENDING_REQUEST, sending }
}

// const loadingAuth = (sending: boolean) => {
//   return { type: LOADING_AUTH, sending }
// }

// const setData = data => {
//   return { type: SET_DATA, data }
// }

// const api = (path: string) => {
//   return fetch(path, { 
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     credentials: 'same-origin', method: 'get' }).then(res => {
//     if (res.ok) return res.json()
//     else throw new Error(res.status.toString())
//   }) 
// }
