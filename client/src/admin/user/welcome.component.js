import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Welcome = ({user}) => {
  return (
    <div className="page-content">
      <h1 className="page-title">Welcome to the Nanobrewing Club, {user.name.split(/\s+/)[0]}!</h1>
      <p>You're all ready to get set up.</p>
      <h2>First Steps</h2>
      <div className="welcome-steps">
        <Link to="/shop/hardware" className="card step hardware">
          <div className="step-flex">
            <div className="step-image"><span className="step-complete material-icons">done</span></div>
            <span className="step-title">Get the Hardware</span>
          </div>
        </Link>
        <span className="step-next material-icons">arrow_forward</span>
        <Link to="/admin/customizer" className="card step make">
          <div className="step-flex">
            <div className="step-image"></div>
            <span className="step-title">Make Your First Beer</span>
          </div>
        </Link>
        <span className="step-next material-icons">arrow_forward</span>
        <Link to="/admin/branding" className="card step brand">
          <div className="step-flex">
            <div className="step-image"><span className="step-incomplete material-icons">clear</span></div>
            <span className="step-title">Brand Your Beer</span>
          </div>
        </Link>
      </div>
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