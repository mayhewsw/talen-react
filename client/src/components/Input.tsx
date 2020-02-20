import React from 'react'
import { connect } from 'react-redux'
import { changeForm } from '../utils/login'
import { State } from '../utils/types'

class Input extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
    this.changeInput = this.changeInput.bind(this)
  }

  changeInput(event: any) {
    const value = event.target.value
    const name = event.target.name
    console.log(value)
    console.log(name)
    this.props.handleChange({ [name]: value })
  }

  render() {
    const { label, type, name, model, formState } = this.props

    console.log(formState)

    const fsv = formState[model];

    return (
      <label>
        {label}
        <input type={type} name={name} defaultValue={fsv} onChange={this.changeInput} />
      </label>
    )
  }
}

type Props = { 
  label: string
  type: string
  name: string
  model: string
  formState: {
    [key: string]: number | string,
   }
  handleChange: Function
};

const mapStateToProps = (state: State) => ({
  formState: state.formState
})

const mapDispatchToProps = (dispatch: Function) => ({
  handleChange: (values: any) => dispatch(changeForm(values))
})

export default connect(mapStateToProps, mapDispatchToProps)(Input)
