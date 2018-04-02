import React from "react";
import PropTypes from "prop-types";

const MaterialInput = ({ type, id, labelText, active, inline, className, onChange, value }) => {
  let divClass = className || "";
  divClass = divClass + " material-input" + (inline ? " inline" : "");
  return (
    <div className={divClass}>
      <input type={type} id={id} onChange={(event) => onChange(event)} className={active ? "active" : ""}
        value={value} />
      <label htmlFor={id}>{labelText}</label>
    </div>
  );
};

MaterialInput.propTypes = {
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  labelText: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  inline: PropTypes.bool,
  className: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default MaterialInput;
