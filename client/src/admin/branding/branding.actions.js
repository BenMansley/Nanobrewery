import asyncAction from "../../utils/async-action";

export const actionTypes = {
  GET_CUSTOMIZATIONS_REQUEST: "GET_CUSTOMIZATIONS_REQUEST",
  GET_CUSTOMIZATIONS_SUCCESS: "GET_CUSTOMIZATIONS_SUCCESS",
  GET_CUSTOMIZATIONS_FAILURE: "GET_CUSTOMIZATIONS_FAILURE",
  SEND_NEW_CUSTOMIZATION_REQUEST: "SEND_NEW_CUSTOMIZATION_REQUEST",
  NEW_CUSTOMIZATION_SUCCESS: "NEW_CUSTOMIZATION_SUCCESS",
  NEW_CUSTOMIZATION_FAILURE: "NEW_CUSTOMIZATION_FAILURE"
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
