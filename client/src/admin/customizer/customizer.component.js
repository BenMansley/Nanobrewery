import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Slider from "./slider/slider.component";
import { getCustomizerData, newCustomization } from "./customizer.actions";
import MaterialInput from "../../components/material-input.component";
import { getCustomizations } from "../branding/branding.actions";

class Customizer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      variables: {
        "Volume": 0,
        "Colour": 0,
        "Hoppiness": 50,
        "Malt Flavour": 50
      },
      rgb: [55, 8, 10],
      description: "",
      name: "",
      index: 0
    };
  }

  setIndex(searchString, customizations) {
    const id = /\?id=(\d+)/.exec(searchString)[1];
    const index = customizations.findIndex(c => c.id === Number(id));
    if (index !== -1) {
      this.setState({ index });
    }
  }

  componentDidMount() {
    const { location, getData, customizations, getCustomizations } = this.props;
    getData();
    if (customizations.length === 0) {
      getCustomizations();
    } else if (location.search) {
      this.setIndex(location.search, customizations);
    }
  }

  setColour(value) {
    let variables = this.state.variables;
    variables["Colour"] = value;
    this.setState({ variables }, _ => {
      this.makeDescription();
      const minRGB = [55, 8, 10];
      const step = [2, 2.25, 1.45];
      const rgb = minRGB.map((colour, i) => {
        return Math.round(colour + step[i] * value);
      });
      this.setState({ rgb });
    });
  }

  componentWillReceiveProps(nextProps) {
    const { location, customizations } = this.props;
    if (location.search && (customizations.length === 0 && nextProps.customizations.length !== 0)) {
      this.setIndex(location.search, nextProps.customizations);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.templates.length !== 0 && prevProps.templates.length === 0) {
      this.makeDescription(this.props.templates);
    }
  }

  makeDescription() {
    let variables = this.state.variables;
    let strings = [];
    strings = this.props.templates.map((variable, i) => {
      const val = variables[variable.name];
      return variable.strings[Math.min(variable.strings.length - 1, Math.floor(val / variable.step))];
    });
    this.setState({ description: strings.join(". ") + "." });
  }

  setVariable(name, value) {
    let variables = this.state.variables;
    variables[name] = value;
    this.setState({ variables }, _ => this.makeDescription());
  }

  saveCustomization() {
    const { Volume:volume, Colour:colour, Hoppiness:hoppiness, "Malt Flavour":maltFlavour } = this.state.variables;
    const { newCustomization } = this.props;
    const { name, description } = this.state;
    newCustomization(name, description, volume, colour, hoppiness, maltFlavour);
  }

  render() {
    const { rgb, variables, description, name } = this.state;
    const { variables:variableSchema, error, newCustomizationId } = this.props;

    let sliders = [];
    sliders = variableSchema.map((v, i) => {
      if (v.name === "Colour") {
        return <Slider key={v.id} name={v.name} min={v.min} max={v.max} step={v.step} suffix={v.suffix}
          value={variables[v.name]} onChange={(value) => this.setColour(value)} />;
      }
      return <Slider key={v.id} name={v.name} min={v.min} max={v.max} step={v.step} suffix={v.suffix}
        value={variables[v.name]} onChange={(value) => this.setVariable(v.name, value)} />;
    });

    return (
      <div className="page-content customize">
        <h1 className="page-title">Customize Your Beer</h1>
        <div className="customizer">
          <div className="customizer-sliders card">
            { sliders }
          </div>
          <div className="customizer-image card">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 48 48">
              <path fill={`rgb(${rgb[0]},${rgb[1]},${rgb[2]})`} strokeWidth="2" stroke="#CCC" d={`
                M1.9,7.4c4.6,0,9.2,0,13.8,0c0.3-1.2,0.6-2.5,1-3.6c9.2,0,18.4,0,27.7,0c0.2,0.9,0.3,1.7,0.5,2.6
                c0.1,0.9,0.3,1.7,0.4,2.6c0.1,0.3,0,0.4-0.3,0.5C44.5,9.6,44,9.8,43.6,10c-0.1,0.1-0.3,0.3-0.3,0.5c0,7.5,0
                ,15,0,22.5c0,0.2,0.1,0.4,0.2,0.6c1.1,1.6,2.2,3.3,3.3,4.9c0.1,0.2,0.2,0.5,0.2,0.7c0,1.7,0,3.4,0,5.1c-11,
                0-22.1,0-33.2,0c0-0.4,0-0.8,0-1.2c0-1.3,0-2.7,0-3.9c0-0.3,0.1-0.6,0.2-0.8c1.1-1.6,2.1-3.2,3.2-4.8
                c0.1-0.1,0.2-0.3,0.3-0.5c-0.4,0-0.7,0-1.1,0c-1.4,0-3,0-4.4-0.2c-2.5-0.3-4.5-1.4-6.2-3.3c-2.1-2.2-3.1-4.8
                -3.1-7.9c0-2.9,0-5.8,0-8.6c0-0.2-0.1-0.5-0.3-0.7C2,11.9,1,11.2,1,11.2c0,0,0-0.1,0-0.2c0.1-0.6,0.3-1.2,
                0.4-1.8C1.6,8.6,1.7,8,1.9,7.4z M10.2,14.8c0,1.1,0,2,0,3.1c0,1.4,0,2.9,0,4.3c0,1.9,1.3,3.5,3.3,3.6
                c1.2,0.1,2.3,0.1,3.5,0.1c0.2,0,0.4,0,0.6,0c0-3.7,0-7.4,0-11C15,14.8,12.6,14.8,10.2,14.8z`} />
              <path fill={`rgb(${rgb[0]},${rgb[1]},${rgb[2]})`} strokeWidth="2" stroke="#CCC" d={`M-7.8,2.6`} />
            </svg>
          </div>
          <div className="customizer-description card">
            <p>{description}</p>
          </div>
          <div className="customizer-actions card">
            <h2>One more thing...</h2>
            <MaterialInput className="large" type="text" id="name" labelText="Name your beer" active={!!name}
              value={name} onChange={(event) => this.setState({ name: event.target.value })} />
            { newCustomizationId !== 0 ? <p>Beer Saved!
              <Link to={{ pathname: "/admin/branding", search:`?id=${newCustomizationId}` }}>Brand It</Link></p>
              : <button className="large" onClick={() => this.saveCustomization()}>Save</button> }
            <p className="error">{error ? <span className="material-icons">error</span> : null }{error}</p>
          </div>
        </div>
      </div>
    );
  }
}

Customizer.propTypes = {
  variables: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      min: PropTypes.number,
      max: PropTypes.number,
      step: PropTypes.number,
      defaultVal: PropTypes.number,
      suffix: PropTypes.string,
    })
  ),
  templates: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      step: PropTypes.number,
      strings: PropTypes.arrayOf(PropTypes.string)
    })
  ),
  customizations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      description: PropTypes.string,
      volume: PropTypes.number,
      colour: PropTypes.number,
      hoppiness: PropTypes.number,
      maltFlavour: PropTypes.number
    })
  ),
  newCustomizationId: PropTypes.number.isRequired,
  error: PropTypes.string.isRequired,
  getData: PropTypes.func.isRequired,
  getCustomizations: PropTypes.func.isRequired,
  newCustomization: PropTypes.func.isRequired,
  location: PropTypes.object
};

const mapStateToProps = state => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
    variables: state.customizer.variables,
    templates: state.customizer.templates,
    customizations: state.branding.customizations,
    newCustomizationId: state.customizer.newCustomizationId,
    error: state.customizer.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getData: () => dispatch(getCustomizerData()),
    getCustomizations: () => dispatch(getCustomizations()),
    newCustomization: (name, description, volume, colour, hoppiness, maltFlavour) =>
      dispatch(newCustomization(name, description, volume, colour, hoppiness, maltFlavour))
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Customizer));
