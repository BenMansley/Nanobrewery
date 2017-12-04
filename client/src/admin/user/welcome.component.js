import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Welcome = ({user}) =>{
  return (
    <div className="page-content">
      <h1 className="page-title">Welcome to the Nanobrewing Club, {user.name}!</h1>
      <p>You're all ready to get set up.</p>
    </div>
  );
}

Welcome.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
    companyName: PropTypes.string    
  }).isRequired
};

const mapStateToProps = state => {
  return { user: state.auth.user }
}

export default connect(mapStateToProps)(Welcome);