import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, allowAccess, ...rest }) => (
  <Route {...rest} render={props => (
    allowAccess ? (
      <Component {...props} />
    ) : (
      <Redirect to={{
        pathname: "/authentication/signin",
        state: { from: props.location }
      }} />
    )
  )} />
);

PrivateRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  allowAccess: PropTypes.bool.isRequired,
  location: PropTypes.object
};

export default PrivateRoute;
