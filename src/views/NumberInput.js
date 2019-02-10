// @flow

import React, { Component, type ElementConfig } from 'react'

type Props = {
  value: ?number,
  onChange: (SyntheticInputEvent<*>, ?number) => void,
  allowEmpty?: boolean,
  inputRef?: Function,
} & ElementConfig<'input'>;

type State = {
  stringValue: string,
}

function valueToString(x) {
  if (typeof x !== 'number') {
    return '';
  }
  return x.toLocaleString('en-US', {
    maximumFractionDigits: 4,
    useGrouping: false,
  });
}

export default class NumberInput extends Component<Props, State> {
  state = { stringValue: valueToString(this.props.value) }

  handleChange = (evt: SyntheticInputEvent<EventTarget>) => {
    const stringValue = evt.target.value
    this.setState({ stringValue })
    if (!stringValue && this.props.allowEmpty) {
      this.props.onChange(evt)
    } else {
      const numberValue = parseFloat(stringValue)
      if (isNaN(numberValue)) { return }
      this.props.onChange(evt, numberValue)
    }
  }

  input = null
  handleRef = (input: ?HTMLInputElement) => {
    this.input = input
    const { inputRef } = this.props
    if (inputRef) { inputRef(input) }
  }

  handleFocus = () => {
    if (this.input && this.input.select) { this.input.select() }
  }

  handleBlur = () => {
    this.setState({ stringValue: valueToString(this.props.value) })
  }

  componentWillReceiveProps (newProps: Props) {
    const value = this.props.value
    const newValue = newProps.value
    if (value === newValue) { return }
    const stringValue = this.state.stringValue
    const stringValueAsNumber = stringValue ? parseFloat(stringValue) : undefined
    if (stringValueAsNumber !== (typeof newValue === 'number' ? newValue : undefined)) {
      this.setState({ stringValue: valueToString(newValue) })
    }
  }

  render () {
    const { value, onChange, allowEmpty, inputRef, ...other } = this.props
    const { stringValue } = this.state

    return (
      <input
        value={stringValue}
        type='number'
        ref={this.handleRef}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        {...other}
      />
    )
  }
}

