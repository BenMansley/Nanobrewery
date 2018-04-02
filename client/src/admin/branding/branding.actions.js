import asyncAction from "../../utils/async-action";

export const actionTypes = {
  GET_CUSTOMIZATIONS_REQUEST: "GET_CUSTOMIZATIONS_REQUEST",
  GET_CUSTOMIZATIONS_SUCCESS: "GET_CUSTOMIZATIONS_SUCCESS",
  GET_CUSTOMIZATIONS_FAILURE: "GET_CUSTOMIZATIONS_FAILURE"
};

const getCustomizationsRequest = _ => {
  return { type: actionTypes.GET_CUSTOMIZATIONS_REQUEST };
};

const getCustomizationsSuccess = customizations => {
  return { type: actionTypes.GET_CUSTOMIZATIONS_SUCCESS, customizations };
};

const getCustomizationsFailure = error => {
  return { type: actionTypes.GET_CUSTOMIZATIONS_FAILURE, error };
};

export const getCustomizations = _ => {
  return asyncAction("/api/customizer/customizations", { method: "GET", credentials: "same-origin" },
    getCustomizationsRequest, getCustomizationsSuccess, getCustomizationsFailure);
};
