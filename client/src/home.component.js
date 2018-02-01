import React from 'react';
import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Intro from './admin/user/intro/intro.component';

const Home = ({user}) => {

  const isLoggedIn = user.hasOwnProperty('id');

  return (
    <div className="page-content">
      <h1>Nanobrewery Home Page</h1>
      { isLoggedIn ? <Intro/> : null }
    </div>
  )
}

Home.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
    companyName: PropTypes.string    
  }).isRequired,
};

const mapStateToProps = state => {
  return { user: state.auth.user }
}

export default connect(mapStateToProps)(Home);