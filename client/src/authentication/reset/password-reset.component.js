import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter, Redirect, Link } from "react-router-dom";
import { connect } from "react-redux";

import MaterialInput from "../../components/material-input.component";
import { resetPassword } from "./reset.actions";

class PasswordReset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      confirmation: ""
    };
  }

  onSubmit(event) {
    event.preventDefault();
    const { password, confirmation } = this.state;
    if ((password === confirmation) && password) {
      this.props.resetPassword(this.props.location.search, password);
    }
  }

  render() {
    const { success, error, isLoading, location } = this.props;
    const { password, confirmation } = this.state;

    return (
      <div className="page-content auth">
        <div className="auth-form card">
          { !location.search ? <Redirect to={{ pathname: "/" }} /> : null}
          <h1 className="page-title">Reset Your Password</h1>
          <form onSubmit={(event) => this.onSubmit(event)}>
            <MaterialInput labelText="New Password *" type="password" id="password" active={!!password} value={password}
              onChange={(event) => this.setState({ password: event.target.value })} />
            <MaterialInput labelText="Confirm Password *" type="password" id="confirmation" active={!!confirmation}
              value={confirmation} onChange={(event) => this.setState({ confirmation: event.target.value })} />
            <div className="form-base">
              { success ? <p>Password Changed. <Link to="/authentication/signin">Sign In</Link></p>
                : <React.Fragment>
                  { isLoading ? <span className="material-icons loading spin">toys</span> : null }
                  <p className="error">{error !== "" && <span className="material-icons">error</span>}
                    {error}</p>
                  <button type="submit">Reset</button>
                </React.Fragment>
              }
            </div>
          </form>
        </div>
      </div>
    );
  }
}

PasswordReset.propTypes = {
  success: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  resetPassword: PropTypes.func.isRequired,
  location: PropTypes.object
};

const mapStateToProps = state => {
  return {
    success: state.reset.resetSuccess,
    error: state.reset.resetError,
    isLoading: state.reset.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    resetPassword: (token, password) => dispatch(resetPassword(token, password))
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PasswordReset));
