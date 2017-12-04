import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const Home = ({user}) => {

  const isLoggedIn = user.hasOwnProperty('id');

  return (
    <div className="page-content">
      <h1>Nanobrewery Home Page</h1>
      { isLoggedIn ? <Link to='/admin/customizer' className='header-link'><span>Customize</span></Link> : null }
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