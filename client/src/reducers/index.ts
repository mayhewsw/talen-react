import {
    State,
    DocumentTypes,
    LOAD_DOCUMENT,
    SAVE_DOCUMENT,
    SET_ERROR_MESSAGE,
    CHANGE_FORM,
    SET_AUTH
} from '../utils/types'

const initialState: State = {
    loggedIn: false,
    userName: "",
    dataset: "",
    currentDocument: "",
    currentDocumentIsSaved: false,
    currentlySending: false,
    errorMessage: "",
    formState: {
        email: '',
        password: ''
    },
}

export function chatReducer(
    state = initialState,
    action: DocumentTypes
    ): State {
    switch (action.type) {
        case LOAD_DOCUMENT:
        case SAVE_DOCUMENT:
        default:
        return state
    }
}

export const rootReducer = (state = initialState, action: any) => {
    switch (action.type) {
      case CHANGE_FORM:
        return changeForm(state, action)
      case SET_AUTH:
        return setAuth(state, action)
    //   case SENDING_REQUEST:
    //     return sendingRequest(state, action)
    //   case LOADING_AUTH:
    //     return loadingAuth(state, action)
      case SET_ERROR_MESSAGE:
        return setErrorMessage(state, action)
    //   case SET_DATA:
    //     return setData(state, action)
      default:
        return state
    }
}
  
const changeForm = (state: State, action: any) => {
    return {
        ...state,
        formState: {
        ...state.formState,
        ...action.newState
        }
    }
}

const setAuth = (state: State, action: any) => {
    return {
        ...state,
        loggedIn: action.newState,
        userName: action.username,
    }
}

const setErrorMessage = (state: State, action: any) => {
    return {
        ...state,
        errorMessage: action.message
    }
}

// const rootReducer = combineReducers({
//     homeReducer,
//     chatReducer,
// })

// function rootReducer(state = {}, action: any) {
//     return {
//       a: doSomethingWithA(state.a, action),
//       b: processB(state.b, action),
//       c: c(state.c, action)
//     }
//   }

export default rootReducer