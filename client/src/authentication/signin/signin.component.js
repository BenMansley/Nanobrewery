import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";

import MaterialInput from "../../components/material-input.component";
import { authenticateSignIn } from "../authentication.actions";

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }

  onSubmit(event) {
    event.preventDefault();
    const { email, password } = this.state;
    this.props.sendSignInRequest(email, password);
  }

  render() {
    const { from } = this.props.location.state || this.props.referrer || { from: { pathname: "/" } };

    if (this.props.redirect) {
      return <Redirect to={from} />;
    }

    return (
      <div className="page-content auth">
        <div className="auth-form card">
          <h1 className="page-title">Sign In to Your Account</h1>
          <form onSubmit={(event) => this.onSubmit(event)}>
            <MaterialInput labelText="Email *" type="email" id="email" active={!!this.state.email}
              value={this.state.email} onChange={(event) => this.setState({ email: event.target.value })} />
            <MaterialInput labelText="Password *" type="password" id="password" active={!!this.state.password}
              value={this.state.password} onChange={(event) => this.setState({ password: event.target.value })} />
            <div className="form-base">
              <p className="error">{this.props.error !== "" && <span className="material-icons">error</span>}
                {this.props.error}</p>
              <button type="submit">Sign In</button>
            </div>
          </form>
        </div>
        <p className="auth-link">Need an account? <Link to="/authentication/signup">Sign Up</Link></p>
      </div>
    );
  }
}

SignIn.propTypes = {
  redirect: PropTypes.bool,
  error: PropTypes.string,
  location: PropTypes.object,
  referrer: PropTypes.object,
  sendSignInRequest: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return { redirect: state.auth.redirect, error: state.auth.error };
};

const mapDispatchToProps = dispatch => {
  return { sendSignInRequest: (email, password) => dispatch(authenticateSignIn(email, password)) };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
