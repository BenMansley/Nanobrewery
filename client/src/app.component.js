import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Route, Switch, withRouter } from 'react-router-dom'; 
import PrivateRoute from './private-route/private-route';
import Home from './home.component';
import SignIn from './authentication/signin/signin.component';
import SignUp from './authentication/signup/signup.component';
import Account from './admin/user/account.component';
import Welcome from './admin/user/welcome.component';
import Customizer from './admin/customizer/customizer.component';
import NoMatch from './no-match';
import { signout, changeRoute } from './authentication/authentication.actions';

class App extends Component {

  constructor(props) {
    super(props);

    this.props.history.listen((location, action) => {
      this.props.changeRoute(location, action);
    });
  }

  render() {
    const isLoggedIn = this.props.user.hasOwnProperty('id');
  
    return (
      <div className='root'>
        <header>
          <div className='site-header'>
            <h1 className='site-title'><Link to='/' className='header-link'>The Nanobrewery Company</Link></h1>
            <div>
              { isLoggedIn ? <Link to='/admin/user/account' className='header-link'><span>{this.props.user.name}</span></Link> : null }
              { isLoggedIn ? <a className="header-link" href="" onClick={() => this.props.signout()}>Sign Out</a> : null }
              { !isLoggedIn ? <Link to='/authentication/signin' className='header-link'><span>Sign In</span></Link> : null }
              { !isLoggedIn ? <Link to='/authentication/signup' className='header-link'><span>Sign Up</span></Link> : null }                       
            </div>
          </div>
        </header>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/authentication/signin' component={SignIn}/>
          <Route exact path='/authentication/signup' component={SignUp}/>
          <PrivateRoute exact path='/admin/user/account' isLoggedIn={isLoggedIn} component={Account}/>
          <PrivateRoute exact path='/admin/user/welcome' isLoggedIn={isLoggedIn} component={Welcome}/>
          <PrivateRoute exact path='/admin/customizer' isLoggedIn={isLoggedIn} component={Customizer}/>             
          <Route exact component={NoMatch}/>
        </Switch>
      </div>
    );
  }
}

App.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
    companyName: PropTypes.string    
  }).isRequired,
  signout: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return { user: state.auth.user }
}

const mapDispatchToProps = dispatch => {
  return { 
    signout: () => dispatch(signout()),
    changeRoute: (location, action) => dispatch(changeRoute(location, action)) 
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));