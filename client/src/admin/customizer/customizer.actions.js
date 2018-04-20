import asyncAction from "../../utils/async-action";

export const actionTypes = {
  GET_VARIABLES_REQUEST: "GET_VARIABLES_REQUEST",
  GET_VARIABLES_SUCCESS: "GET_VARIABLES_SUCCESS",
  GET_VARIABLES_FAILURE: "GET_VARIABLES_FAILURE",
  GET_DATA_REQUEST: "GET_DATA_REQUEST",
  GET_DATA_SUCCESS: "GET_DATA_SUCCESS",
  GET_DATA_FAILURE: "GET_DATA_FAILURE",
  UPDATE_VARIABLE_REQUEST: "UPDATE_VARIABLE_REQUEST",
  UPDATE_VARIABLE_SUCCESS: "UPDATE_VARIABLE_SUCCESS",
  UPDATE_VARIABLE_FAILURE: "UPDATE_VARIABLE_FAILURE"
};

const getVariablesRequest = _ => {
  return { type: actionTypes.GET_VARIABLES_REQUEST };
};

const getVariablesSuccess = variables => {
  return { type: actionTypes.GET_VARIABLES_SUCCESS, variables };
};

const getVariablesFailure = error => {
  return { type: actionTypes.GET_VARIABLES_FAILURE, error };
};

export const getVariables = _ => {
  return asyncAction("/api/customizer/variables", {},
    getVariablesRequest, getVariablesSuccess, getVariablesFailure);
};

const getDataRequest = _ => {
  return { type: actionTypes.GET_DATA_REQUEST };
};

const getDataSuccess = data => {
  return { type: actionTypes.GET_DATA_SUCCESS, data };
};

const getDataFailure = error => {
  return { type: actionTypes.GET_DATA_FAILURE, error };
};

export const getCustomizerData = _ => {
  return asyncAction("/api/customizer/all-data", {}, getDataRequest, getDataSuccess, getDataFailure);
};

const updateVariableRequest = _ => {
  return { type: actionTypes.UPDATE_VARIABLE_REQUEST };
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
    updateVariableRequest, updateVariableSuccess, updateVariableFailure, 500);
};
