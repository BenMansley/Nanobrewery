import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Slider from "./slider/slider.component";
import MaterialInput from "../../components/material-input.component";
import MaterialSelect from "../../components/material-select.component";
import { getCustomizerData } from "./customizer.actions";
import { getCustomizations, newCustomization, updateCustomization } from "../branding/branding.actions";

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
      this.setActiveBeer(customizations[index], index);
    } else {
      this.setState({ index: customizations.length });
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
    if (customizations.length === 0 && nextProps.customizations.length !== 0) {
      if (location.search) {
        this.setIndex(location.search, nextProps.customizations);
      } else {
        this.setState({ index: nextProps.customizations.length });
      }
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
    const { newCustomization, updateCustomization, customizations } = this.props;
    const { name, description, index } = this.state;
    if (index === customizations.length) {
      newCustomization(name, description, volume, colour, hoppiness, maltFlavour);
    } else {
      updateCustomization(name, description, volume, colour, hoppiness, maltFlavour);
    }
  }

  setActiveBeer(beer, index) {
    let variables;
    const { volume:Volume, colour:Colour, hoppiness:Hoppiness, name, description } = beer;
    variables = { "Malt Flavour": beer.maltFlavour, Volume, Colour, Hoppiness };
    const minRGB = [55, 8, 10];
    const step = [2, 2.25, 1.45];
    const rgb = minRGB.map((colour, i) => {
      return Math.round(colour + step[i] * beer.colour);
    });
    this.setState({ rgb, index, name, description, variables });
  }

  onNewBeerClick() {
    this.setState({
      index: this.props.customizations.length,
      variables: {
        "Volume": 0,
        "Colour": 0,
        "Hoppiness": 50,
        "Malt Flavour": 50
      },
      rgb: [55, 8, 10],
      description: "",
      name: ""
    }, _ => this.makeDescription());
  }

  onBeerSelect(i) {
    console.log(`Selected: ${i}`);
    console.log(this.props.customizations);
    const { Volume:volume, Colour:colour, Hoppiness:hoppiness, "Malt Flavour":maltFlavour } = this.state.variables;
    let { name, description, index } = this.state;
    const { customizations } = this.props;
    if (name) {
      customizations[index] = Object.assign({}, customizations[index], {
        name, description, volume, colour, hoppiness, maltFlavour
      });
    }
    this.setActiveBeer(customizations[i], i);
  }

  render() {
    const { rgb, variables, name, description, index } = this.state;
    const { variables:variableSchema, customizations, customizationError, newCustomizationId,
      isLoadingData } = this.props;

    let options = [];

    if (customizations && customizations.length > 0) {
      options = customizations.map((c, i) => {
        return { value: i, text: c.name };
      });
    }

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
        <div className="title-bar">
          <h1 className="page-title inline">Customize Your Beer</h1>
          { options.length !== 0
            ? <div className="title-actions">
              <MaterialSelect options={options} selected={index} placeholder="Select a Beer"
                onSelect={(i) => this.onBeerSelect(i)} />
              { name !== ""
                ? <button onClick={() => this.onNewBeerClick()}>Create a New Beer</button>
                : null }
            </div>
            : null }
        </div>
        <div className="customizer">
          <div className="customizer-element top card">
            <div className="customizer-element sliders">
              { isLoadingData ? <span className="material-icons loading spin">toys</span> : null }
              { sliders }
            </div>
            <div className="customizer-element image">
              <div className="svg-container">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 256">
                  <path fill={`rgb(${rgb[0]},${rgb[1]},${rgb[2]})`} d="M103 229.4c-0.1 6.2-5.6 3.3-12.3 3.3 -18.5 0-37
                0-55.5 0 -6.8 0-12.2 2.9-12.3-3.3 -4.5-62.3-26-125.9-16.8-186.6 1.6-5.9 9.4-3 16.5-1.8 25.4 4.6 50.8
                5 76.1 1.1 7.1-0.9 21.6-5.2 23.3 0.6C130.3 103.6 108 167.1 103 229.4z" />
                  <path fill="#FFFFFF" d="M82 84.4c-19.8 0.9-40.9 0.5-59-3.2C17.1 80 7.6 77.8 4.9 72.9c-2.3-4.2 0-22.3
                1.2-30.1 1.6-5.9 9.4-3 16.5-1.8 25.4 4.6 50.8 5 76.1 1.1 7.1-0.9 22.5-5.4 23.3 0.6 1.5 11.2 4.6
                27.2-1.2 32.4 -4.3 4-12.8 6.5-19.3 7.6C95.6 83.6 88.4 84.1 82 84.4z" />
                  <path fill="none" stroke="#000000" strokeWidth="0.5" strokeMiterlimit="10" d="M103 229.4c-0.1 6.2-5.6
                3.3-12.3 3.3 -18.5 0-37 0-55.5 0 -6.8 0-12.2 2.9-12.3-3.3 -4.5-62.3-26-125.9-16.8-186.6 1.6-5.9 9.4-3
                16.5-1.8 25.4 4.6 50.8 5 76.1 1.1 7.1-0.9 21.6-5.2 23.3 0.6C130.3 103.6 108 167.1 103 229.4z" />
                  <path fill="#FFFFFF" stroke="#000000" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"
                    strokeMiterlimit="10" d="M102.8 245.2c-0.1 4.3-17.5 7.8-39 7.8 -21.5 0-39-3.5-39-7.8 0-1.8-4.3-14
                0.8-15.3 7.1-1.8 25.6 7.5 38.2 7.5 13.5 0 30.6-9 37.6-7C105.6 231.7 102.9 243.6 102.8 245.2z" />
                  <path fill={`rgb(${rgb[0]},${rgb[1]},${rgb[2]})`} d="M103.2 232.4c-0.1 4.3-17.7 7.8-39.4 7.8 -21.7
                0-39.3-3.5-39.4-7.8 -0.1-4.3 17.5-7.8 39.4-7.8C85.7 224.6 103.3 228.1 103.2 232.4z" />
                  <path fill="#FFFFFF" d="M116.1 52.6c-0.1 0-0.3 0-0.4 0 -1.8 0-4 0.3-6.3 0.7 4.9 36.4-1.3 74.9-7.4
                112.1 -3 18.4-5 39.8-7.8 59.8 -1.7 11.9-19.2 7.6-30.2 9.6 12.9 1.5 33.1 2.9 34.6-11.3 1.9-19.3 5.2-38.4
                8.6-57.6C113.8 128.2 120.8 89.4 116.1 52.6z" />
                  <path fill="#FFFFFF" stroke="#000000" strokeWidth="0.5" strokeMiterlimit="10" d="M121 40.9c0 6.6-24.8
                12-58.2 12s-56-5.4-56-12c0-2.2 2.4-4.2 6.8-5.9 0.1-0.2 0.2-0.4 0.2-0.6 0.7-2 0.6-2.7 0.6-5.5 0-6.4
                6-11.7 13.4-11.7 1.9 0 3.7 0.4 5.4 1 -0.3-1-0.5-2-0.5-3.1 0-5.9 4.8-10.2 11.1-11.5 1.6-0.3 16.3-0.1 13
                4C60.3 3.2 67.3 2 73 3.8c7.5 2.3 9.2 7.1 8.9 13.5 6.8-9.9 31.8-0.8 27 10.5 0.5-1.2 7.1 2.8 7.6 3.4 1.4
                1.8 1.5 3.6 0.9 5.6C119.7 38 121 39.5 121 40.9z" />
                </svg>
                <div className="bubble-filter" style={{ filter: `brightness(${0.25 + variables.Colour * 0.0075})` }} />
              </div>
            </div>
          </div>
          <div className="customizer-element description card">
            <p>{description}</p>
          </div>
          <div className="customizer-element actions card">
            { index === customizations.length
              ? <React.Fragment>
                <h2>One more thing...</h2>
                <MaterialInput className="large" type="text" id="name" labelText="Name your beer" active={!!name}
                  value={name} onChange={(event) => this.setState({ name: event.target.value })} />
              </React.Fragment>
              : null }
            { newCustomizationId ? <p className="success"><span>Beer Saved!</span>
              <Link className="button" to={{ pathname: "/admin/branding", search:`?id=${newCustomizationId}` }}>
                Brand It</Link></p>
              : <button className="large" onClick={() => this.saveCustomization()}>Save</button> }
            <p className="error">{customizationError ? <span className="material-icons">error</span> : null }
              {customizationError}</p>
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
  newCustomizationId: PropTypes.number,
  isLoadingData: PropTypes.bool.isRequired,
  // dataError: PropTypes.string.isRequired,
  customizationError: PropTypes.string.isRequired,
  getData: PropTypes.func.isRequired,
  getCustomizations: PropTypes.func.isRequired,
  newCustomization: PropTypes.func.isRequired,
  updateCustomization: PropTypes.func.isRequired,
  location: PropTypes.object
};

const mapStateToProps = state => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
    variables: state.customizer.variables,
    templates: state.customizer.templates,
    customizations: state.branding.customizations,
    newCustomizationId: state.branding.newCustomizationId,
    dataError: state.customizer.error,
    customizationError: state.branding.error,
    isLoadingData: state.customizer.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getData: () => dispatch(getCustomizerData()),
    getCustomizations: () => dispatch(getCustomizations()),
    newCustomization: (name, description, volume, colour, hoppiness, maltFlavour) =>
      dispatch(newCustomization(name, description, volume, colour, hoppiness, maltFlavour)),
    updateCustomization: (name, description, volume, colour, hoppiness, maltFlavour) =>
      dispatch(updateCustomization(name, description, volume, colour, hoppiness, maltFlavour))
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Customizer));
