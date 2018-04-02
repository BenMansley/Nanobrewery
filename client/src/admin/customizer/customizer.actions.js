import asyncAction from "../../utils/async-action";

export const actionTypes = {
  SEND_GET_VARIABLES_REQUEST: "SEND_GET_VARIABLES_REQUEST",
  GET_VARIABLES_SUCCESS: "GET_VARIABLES_SUCCESS",
  GET_VARIABLES_FAILURE: "GET_VARIABLES_FAILURE",
  SEND_GET_DATA_REQUEST: "SEND_GET_DATA_REQUEST",
  GET_DATA_SUCCESS: "GET_DATA_SUCCESS",
  GET_DATA_FAILURE: "GET_DATA_FAILURE",
  SEND_UPDATE_VARIABLE_REQUEST: "SEND_UPDATE_VARIABLE_REQUEST",
  UPDATE_VARIABLE_SUCCESS: "UPDATE_VARIABLE_SUCCESS",
  UPDATE_VARIABLE_FAILURE: "UPDATE_VARIABLE_FAILURE",
  SEND_NEW_CUSTOMIZATION_REQUEST: "SEND_NEW_CUSTOMIZATION_REQUEST",
  NEW_CUSTOMIZATION_SUCCESS: "NEW_CUSTOMIZATION_SUCCESS",
  NEW_CUSTOMIZATION_FAILURE: "NEW_CUSTOMIZATION_FAILURE"
};

const sendGetVariablesRequest = _ => {
  return { type: actionTypes.SEND_GET_VARIABLES_REQUEST };
};

const getVariablesSuccess = variables => {
  return { type: actionTypes.GET_VARIABLES_SUCCESS, variables };
};

const getVariablesFailure = error => {
  return { type: actionTypes.GET_VARIABLES_FAILURE, error };
};

export const getVariables = _ => {
  return asyncAction("/api/customizer/variables", {},
    sendGetVariablesRequest, getVariablesSuccess, getVariablesFailure);
};

const sendGetDataRequest = _ => {
  return { type: actionTypes.SEND_GET_DATA_REQUEST };
};

const getDataSuccess = data => {
  return { type: actionTypes.GET_DATA_SUCCESS, data };
};

const getDataFailure = error => {
  return { type: actionTypes.GET_DATA_FAILURE, error };
};

export const getCustomizerData = _ => {
  return asyncAction("/api/customizer/all-data", {}, sendGetDataRequest, getDataSuccess, getDataFailure);
};

const sendUpdateVariableRequest = _ => {
  return { type: actionTypes.SEND_UPDATE_VARIABLE_REQUEST };
};

const updateVariableSuccess = data => {
  return { type: actionTypes.UPDATE_VARIABLE_SUCCESS };
};

const updateVariableFailure = error => {
  return { type: actionTypes.UPDATE_VARIABLE_FAILURE, error };
};

export const updateVariable = (id, name, min, max, step, defaultVal, suffix) => {
  const data = { id, name, min, max, step, defaultVal, suffix };
  return asyncAction("/api/customizer/edit-variable", { method: "PUT", body: JSON.stringify(data) },
    sendUpdateVariableRequest, updateVariableSuccess, updateVariableFailure, 500);
};

const sendNewCustomizationRequest = _ => {
  return { type: actionTypes.SEND_NEW_CUSTOMIZATION_REQUEST };
};

const newCustomizationSuccess = customizationId => {
  return { type: actionTypes.NEW_CUSTOMIZATION_SUCCESS, customizationId };
};

const newCustomizationFailure = error => {
  return { type: actionTypes.NEW_CUSTOMIZATION_FAILURE, error };
};

export const newCustomization = (name, description, volume, colour, hoppiness, maltFlavour) => {
  const data = { name, description, volume, colour, hoppiness, maltFlavour };
  return asyncAction("/api/customizer/new", { method: "POST", body: JSON.stringify(data), credentials: "same-origin" },
    sendNewCustomizationRequest, newCustomizationSuccess, newCustomizationFailure);
};
