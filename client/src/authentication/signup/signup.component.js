import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';

import MaterialInput from '../../components/material-input';
import { authenticateSignUp, authFormError } from '../authentication.actions';

class SignUp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      name: '',
      companyName: ''
    };
  }

  onSubmit(event) {
    event.preventDefault();
    const { email, name, password, companyName } = this.state;
    this.props.sendSignUpRequest(email, name, password, companyName);
  }

  render() {

    if (this.props.redirect) {
      return <Redirect to={{pathname: '/admin/user/welcome'}}/>
    }

    return (
      <div className="page-content auth">
        <div className="auth-form card">
          <h1 className="page-title">Create an Account</h1>
          <form onSubmit={(event) => this.onSubmit(event)}>
            <MaterialInput labelText="Email *" type="email" id="email" onChange={(event) => this.setState({email: event.target.value})}
              value={this.state.email} active={!!this.state.email}/>
            <MaterialInput labelText="Password *" type="password" id="password" onChange={(event) => this.setState({password: event.target.value})}
              value={this.state.password} active={!!this.state.password}/>
            <MaterialInput labelText="Name *" type="text" id="name" onChange={(event) => this.setState({name: event.target.value})}
              value={this.state.name} active={!!this.state.name}/>
            <MaterialInput labelText="Company" type="text" id="company" onChange={(event) => this.setState({companyName: event.target.value})}
              value={this.state.companyName} active={!!this.state.companyName}/>
            <div className="form-base">
              <p className="error">{!!this.props.error ? <span className="material-icons">error</span> : null }
                {this.props.error}</p>
              <button type="submit">Sign Up</button>
            </div>
          </form>
        </div>   
        <p className="auth-link">Have an account? <Link to={{pathname: '/authentication/signin', state: this.props.location.state }}>Sign In</Link></p>
      </div>
    );
  }
}

SignUp.propTypes = {
  redirect: PropTypes.bool,
  error: PropTypes.string,
  referrer: PropTypes.object,
  sendSignUpRequest: PropTypes.func.isRequired,  
  sendAuthError: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return { redirect: state.auth.redirect, error: state.auth.error }
}

const mapDispatchToProps = dispatch => {
  return { 
    sendSignUpRequest: (email, name, password, companyName) => dispatch(authenticateSignUp(email, name, password, companyName)),
    sendAuthError: (error) => dispatch(authFormError(error))
  }
}

SignUp = connect(mapStateToProps, mapDispatchToProps)(SignUp);

export default SignUp;