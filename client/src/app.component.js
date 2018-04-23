import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withCookies, Cookies } from "react-cookie";
import { Link, Route, Switch, withRouter } from "react-router-dom";
import PrivateRoute from "./utils/private-route";
import Home from "./home/home.component";
import SignIn from "./authentication/signin/signin.component";
import SignUp from "./authentication/signup/signup.component";
import Admin from "./admin/admin.component";
import Verify from "./authentication/verify.component";
import NoMatch from "./no-match";
import { signout, changeRoute, getSessionFromCookie } from "./authentication/authentication.actions";
import { getBasketSize } from "./admin/shop/shop.actions";

class App extends Component {
  constructor(props) {
    super(props);

    props.history.listen((location, action) => {
      props.changeRoute(location, action);
    });

    this.state = {
      validating: true
    };
  }

  componentDidMount() {
    const { cookies } = this.props;
    const session = cookies.get("session");
    if (session) {
      this.props.getSessionFromCookie();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.isLoggedIn && !prevProps.isLoggedIn) {
      this.props.getBasketSize();
    }
  }

  componentWillReceiveProps(nextProps) {
    if ((!this.props.basketSize) && nextProps.basketSize) {
      this.setState({ validating: false });
    }
  }

  render() {
    const { basketSize, signout, isLoggedIn } = this.props;

    return (
      <div className="app-root">
        <header>
          <div className="site-header">
            <h1 className="site-title"><Link to="/" className="header-link">The Nanobrewery Company</Link></h1>
            <h1 className="site-title mobile"><Link to="/" className="header-link">Nanobrewery</Link></h1>
            <nav>
              { isLoggedIn
                ? <Link to="/admin/user/account" className="header-link"><span>Account</span></Link>
                : null }
              { isLoggedIn
                ? <a className="header-link" onClick={() => signout()}>Sign Out</a> : null }
              { !isLoggedIn
                ? <Link to="/authentication/signin" className="header-link"><span>Sign In</span></Link> : null }
              { !isLoggedIn
                ? <Link to="/authentication/signup" className="header-link"><span>Sign Up</span></Link> : null }
              { isLoggedIn
                ? <Link to="/admin/basket" className="header-link">
                Basket{basketSize > 0 ? " (" + basketSize + ")" : "" }
                </Link> : null }
            </nav>
          </div>
        </header>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/authentication/signin" component={SignIn} />
          <Route exact path="/authentication/signup" component={SignUp} />
          <Route exact path="/verify" component={Verify} />
          { (!this.state.validating || isLoggedIn)
            ? <PrivateRoute path="/admin" allowAccess={isLoggedIn} component={Admin} /> : null }
          { (!this.state.validating || isLoggedIn) ? <Route exact component={NoMatch} /> : null }
        </Switch>
      </div>
    );
  }
}

App.propTypes = {
  isLoggedIn: PropTypes.bool,
  basketSize: PropTypes.number,
  signout: PropTypes.func.isRequired,
  changeRoute: PropTypes.func.isRequired,
  getBasketSize: PropTypes.func.isRequired,
  getSessionFromCookie: PropTypes.func.isRequired,
  history: PropTypes.object,
  cookies: PropTypes.instanceOf(Cookies)
};

const mapStateToProps = state => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
    basketSize: state.shop.basketSize
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signout: () => dispatch(signout()),
    changeRoute: (location, action) => dispatch(changeRoute(location, action)),
    getBasketSize: (userId) => dispatch(getBasketSize(userId)),
    getSessionFromCookie: () => dispatch(getSessionFromCookie())
  };
};

export default withCookies(withRouter(connect(mapStateToProps, mapDispatchToProps)(App)));
