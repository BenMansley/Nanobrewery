import React, { Component } from "react";
import PropTypes from "prop-types";

class MaterialSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };
  }

  onOptionClick(value) {
    this.setState({ open: false });
    this.props.onSelect(value);
  }

  render() {
    const { options, selected } = this.props;

    const items = options.map((item, i) =>
      <li key={i} className={"select-option" + (selected === i ? " selected" : "")}
        onClick={() => this.onOptionClick(item.value)}>{item.text}</li>
    );

    return (
      <div className="material-select">
        <button className="select-dropdown" onClick={() => this.setState({ open: true })}>{options[selected].text}
          <span className="material-icons">keyboard_arrow_down</span>
        </button>
        <ul className={"select-options" + (this.state.open ? " visible" : "")}>{items}</ul>
      </div>
    );
  }
}

MaterialSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      text: PropTypes.string
    })
  ),
  selected: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired
};

export default MaterialSelect;
