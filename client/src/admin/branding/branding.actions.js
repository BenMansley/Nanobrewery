import asyncAction from "../../utils/async-action";

export const actionTypes = {
  GET_CUSTOMIZATIONS_REQUEST: "GET_CUSTOMIZATIONS_REQUEST",
  GET_CUSTOMIZATIONS_SUCCESS: "GET_CUSTOMIZATIONS_SUCCESS",
  GET_CUSTOMIZATIONS_FAILURE: "GET_CUSTOMIZATIONS_FAILURE",
  NEW_CUSTOMIZATION_REQUEST: "NEW_CUSTOMIZATION_REQUEST",
  NEW_CUSTOMIZATION_SUCCESS: "NEW_CUSTOMIZATION_SUCCESS",
  NEW_CUSTOMIZATION_FAILURE: "NEW_CUSTOMIZATION_FAILURE",
  UPDATE_CUSTOMIZATION_REQUEST: "UPDATE_CUSTOMIZATION_REQUEST",
  UPDATE_CUSTOMIZATION_SUCCESS: "UPDATE_CUSTOMIZATION_SUCCESS",
  UPDATE_CUSTOMIZATION_FAILURE: "UPDATE_CUSTOMIZATION_FAILURE",
  DELETE_CUSTOMIZATION_REQUEST: "DELETE_CUSTOMIZATION_REQUEST",
  DELETE_CUSTOMIZATION_SUCCESS: "DELETE_CUSTOMIZATION_SUCCESS",
  DELETE_CUSTOMIZATION_FAILURE: "DELETE_CUSTOMIZATION_FAILURE"
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

const newCustomizationRequest = _ => {
  return { type: actionTypes.NEW_CUSTOMIZATION_REQUEST };
};

const newCustomizationSuccess = data => {
  return { type: actionTypes.NEW_CUSTOMIZATION_SUCCESS, customizations: data.customizations, id: data.id };
};

const newCustomizationFailure = error => {
  return { type: actionTypes.NEW_CUSTOMIZATION_FAILURE, error };
};

export const newCustomization = (name, description, volume, colour, hoppiness, maltFlavour) => {
  const data = { name, description, volume, colour, hoppiness, maltFlavour };
  return asyncAction("/api/customizer/new", { method: "POST", body: JSON.stringify(data), credentials: "same-origin" },
    newCustomizationRequest, newCustomizationSuccess, newCustomizationFailure);
};

const updateCustomizationRequest = _ => {
  return { type: actionTypes.UPDATE_CUSTOMIZATION_REQUEST };
};

const updateCustomizationSuccess = data => {
  return { type: actionTypes.UPDATE_CUSTOMIZATION_SUCCESS, customizations: data.customizations, id: data.id };
};

const updateCustomizationFailure = error => {
  return { type: actionTypes.UPDATE_CUSTOMIZATION_FAILURE, error };
};

export const updateCustomization = (id, name, description, volume, colour, hoppiness, maltFlavour) => {
  const data = { id, name, description, volume, colour, hoppiness, maltFlavour };
  return asyncAction("/api/customizer/update",
    { method: "POST", body: JSON.stringify(data), credentials: "same-origin" },
    updateCustomizationRequest, updateCustomizationSuccess, updateCustomizationFailure);
};

const deleteCustomizationRequest = _ => {
  return { type: actionTypes.DELETE_CUSTOMIZATION_REQUEST };
};

const deleteCustomizationSuccess = customizations => {
  return { type: actionTypes.DELETE_CUSTOMIZATION_SUCCESS, customizations };
};

const deleteCustomizationFailure = error => {
  return { type: actionTypes.DELETE_CUSTOMIZATION_FAILURE, error };
};

export const deleteCustomization = (id) => {
  const data = { id };
  console.log(data);
  return asyncAction("/api/customizer/delete",
    { method: "DELETE", body: JSON.stringify(data), credentials: "same-origin" },
    deleteCustomizationRequest, deleteCustomizationSuccess, deleteCustomizationFailure);
};
