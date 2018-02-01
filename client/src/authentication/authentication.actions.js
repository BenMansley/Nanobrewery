import asyncAction from '../utils/async-action';

export const actionTypes = {
  SEND_AUTH_REQUEST: 'SEND_AUTH_REQUEST',
  AUTH_RESPONSE_SUCCESS: 'AUTH_RESPONSE_SUCCESS',
  AUTH_RESPONSE_FAIL: 'AUTH_RESPONSE_FAIL',
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
  console.log(error);
  return { type: actionTypes.AUTH_RESPONSE_FAIL, error }
}

export const authFormError = (error) => {
  return { type: actionTypes.AUTH_FORM_ERROR, error }
}

const authenticate = (url, data, method) => {

  return asyncAction(url, { method, body: JSON.stringify(data) }, 
    sendAuthRequest, authResponseSuccess, authResponseFail, 400);
}

export const authenticateSignIn = (email, password) => {
  if (!email || !password) {
    return authFormError('All Fields Required');
  }
  return authenticate('/api/users', { email, password }, 'POST');
}

export const checkTokenAndSignIn = (id, token) => {
  return authenticate('/api/users/from-token', { id, token }, 'POST');
}

export const authenticateSignUp = (email, name, password, companyName) => {
  if (!email || !name || !password) {
    return authFormError('Required fields left blank')
  }
  return authenticate('/api/users/new', { email, name, password, companyName }, 'POST');
}

export const signout = () => {
  return { type: actionTypes.AUTH_SIGNOUT }
}

export const editUser = (id, email, name, companyName) => {
  if (!email || !name) {
    return authFormError('Required fields left blank')
  }
  const body = JSON.stringify({id, email, name, companyName});
  return asyncAction('/api/users/edit', { method: 'PUT', body }, sendAuthRequest, authResponseSuccess, authResponseFail);
}

export const changeRoute = (location, action) => {
  return { type: actionTypes.ROUTE_CHANGE, location, action }
}