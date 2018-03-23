import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MaterialInput from '../../../components/material-input';
import { updateVariable } from '../customizer.actions';

class EditableSlider extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      name: props.name,
      min: props.min,
      max: props.max,
      step: props.step,
      defaultVal: props.defaultVal,
      suffix: props.suffix,
      active: false
    }
  }

  onSubmit(event) {
    event.preventDefault();
    const { name, min, max, step, defaultVal, suffix } = this.state;
    this.props.updateVariable(this.props.id, name, min, max, step, defaultVal, suffix);
  }

  onReset(event) {
    event.preventDefault();
    const { name, min, max, step, defaultVal, suffix, onChange } = this.props;
    this.setState({name, min, max, step, defaultVal, suffix});
    onChange(defaultVal);
  }

  onDefaultChange(val) {
    this.setState({defaultVal: val});
    this.props.onChange(val);
  }

  render() {
    const { name, min, max, step, defaultVal, suffix, active } = this.state;
    const { value, disabled, onChange } = this.props;

    return (
      <div className="editable-slider">
        <label className="slider-label"><span>{name} - {value}%{suffix}</span>
          <button className="inline" disabled={disabled} onClick={() => this.setState((prevState) => {
            return { active: !prevState.active }
          })}>Edit Variable</button>
        </label>
        <form onSubmit={(event) => this.onSubmit(event)} className={active ? "active" : ""}>
          <MaterialInput type="text" id="name" labelText="Name *" active={!!name} value={name}
            onChange={(event) => this.setState({name: event.target.value})}/>
          <MaterialInput type="number" id="min" labelText="Minimum *" active={!!min.toString()} value={min}
            onChange={(event) => this.setState({min: event.target.value})}/>
          <MaterialInput type="number" id="max" labelText="Maximum *" active={!!max.toString()} value={max}
            onChange={(event) => this.setState({max: event.target.value})}/>
          <MaterialInput type="number" id="step" labelText="Increment *" active={!!step.toString()} value={step}
            onChange={(event) => this.setState({step: event.target.value})}/>
          <MaterialInput type="number" id="defaultVal" labelText="Default *" active={!!defaultVal.toString()} value={defaultVal}
            onChange={(event) => this.onDefaultChange(event.target.value)}/>
          <MaterialInput type="text" id="suffix" labelText="Suffix (after %)" active={!!suffix} value={suffix}
            onChange={(event) => this.setState({suffix: event.target.value})}/>
          <div className="slider-buttons">
            <button onClick={(event) => this.onReset(event)}>Reset</button>
            <button type="submit">Save</button>
          </div>
          <p className="slider-response">{this.props.response}</p>
        </form>
        <input type="range" min={min} max={max} step={step || 1} value={value} onChange={(event) => onChange(Number(event.target.value))}/>
      </div>
    )
  }
}

EditableSlider.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number,
  defaultVal: PropTypes.number.isRequired,
  suffix: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  return { response: state.customizer.updateVariableResponse }
}

const mapDispatchToProps = dispatch => {
  return {
    updateVariable: (id, name, min, max, step, defaultVal, suffix) => dispatch(updateVariable(id, name, min, max, step, defaultVal, suffix))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditableSlider);