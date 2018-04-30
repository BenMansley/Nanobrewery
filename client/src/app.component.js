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
import ResetRequest from "./authentication/reset/reset-request.component";
import PasswordReset from "./authentication/reset/password-reset.component";

class App extends Component {
  constructor(props) {
    super(props);

    props.history.listen((location, action) => {
      props.changeRoute(location, action);
    });

    this.state = {
      validating: true,
      isMenuActive: false
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

  onSignOut() {
    const { cookies, signout } = this.props;
    signout();
    cookies.remove("session", { path: "/" });
  }

  render() {
    const { basketSize, isLoggedIn } = this.props;
    const isMenuActive = this.state.isMenuActive;

    let navLinks;

    if (isLoggedIn) {
      navLinks = <React.Fragment>
        <Link to="/admin/basket" className="header-link">Basket{basketSize > 0 ? " (" + basketSize + ")" : "" }</Link>
        <Link to="/admin/user/account" className="header-link"><span>Account</span></Link>
        <a className="header-link" onClick={() => this.onSignOut()}>Sign Out</a>
      </React.Fragment>;
    } else {
      navLinks = <React.Fragment>
        <Link to="/authentication/signin" className="header-link"><span>Sign In</span></Link>
        <Link to="/authentication/signup" className="header-link"><span>Sign Up</span></Link>
      </React.Fragment>;
    }

    return (
      <div className="app-root">
        <header>
          <div className="site-header">
            <h1 className="site-title"><Link to="/" className="header-link">The Nanobrewery Company</Link></h1>
            <h1 className="site-title mobile"><Link to="/" className="header-link">Nanobrewery</Link></h1>
            <nav className="desktop">{navLinks}</nav>
            <span onClick={() => this.setState(prevState => { return { isMenuActive: !prevState.isMenuActive }; })}
              className={"material-icons menu-toggle" + (isMenuActive ? " active" : "")}>menu</span>
            <nav className={"mobile" + (isMenuActive ? " active" : "")}>{navLinks}</nav>
          </div>
        </header>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/authentication/signin" component={SignIn} />
          <Route exact path="/authentication/signup" component={SignUp} />
          <Route exact path="/verify" component={Verify} />
          <Route exact path="/authentication/reset-request" component={ResetRequest} />
          <Route exact path="/authentication/password-reset" component={PasswordReset} />
          { (!this.state.validating || isLoggedIn)
            ? <PrivateRoute path="/admin" allowAccess={isLoggedIn} component={Admin} /> : <NoMatch /> }
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
