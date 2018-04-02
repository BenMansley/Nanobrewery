import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import MaterialInput from "../../components/material-input.component";
import { editUser, getUserDetails } from "../../authentication/authentication.actions";

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: props.user.email,
      name: props.user.name,
      companyName: props.user.companyName,
      isEditing: false
    };
  }

  componentDidMount() {
    this.props.getDetails();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.email !== "" && this.props.user.email === "") {
      const { email, name, companyName } = nextProps.user;
      this.setState({ email, name, companyName });
    }
  }

  onCancelClick() {
    const { email, name, companyName } = this.props.user;
    this.setState({ email, name, companyName, isEditing: false });
  }

  onSubmit(event) {
    event.preventDefault();
    const { email, name, companyName } = this.state;
    this.props.editUser(email, name, companyName);
    this.setState({ isEditing: false });
  }

  render() {
    const { isEditing, email, name, companyName } = this.state;
    const { isLoading, error } = this.props;

    return (
      <div className="page-content">
        <h1 className="page-title">Your Account</h1>
        <div className="card">
          { !isEditing
            ? <div>
              <div className="account-details">
                <p><span>Email: </span>{email}</p>
                <p><span>Name: </span>{name}</p>
                { companyName ? <p><span>Company Name: </span>{companyName}</p> : null }
              </div>
              <div className="form-base">
                <p className="error">{error ? <span className="material-icons">error</span> : null }
                  {error}</p>
                <div className="account-actions">
                  <button onClick={() => this.setState({ isEditing: true })}>Edit</button>
                </div>
              </div>
            </div>
            : <form onSubmit={(event) => this.onSubmit(event)}>
              <div className="account-details">
                <MaterialInput type="email" id="email" labelText="Email" active={!!email} value={email}
                  onChange={(event) => this.setState({ email: event.target.value })} />
                <MaterialInput type="text" id="name" labelText="Name" active={!!name} value={name}
                  onChange={(event) => this.setState({ name: event.target.value })} />
                <MaterialInput type="text" id="company-name" labelText="Company Name" active={!!companyName}
                  value={companyName} onChange={(event) => this.setState({ companyName: event.target.value })} />
              </div>
              <div className="form-base">
                <p className="error">{error ? <span className="material-icons">error</span> : null }
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
    );
  }
}

Account.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
    name: PropTypes.string,
    companyName: PropTypes.string
  }).isRequired,
  error: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  getDetails: PropTypes.func.isRequired,
  editUser: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    user: state.auth.userDetails,
    error: state.auth.error,
    isLoading: state.auth.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getDetails: () => dispatch(getUserDetails()),
    editUser: (email, name, companyName) => dispatch(editUser(email, name, companyName))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Account);
