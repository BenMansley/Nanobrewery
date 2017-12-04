export const actionTypes = {
  SEND_AUTH_REQUEST: 'SEND_AUTH_REQUEST',
  AUTH_RESPONSE_FAIL: 'AUTH_RESPONSE_FAIL',
  AUTH_RESPONSE_SUCCESS: 'AUTH_RESPONSE_SUCCESS',
  AUTH_FORM_ERROR: 'AUTH_FORM_ERROR',
  AUTH_SIGNOUT: 'AUTH_SIGNOUT',
  ROUTE_CHANGE: 'ROUTE_CHANGE'
};

const sendAuthRequest = () => {
  return { type: actionTypes.SEND_AUTH_REQUEST }
}

const authResponseSuccess = (user) => {
  return { type: actionTypes.AUTH_RESPONSE_SUCCESS, user }
}

const authResponseFail = (error) => {
  return { type: actionTypes.AUTH_RESPONSE_FAIL, error }
}

export const authFormError = (error) => {
  return { type: actionTypes.AUTH_FORM_ERROR, error }
}

const authenticate = (url, data) => {
  return dispatch => {
    dispatch(sendAuthRequest());

    const headers = new Headers({'Content-Type': 'application/json'});
    fetch(url, { 
      method: 'POST',
      headers: headers, 
      body: JSON.stringify(data)
    })
      .then(res => {
        if (res.status === 400) {
          res.json()
          .then(error => {
            dispatch(authResponseFail(error));
          });
        } else if (res.status === 200) {
          res.json()
          .then(data => {
            dispatch(authResponseSuccess(data));
          });
        }
      })
  }
}

export const authenticateSignIn = (email, password) => {
  if (!email || !password) {
    return authFormError('All Fields Required');
  }
  return authenticate('/api/users', {email, password});
}

export const authenticateSignUp = (email, name, password, companyName) => {
  if (!email || !name || !password) {
    return authFormError('Required fields left blank')
  }
  return authenticate('/api/users/new', {email, name, password, companyName});
}

export const signout = () => {
  return { type: actionTypes.AUTH_SIGNOUT }
}

export const changeRoute = (location, action) => {
  return { type: actionTypes.ROUTE_CHANGE, location, action }
}