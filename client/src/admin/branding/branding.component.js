import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { getCustomizations } from "./branding.actions";
import MaterialSelect from "../../components/material-select.component";

class Branding extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
    const { location, customizations, getCustomizations } = this.props;
    if (customizations.length === 0) {
      getCustomizations();
    } else if (location.search) {
      this.setIndex(location.search, customizations);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { location, customizations } = this.props;
    if (location.search && (customizations.length === 0 && nextProps.customizations.length !== 0)) {
      this.setIndex(location.search, nextProps.customizations);
    }
  }

  render() {
    const index = this.state.index;
    const { customizations, isLoading } = this.props;
    let beer = null;
    let options = null;

    if (customizations) {
      if (customizations.length > 0) {
        beer = customizations[index];
      }
      if (customizations.length > 1) {
        options = customizations.map((c, i) => {
          return { value: i, text: c.name };
        });
      }
    }

    return (
      <div className="page-content branding">
        <div className="title-bar">
          <h1 className="page-title inline">Brand Your Beer</h1>
          { options
            ? <MaterialSelect options={options} selected={index} onSelect={(i) => this.setState({ index: i })} />
            : null }
        </div>
        { beer
          ? <div>
            <div className="card">
              <h2>{beer.name}</h2>
              <p>{beer.description}</p>
              <ul><li>Volume: {beer.volume}</li> <li>Colour: {beer.colour}</li>
                <li>Hoppiness: {beer.hoppiness}</li> <li>Malt Flavour: {beer.maltFlavour}</li></ul>
            </div>
          </div>
          : null }
        { isLoading
          ? <span className="loading spin material-icons">toys</span>
          : customizations.length === 0
            ? <p className="none-found">You haven't made any beers. <Link to="/admin/customizer">Make one now?</Link>
            </p> : null}
      </div>
    );
  }
}

Branding.propTypes = {
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
  getCustomizations: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  location: PropTypes.object
};

const mapStateToProps = state => {
  return {
    customizations: state.branding.customizations,
    isLoading: state.branding.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getCustomizations: () => dispatch(getCustomizations())
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Branding));
