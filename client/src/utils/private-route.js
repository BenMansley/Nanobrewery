import React from 'react'
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, allowAccess, ...rest }) => (
  <Route {...rest} render={props => (
    allowAccess ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/authentication/signin',
        state: { from: props.location }
      }}/>
    )
  )}/>
);  

export default PrivateRoute;
