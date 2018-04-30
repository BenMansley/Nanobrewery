import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Redirect } from "react-router-dom";

import { verifyUser, reverifyUser } from "./authentication.actions";

class Verify extends Component {
  componentDidMount() {
    const params = this.props.location.search;
    if (params) {
      this.props.verifyUser(params);
    }
  }

  render() {
    const { verifyError, verifySuccess, reverifySuccess, isLoading, resend, location } = this.props;

    return (
      <div className="page-content">
        <h1 className="page-title">&shy;</h1>
        { !location.search || verifySuccess ? <Redirect to={{ pathname: "/" }} /> : null }
        <div className="card">
          { isLoading ? <span className="loading spin material-icons">toys</span> : null }
          { verifyError ? <p className="large"><span className="error">
            <span className="material-icons">error</span>Looks like there's been a problem.
          </span><button onClick={() => resend(location.search)}>Resend</button></p>
            : null }
          { reverifySuccess ? <p className="large">Resent - Check your email in a couple minutes. </p> : null }
        </div>
      </div>
    );
  }
}

Verify.propTypes = {
  location: PropTypes.object.isRequired,
  verifyError: PropTypes.string.isRequired,
  verifySuccess: PropTypes.bool.isRequired,
  reverifySuccess: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  verifyUser: PropTypes.func.isRequired,
  resend: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    verifyError: state.auth.verifyError,
    verifySuccess: state.auth.verifySuccess,
    reverifySuccess: state.auth.reverifySuccess,
    isLoading: state.auth.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    verifyUser: (token) => dispatch(verifyUser(token)),
    resend: (token) => dispatch(reverifyUser(token))
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Verify));
