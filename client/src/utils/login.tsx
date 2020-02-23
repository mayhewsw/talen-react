import {
    SET_AUTH,
    CHANGE_FORM,
    SENDING_REQUEST,
    LOADING_AUTH,
    SET_ERROR_MESSAGE,
    SET_DATA
  } from './types'
import { Dispatch } from 'redux'
  
  export const login = (username: string, password: string) => {
    return (dispatch: Dispatch) => {
      dispatch(sendingRequest(true))
      dispatch(setErrorMessage(''))
      fetch('http://localhost:5000/api/login', {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        method: 'POST',
        body: JSON.stringify({ username, password })
      })
        .then(res => {
          if (res.ok) return res.json()
          else throw new Error(res.statusText)
        })
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
  
  // export const loadMe = () => {
  //   return dispatch => {
  //     dispatch(loadingAuth(true))
  //     dispatch(setErrorMessage(''))
  //     api('/api/me')
  //       .then(data => {
  //         dispatch(loadingAuth(false))
  //         dispatch(setAuthState(data.isLoggedIn))
  //       })
  //       .catch(error => {
  //         dispatch(loadingAuth(false))
  //       })
  //   }
  // }
  
  export const logout = () => {
    return (dispatch: Dispatch) => {
      dispatch(sendingRequest(true))
      dispatch(setErrorMessage(''))
      api('http://localhost:5000/api/logout')
        .then(data => {
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
  
  const loadingAuth = (sending: boolean) => {
    return { type: LOADING_AUTH, sending }
  }
  
  // const setData = data => {
  //   return { type: SET_DATA, data }
  // }
  
  const api = (path: string) => {
    return fetch(path, { credentials: 'same-origin' }).then(res => {
      if (res.ok) return res.json()
      else throw new Error(res.status.toString())
    })
  }
  