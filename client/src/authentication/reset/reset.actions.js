import asyncAction from "../../utils/async-action";

export const actionTypes = {
  REQUEST_REQUEST: "REQUEST_REQUEST",
  REQUEST_SUCCESS: "REQUEST_SUCCESS",
  REQUEST_FAILURE: "REQUEST_FAILURE",
  RESET_REQUEST: "RESET_REQUEST",
  RESET_SUCCESS: "RESET_SUCCESS",
  RESET_FAILURE: "RESET_FAILURE"
};

const sendRequestRequest = _ => {
  return { type: actionTypes.REQUEST_REQUEST };
};

const requestFailure = error => {
  return { type: actionTypes.REQUEST_FAILURE, error };
};

const requestSuccess = _ => {
  return { type: actionTypes.REQUEST_SUCCESS };
};

export const requestResetPassword = email => {
  const body = JSON.stringify({ email });
  return asyncAction("/api/users/send-reset", { method: "POST", body },
    sendRequestRequest, requestSuccess, requestFailure);
};

const sendResetRequest = _ => {
  return { type: actionTypes.REQUEST_REQUEST };
};

const resetFailure = error => {
  return { type: actionTypes.RESET_FAILURE, error };
};

const resetSuccess = _ => {
  return { type: actionTypes.RESET_SUCCESS };
};

export const resetPassword = (token, password) => {
  const body = JSON.stringify({ password });
  return asyncAction(`/api/users/reset${token}`, { method: "POST", body },
    sendResetRequest, resetSuccess, resetFailure);
};
