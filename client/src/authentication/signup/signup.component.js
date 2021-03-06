import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";

import MaterialInput from "../../components/material-input.component";
import { authenticateSignUp, authFormError } from "../authentication.actions";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      confirmation: "",
      name: "",
      dob: new Date().toISOString().substring(0, 10),
      companyName: ""
    };
  }

  onSubmit(event) {
    event.preventDefault();
    const { email, name, password, confirmation, dob, companyName } = this.state;
    this.props.sendSignUpRequest(email, name, password, confirmation, dob, companyName);
  }

  render() {
    const { email, password, confirmation, name, dob, companyName } = this.state;
    const { redirect, error, success, location } = this.props;

    if (redirect) {
      return <Redirect to={{ pathname: "/admin/user/welcome" }} />;
    }

    return (
      <div className="page-content auth">
        <div className="auth-form card">
          <h1 className="page-title">Create an Account</h1>
          <p>After signing up, check your email for a verification link.</p>
          <form onSubmit={(event) => this.onSubmit(event)}>
            <MaterialInput labelText="Email *" type="email" id="email" value={email}
              onChange={(evt) => this.setState({ email: evt.target.value })} />
            <MaterialInput labelText="Password *" type="password" id="password" value={password}
              onChange={(evt) => this.setState({ password: evt.target.value })} />
            <MaterialInput labelText="Confirm Password *" type="password" id="confirmation" value={confirmation}
              onChange={(evt) => this.setState({ confirmation: evt.target.value })} />
            <MaterialInput labelText="Name *" type="text" id="name" value={name}
              onChange={(evt) => this.setState({ name: evt.target.value })} />
            <MaterialInput labelText="Date of Birth" type="date" id="dob" value={dob}
              onChange={(evt) => this.setState({ dob: evt.target.value })} />
            <MaterialInput labelText="Company" type="text" id="company" value={companyName}
              onChange={(evt) => this.setState({ companyName: evt.target.value })} />
            <div className="form-base">
              { error ? <p className="error"><span className="material-icons">error</span>{error}</p> : null }
              {success
                ? <p className="success">Success!
                  <Link className="button" to={{ pathname: "/authentication/signin", state: location.state }}>
                    Sign In</Link></p>
                : <button type="submit">Sign Up</button>
              }
            </div>
          </form>
        </div>
        <p className="auth-link">Have an account? <Link
          to={{ pathname: "/authentication/signin", state: location.state }}>Sign In</Link></p>
        <p className="auth-link">The Nanobrewery Company website uses cookies (just one) to manage login requests and more,
          though this does not include any personal data. By signing up, you agree to the use of cookies on the site.</p>
      </div>
    );
  }
}

SignUp.propTypes = {
  redirect: PropTypes.bool,
  error: PropTypes.string,
  location: PropTypes.object,
  success: PropTypes.bool,
  sendSignUpRequest: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    redirect: state.auth.redirect,
    error: state.auth.error,
    success: state.auth.signUpSuccess
  };
};

const mapDispatchToProps = dispatch => {
  return {
    sendSignUpRequest: (email, name, password, confirmation, dob, companyName) =>
      dispatch(authenticateSignUp(email, name, password, confirmation, dob, companyName)),
    sendAuthError: (error) => dispatch(authFormError(error))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
