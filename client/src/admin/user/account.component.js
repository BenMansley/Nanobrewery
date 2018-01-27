import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import MaterialInput from '../../components/material-input';
import { editUser } from '../../authentication/authentication.actions';

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: props.user.email,
      name: props.user.name,
      companyName: props.user.companyName,
      isEditing: false
    }
  }

  onCancelClick() {
    const { email, name, companyName } = this.props.user;
    this.setState({email, name, companyName, isEditing: false});
  }
  
  onSubmit(event) {
    event.preventDefault();
    const { email, name, companyName } = this.state;
    console.log('submit');
    this.props.editUser(this.props.user.id, email, name, companyName);
    this.setState({isEditing: false});
  }

  render() {
    const { isEditing, email, name, companyName } = this.state;
    const { isLoading, error } = this.props;

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
            { !isEditing && !isLoading ? 
            <div>
              <div className="account-details">
                <p><span>Email: </span>{email}</p>
                <p><span>Name: </span>{name}</p>
                { companyName ? <p><span>Company Name: </span>{companyName}</p> : null }
              </div>
              <div className="form-base">
                <p className="error">{!!error ? <span className="material-icons">error</span> : null }
                  {error}</p>
                <div className="account-actions">
                  <button onClick={() => this.setState({isEditing: true})}>Edit</button>
                </div>
              </div>
            </div>
            :
            <form onSubmit={(event) => this.onSubmit(event)}>
              <div className="account-details">
                <MaterialInput type="email" id="email" labelText="Email" active={!!email} value={email}
                  onChange={(event) => this.setState({email: event.target.value})}/>
                <MaterialInput type="text" id="name" labelText="Name" active={!!name} value={name}
                  onChange={(event) => this.setState({name: event.target.value})}/>
                <MaterialInput type="text" id="company-name" labelText="Company Name" active={!!companyName} value={companyName}
                  onChange={(event) => this.setState({companyName: event.target.value})}/>                
              </div>
              <div className="form-base">
                <p className="error">{!!error ? <span className="material-icons">error</span> : null }
                  {error}</p>
                { isLoading ? <span className="material-icons loading spin">toys</span> : null }
                <div className="account-actions">
                  <button type="submit">Save</button>
                  <button type="reset" onClick={() => this.onCancelClick()}>Cancel</button>
                </div>
              </div>
            </form>
            }
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
  return { user: state.auth.user, error: state.auth.error, isLoading: state.auth.isLoading }
}

const mapDispatchToProps = dispatch => {
  return {
    editUser: (id, email, name, companyName) => dispatch(editUser(id, email, name, companyName))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Account));