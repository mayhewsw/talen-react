import React from 'react'
import ErrorView from '../ErrorView'
import LoadingView from '../LoadingView'
import Input from '../Input'

const LoginForm = (props: Props) => {
  const { formState, handleSubmit, errorMessage, currentlySending } = props

  const submitForm = (event: any) => {
    event.preventDefault()
    handleSubmit(formState.email, formState.password)
  }

  return (
    <form onSubmit={submitForm}>
      <Input type="text" name="email" model="email" label="Email:" />
      <Input type="password" name="password" model="password" label="Password:" />
      <input type="submit" value="Submit" />
      <LoadingView currentlySending={currentlySending} />
      <ErrorView message={errorMessage} />
    </form>
  )
}

type Props = { 
  currentlySending: boolean
  formState: {
    [key: string]: number | string,
   }
  errorMessage: string
  handleSubmit: Function
};

export default LoginForm
