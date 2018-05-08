import React from "react";
import PropTypes from "prop-types";

const MaterialInput = ({ type, id, labelText, inline, className, onChange, value }) => {
  let divClass = className || "";
  divClass = divClass + " material-input" + (inline ? " inline" : "");
  const active = type === "number" ? !!value.toString() : !!value;
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
  inline: PropTypes.bool,
  className: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired
};

export default MaterialInput;
