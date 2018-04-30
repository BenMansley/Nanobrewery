import React, { Component } from "react";
import PropTypes from "prop-types";

class MaterialTextarea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 0,
      isResizing: true
    };
  }

  onKey(event) {
    let content = event.target.value + "\n";
    content = content.replace("/\n/g", "<br />");
    this.resizer.innerHTML = content;
    const resizeHeight = this.resizer.offsetHeight;
    this.setState({ height: resizeHeight });
  }

  render() {
    const { id, labelText, inline, className, value, onChange } = this.props;
    const { height, isResizing } = this.state;
    let divClass = className || "";
    divClass = divClass + " material-textarea" + (inline ? " inline" : "");
    return (
      <div className={divClass}>
        <textarea id={id} onKeyDown={(event) => this.onKey(event)} onKeyUp={(event) => this.onKey(event)}
          onChange={(event) => onChange(event)} className={value ? "active" : ""} value={value} maxLength="800"
          style={{ height: height + "px" }} ref={(instance) => { this.textarea = instance; }} />
        <label htmlFor={id}>{labelText}</label>
        { isResizing ? <div className="hidden" ref={(instance) => { this.resizer = instance; }} /> : null }
      </div>
    );
  }
}

MaterialTextarea.propTypes = {
  id: PropTypes.string.isRequired,
  labelText: PropTypes.string.isRequired,
  inline: PropTypes.bool,
  className: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default MaterialTextarea;
