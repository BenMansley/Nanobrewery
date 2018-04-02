import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Intro from "./intro/intro.component";

const Welcome = ({ user }) => {
  return (
    <div className="page-content">
      <h1 className="page-title">Welcome to the Nanobrewing Club, {user.name.split(/\s+/)[0]}!</h1>
      <p>You're all ready to get set up.</p>
      <h2>First Steps</h2>
      <Intro />
    </div>
  );
};

Welcome.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
    companyName: PropTypes.string
  }).isRequired
};

const mapStateToProps = state => {
  return { user: state.auth.user };
};

export default connect(mapStateToProps)(Welcome);
