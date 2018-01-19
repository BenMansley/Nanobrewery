import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EditableSlider from './slider/editable-slider.component';

import { getVariables } from './customizer.actions';

class Dashboard extends Component {

  constructor(props) {
    super(props)
  
    this.state = {
      variables: [],
      rgb: [55,8,10],
    }
  }

  componentDidMount() {
    this.props.getVariables();
  }

  componentWillReceiveProps(props) {
    this.setState(prevState => {
      if (prevState.variables.length === 0 && props.variables.length !== 0) {
        console.log(props.variables);
        for (let variable of props.variables) {
          variable.value = variable.defaultVal;
        }
        return {variables: props.variables};
      }
      return prevState;
    })
  }

  setColour(value) {
    let variables = this.state.variables;
    variables[1].value = value;

    this.setState({variables}, _ => {
      const minRGB = [55, 8, 10];
      const step = [2, 2.22, 1.43];
      const rgb = minRGB.map((colour, i) => {
        return Math.round(colour + step[i] * value);
      });
      this.setState({rgb});
    });
  }

  render() {
    const rgb = this.state.rgb;
    const variables = this.state.variables;
    
    let sliders;
    
    if (variables.length > 0) {
      sliders = variables.map((v, i) => {
        if (v.name === 'Colour') {
          return <EditableSlider key={v.id} id={v.id} name={v.name} min={v.min} max={v.max} step={v.step} suffix={v.suffix} 
                  value={v.value} defaultVal={0} disabled onChange={(value) => this.setColour(value)}/>
        }
        return <EditableSlider key={v.id} id={v.id} name={v.name} min={v.min} max={v.max} step={v.step} suffix={v.suffix} 
                value={v.value} defaultVal={v.defaultVal}
                onChange={(value) => {
                  let variables = this.state.variables;
                  variables[i].value = value;
                  this.setState({variables});
                }}
               />
      });
    }

    return (
      <div className="page-content customize">
        <h1 className="page-title">Admin Dashboard - Customizer</h1>
        <div className="customizer">
          <div className="customizer-sliders card">
            { this.props.isLoading ? <span className="loading">Loading...</span> : sliders }
          </div>
          <div className="customizer-image card">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 48 48">
              <path fill={`rgb(${rgb[0]},${rgb[1]},${rgb[2]})`} strokeWidth="2" stroke="#000000" d={`
                M1.9,7.4c4.6,0,9.2,0,13.8,0c0.3-1.2,0.6-2.5,1-3.6c9.2,0,18.4,0,27.7,0c0.2,0.9,0.3,1.7,0.5,2.6
                c0.1,0.9,0.3,1.7,0.4,2.6c0.1,0.3,0,0.4-0.3,0.5C44.5,9.6,44,9.8,43.6,10c-0.1,0.1-0.3,0.3-0.3,0.5c0,7.5,0,15,0,22.5
                c0,0.2,0.1,0.4,0.2,0.6c1.1,1.6,2.2,3.3,3.3,4.9c0.1,0.2,0.2,0.5,0.2,0.7c0,1.7,0,3.4,0,5.1c-11,0-22.1,0-33.2,0c0-0.4,0-0.8,0-1.2
                c0-1.3,0-2.7,0-3.9c0-0.3,0.1-0.6,0.2-0.8c1.1-1.6,2.1-3.2,3.2-4.8c0.1-0.1,0.2-0.3,0.3-0.5c-0.4,0-0.7,0-1.1,0c-1.4,0-3,0-4.4-0.2
                c-2.5-0.3-4.5-1.4-6.2-3.3c-2.1-2.2-3.1-4.8-3.1-7.9c0-2.9,0-5.8,0-8.6c0-0.2-0.1-0.5-0.3-0.7C2,11.9,1,11.2,1,11.2c0,0,0-0.1,0-0.2
                c0.1-0.6,0.3-1.2,0.4-1.8C1.6,8.6,1.7,8,1.9,7.4z M10.2,14.8c0,1.1,0,2,0,3.1c0,1.4,0,2.9,0,4.3c0,1.9,1.3,3.5,3.3,3.6
                c1.2,0.1,2.3,0.1,3.5,0.1c0.2,0,0.4,0,0.6,0c0-3.7,0-7.4,0-11C15,14.8,12.6,14.8,10.2,14.8z`}/>
              <path fill={`rgb(${rgb[0]},${rgb[1]},${rgb[2]})`} strokeWidth="2" stroke="#000000" d={`M-7.8,2.6`}/>
            </svg>
          </div>
          <div className="customizer-facts card">
            <p>A factsheet will generate here</p>
          </div>
          <div className="customizer-description card">
            <p>The description will show here</p>
          </div>
        </div>
      </div>
    )
  }
}

Dashboard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
    companyName: PropTypes.string    
  }).isRequired,
  getVariables: PropTypes.func.isRequired,
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
  isLoading: PropTypes.bool.isRequired
}

const mapStateToProps = state => {
  return { user: state.auth.user, variables: state.customizer.variables, isLoading: state.customizer.isLoading }
}

const mapDispatchToProps = dispatch => {
  return {
    getVariables: () => dispatch(getVariables())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard); 