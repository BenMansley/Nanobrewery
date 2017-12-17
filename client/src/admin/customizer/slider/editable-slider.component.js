import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MaterialInput from '../../../components/material-input';

export default class EditableSlider extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      name: props.name,
      min: props.min,
      max: props.max,
      step: props.step,
      suffix: props.suffix,
      active: false
    }
  }

  onSubmit(event) {
    event.preventDefault();
    this.setState({active: false});
  }

  render() {
    const { name, min, max, step, suffix, active } = this.state;
    const { value, disabled, onChange } = this.props;

    return (
      <div className="editable-slider">
        <label className="slider-label"><span>{name} - {value}%{suffix}</span>
          <button className="inline" disabled={disabled} onClick={() => this.setState((prevState) => {
            return { active: !prevState.active }
          })}>Customize</button>
        </label>
        <form onSubmit={(event) => this.onSubmit(event)} className={active ? "active" : ""}>
          <MaterialInput type="text" id="name" labelText="Name *" active={name !== ""} value={name}
            onChange={(event) => this.setState({name: event.target.value})}/>
          <MaterialInput type="number" id="min" labelText="Minimum *" active={min !== ""} value={min}
            onChange={(event) => this.setState({min: event.target.value})}/>
          <MaterialInput type="number" id="max" labelText="Maximum *" active={max !== ""} value={max}
            onChange={(event) => this.setState({max: event.target.value})}/>
          <MaterialInput type="number" id="step" labelText="Increment *" active={step !== ""} value={step}
            onChange={(event) => {
              console.log(event.target.value);
              this.setState({step: event.target.value})
            }}/>
          <MaterialInput type="text" id="suffix" labelText="Suffix (after %)" active={suffix !== ""} value={suffix}
            onChange={(event) => this.setState({suffix: event.target.value})}/>
          <button type="submit" className="submit-btn">Save</button>
        </form>
        <input type="range" min={min} max={max} step={step || 1} value={value} onChange={(event) => onChange(Number(event.target.value))}/>
      </div>
    )
  }
}

EditableSlider.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number,
  suffix: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired
}