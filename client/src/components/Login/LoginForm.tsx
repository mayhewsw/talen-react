import React from 'react'
import LoadingView from '../LoadingView'
import Input from '../Input'
import { Form, Button } from 'react-bootstrap'

const LoginForm = (props: Props) => {
  const { formState, handleSubmit, currentlySending } = props

  const submitForm = (event: any) => {
    event.preventDefault()
    handleSubmit(formState.email, formState.password)
  }

  return (
    <Form onSubmit={submitForm}>
      <Input type="text" name="email" model="email" label="Email:" />
      <Input type="password" name="password" model="password" label="Password:" />
      <Button variant="primary" type="submit">
         Submit
      </Button>
      <LoadingView currentlySending={currentlySending} />
    </Form>
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
