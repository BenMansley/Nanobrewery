import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Route, Switch, withRouter } from 'react-router-dom'; 
import PrivateRoute from './utils/private-route';
import Home from './home.component';
import SignIn from './authentication/signin/signin.component';
import SignUp from './authentication/signup/signup.component';
import Admin from './admin/admin.component';
import NoMatch from './no-match';
import { checkTokenAndSignIn, signout, changeRoute } from './authentication/authentication.actions';

class App extends Component {

  constructor(props) {
    super(props);

    this.props.history.listen((location, action) => {
      this.props.changeRoute(location, action);
    });
  }

  componentDidMount() {
    let id = window.localStorage.getItem('id');
    const token = window.localStorage.getItem('sessiontoken');
    if (id && token) {
      id = Number(id);
      console.log(`${id}, ${token}`);
      this.props.checkToken(id, token);
    }
  }

  render() {
    const isLoggedIn = this.props.user.hasOwnProperty('id');
  
    return (
      <div className='app-root'>
        <header>
          <div className='site-header'>
            <h1 className='site-title'><Link to='/' className='header-link'>The Nanobrewery Company</Link></h1>
            <h1 className='site-title mobile'><Link to='/' className='header-link'>Nanobrewery</Link></h1>            
            <nav>
              { isLoggedIn ? <Link to='/admin/user/account' className='header-link'><span>{this.props.user.name}</span></Link> : null }
              { isLoggedIn ? <a className="header-link" href="" onClick={() => this.props.signout()}>Sign Out</a> : null }
              { !isLoggedIn ? <Link to='/authentication/signin' className='header-link'><span>Sign In</span></Link> : null }
              { !isLoggedIn ? <Link to='/authentication/signup' className='header-link'><span>Sign Up</span></Link> : null }
              { isLoggedIn ? <Link to='/admin/basket' className='header-link'>
                Basket {this.props.basketItems.length ? this.props.basketItems.length : '' }
              </Link> : null }                     
            </nav>
          </div>
        </header>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/authentication/signin' component={SignIn}/>
          <Route exact path='/authentication/signup' component={SignUp}/>
          <PrivateRoute path='/admin' allowAccess={isLoggedIn} component={Admin}/>
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
  return { 
    user: state.auth.user,
    basketItems: state.shop.basket
  }
}

const mapDispatchToProps = dispatch => {
  return {
    checkToken: (id, token) => dispatch(checkTokenAndSignIn(id, token)),
    signout: () => dispatch(signout()),
    changeRoute: (location, action) => dispatch(changeRoute(location, action)),
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));