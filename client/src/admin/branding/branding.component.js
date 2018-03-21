import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCustomization } from './branding.actions';

class Branding extends Component {

  componentDidMount() {
    this.props.getCustomization();
  }

  render() {
    const beer = this.props.beer;
    return (
      <div className="page-content branding">
        <h1 className="page-title">Brand Your Beer</h1>
        { beer ? 
          <div>
            <h2>{beer.name}</h2>
            <p>{beer.abv}</p>
          </div>
        : null }
      </div>
    )
  }
};

Branding.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
    companyName: PropTypes.string    
  }).isRequired,
  beer: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    abv: PropTypes.number
  })
};

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    beer: state.branding.beer
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getCustomization: () => dispatch(getCustomization(32))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Branding);