import React from 'react';
import PropTypes from 'prop-types';

const Slider = ({name, value, min, max, step, suffix, onChange}) => {
  return (
    <div className="slider">
      <label>{name} - {value}%{suffix}</label>
      <input type="range" min={min} max={max} step={step || 1} value={value} onChange={(event) => onChange(Number(event.target.value))}/>
    </div>
  )
}

Slider.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number,
  suffix: PropTypes.string,
  onChange: PropTypes.func.isRequired
}

export default Slider;