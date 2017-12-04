import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: props.user.email,
      name: props.user.name,
      companyName: props.user.companyName
    }
  }

  onRevertClick() {
    const { email, name, companyName } = this.props.user;
    this.setState({email, name, companyName});
  }
  
  render() {
    const { email, name, companyName } = this.state;

    return (
      <div>
        <nav className="account-header">
          <ul>
            <li><Link to="account">Account</Link></li>
            <li>Link 2</li>
            <li>Link 3</li>
            <li>Link 4</li>
            <li>Link 5</li>
          </ul>
        </nav>
        <div className="page-content">
          <div className="card">
            <h1 className="page-title">Your Account</h1>
            <div className="account-details">
              <p><span>Email: </span>{email}</p>
              <p><span>Name: </span>{name}</p>
              { companyName ? <p><span>Company Name: </span>{companyName}</p> : null }
              <p><span>Password: </span>*********</p>
            </div>
            <div className="account-actions">
              <button>Save</button>
              <button onClick={() => this.onRevertClick()}>Revert</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Account.propTypes = {
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

export default withRouter(connect(mapStateToProps)(Account));