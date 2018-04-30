import asyncAction from "../utils/async-action";

export const actionTypes = {
  SEND_AUTH_REQUEST: "SEND_AUTH_REQUEST",
  SIGN_UP_SUCCESS: "SIGN_UP_SUCCESS",
  SIGN_IN_SUCCESS: "SIGN_IN_SUCCESS",
  COOKIE_SIGN_IN_SUCCESS: "COOKIE_SIGN_IN_SUCCESS",
  AUTH_RESPONSE_FAILURE: "AUTH_RESPONSE_FAILURE",
  AUTH_FORM_ERROR: "AUTH_FORM_ERROR",
  AUTH_SIGNOUT: "AUTH_SIGNOUT",
  ROUTE_CHANGE: "ROUTE_CHANGE",
  GET_USER_DETAILS_SUCCESS: "GET_USER_DETAILS_SUCCESS",
  EDIT_USER_SUCCESS: "EDIT_USER_SUCCESS",
  VERIFY_SUCCESS: "VERIFY_SUCCESS",
  VERIFY_FAILURE: "VERIFY_FAILURE",
  REVERIFY_SUCCESS: "REVERIFY_SUCCESS",
  REVERIFY_FAILURE: "REVERIFY_FAILURE"
};

const sendAuthRequest = () => {
  return { type: actionTypes.SEND_AUTH_REQUEST };
};

const signInSuccess = message => {
  return { type: actionTypes.SIGN_IN_SUCCESS };
};

const authResponseFailure = (error) => {
  return { type: actionTypes.AUTH_RESPONSE_FAILURE, error };
};

export const authFormError = (error) => {
  return { type: actionTypes.AUTH_FORM_ERROR, error };
};

const signUpSuccess = message => {
  return { type: actionTypes.SIGN_UP_SUCCESS };
};

export const authenticateSignUp = (email, name, password, confirmation, dob, companyName) => {
  if (!email || !name || !password || !dob) {
    return authFormError("Required fields left blank");
  }
  if (password !== confirmation) {
    return authFormError("Passwords must match");
  }
  const data = { email, name, password, dob, companyName };
  return asyncAction("/api/users/new", { method: "POST", body: JSON.stringify(data) },
    sendAuthRequest, signUpSuccess, authResponseFailure);
};

export const authenticateSignIn = (email, password) => {
  if (!email || !password) {
    return authFormError("All Fields Required");
  }
  const data = { email, password };
  return asyncAction("/api/users/login", { method: "POST", body: JSON.stringify(data), credentials: "same-origin" },
    sendAuthRequest, signInSuccess, authResponseFailure);
};

const cookieSignInSuccess = _ => {
  return { type: actionTypes.COOKIE_SIGN_IN_SUCCESS };
};

export const getSessionFromCookie = _ => {
  return asyncAction("/api/users/from-cookie", { method: "GET", credentials: "same-origin" },
    sendAuthRequest, cookieSignInSuccess, authResponseFailure);
};

const signOutSuccess = _ => {
  return { type: actionTypes.AUTH_SIGNOUT };
};

export const signout = () => {
  return asyncAction("/api/users/signout", { method: "GET", credentials: "same-origin" },
    sendAuthRequest, signOutSuccess, authResponseFailure);
};

const getUserDetailsSuccess = user => {
  return { type: actionTypes.GET_USER_DETAILS_SUCCESS, user };
};

export const getUserDetails = _ => {
  return asyncAction("/api/users/details", { method: "GET", credentials: "same-origin" },
    sendAuthRequest, getUserDetailsSuccess, authResponseFailure);
};

const editUserSuccess = user => {
  return { type: actionTypes.EDIT_USER_SUCCESS, user };
};

export const editUser = (email, name, companyName) => {
  if (!email || !name) {
    return authFormError("Required fields left blank");
  }
  const body = JSON.stringify({ email, name, companyName });
  return asyncAction("/api/users/edit", { method: "PUT", body, credentials: "same-origin" },
    sendAuthRequest, editUserSuccess, authResponseFailure);
};

export const changeRoute = (location, action) => {
  return { type: actionTypes.ROUTE_CHANGE, location, action };
};

const verifySuccess = _ => {
  return { type: actionTypes.VERIFY_SUCCESS };
};

const verifyFailure = error => {
  return { type: actionTypes.VERIFY_FAILURE, error };
};

const reverifySuccess = _ => {
  return { type: actionTypes.REVERIFY_SUCCESS };
};

const reverifyFailure = error => {
  return { type: actionTypes.REVERIFY_FAILURE, error };
};

export const verifyUser = token => {
  return asyncAction(`/api/users/verify${token}`, { method: "GET" },
    sendAuthRequest, verifySuccess, verifyFailure);
};

export const reverifyUser = token => {
  return asyncAction(`/api/users/reverify${token}`, { method: "GET" },
    sendAuthRequest, reverifySuccess, reverifyFailure);
};
