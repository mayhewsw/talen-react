import React from 'react'
import { connect } from 'react-redux'
import { withRouter, Redirect } from 'react-router-dom'

import LoginForm from './LoginForm'
import { State } from '../../utils/types'
import { login, setErrorMessage } from '../../utils/login'

class LoginContainer extends React.Component<Props> {
  componentDidMount() {
    this.props.clearErrors()
  }

  render() {
    const { loggedIn, handleSubmit, currentlySending, formState, errorMessage } = this.props

    return (
      <div>
        {loggedIn ? (
          <Redirect to="/" />
        ) : (
          <LoginForm
            handleSubmit={handleSubmit}
            currentlySending={currentlySending}
            formState={formState}
            errorMessage={errorMessage}
          />
        )}
      </div>
    )
  }
}

type Props = { 
  loggedIn: boolean
  currentlySending: boolean
  formState: {
    [key: string]: number | string,
   }
  errorMessage: string
  handleSubmit: Function
  clearErrors: Function
};

const mapStateToProps = (state: State) => ({
  loggedIn: state.loggedIn,
  currentlySending: state.currentlySending,
  formState: state.formState,
  errorMessage: state.errorMessage
})

const mapDispatchToProps = (dispatch: Function) => ({
  handleSubmit: (username: string, password: string) => dispatch(login(username, password)),
  clearErrors: () => dispatch(setErrorMessage(''))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginContainer))
