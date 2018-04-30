import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import MaterialInput from "../../components/material-input.component";
import { requestResetPassword } from "./reset.actions";

class ResetRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ""
    };
  }

  onSubmit(event) {
    event.preventDefault();
    const email = this.state.email;
    if (email) {
      this.props.requestResetPassword(email);
    }
  }

  render() {
    const { success, error, isLoading } = this.props;

    return (
      <div className="page-content auth">
        <div className="auth-form card">
          <h1 className="page-title">Reset Your Password</h1>
          <p>Send a password reset request to your email.</p>
          <form onSubmit={(event) => this.onSubmit(event)}>
            <MaterialInput labelText="Email *" type="email" id="email" active={!!this.state.email}
              value={this.state.email} onChange={(event) => this.setState({ email: event.target.value })} />
            <div className="form-base">
              { success ? <p>Sent - Check your email for a reset link.</p>
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
        <p className="auth-link">Know your password? <Link to="/authentication/signin">Sign In</Link></p>
      </div>
    );
  }
}

ResetRequest.propTypes = {
  success: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  requestResetPassword: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    success: state.reset.requestSuccess,
    error: state.reset.requestError,
    isLoading: state.reset.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    requestResetPassword: (email) => dispatch(requestResetPassword(email))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetRequest);
