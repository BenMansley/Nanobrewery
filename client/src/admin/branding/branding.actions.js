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
  EDIT_CUSTOMIZATION_DETAILS_REQUEST: "EDIT_CUSTOMIZATION_DETAILS_REQUEST",
  EDIT_CUSTOMIZATION_DETAILS_SUCCESS: "EDIT_CUSTOMIZATION_DETAILS_SUCCESS",
  EDIT_CUSTOMIZATION_DETAILS_FAILURE: "EDIT_CUSTOMIZATION_DETAILS_FAILURE",
  EDIT_CUSTOMIZATION_IMAGE_REQUEST: "EDIT_CUSTOMIZATION_IMAGE_REQUEST",
  EDIT_CUSTOMIZATION_IMAGE_SUCCESS: "EDIT_CUSTOMIZATION_IMAGE_SUCCESS",
  EDIT_CUSTOMIZATION_IMAGE_FAILURE: "EDIT_CUSTOMIZATION_IMAGE_FAILURE",
  DELETE_CUSTOMIZATION_REQUEST: "DELETE_CUSTOMIZATION_REQUEST",
  DELETE_CUSTOMIZATION_SUCCESS: "DELETE_CUSTOMIZATION_SUCCESS",
  DELETE_CUSTOMIZATION_FAILURE: "DELETE_CUSTOMIZATION_FAILURE",
  RESET_BEER_ERRORS: "RESET_BEER_ERRORS"
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

export const updateCustomization = (name, description, volume, colour, hoppiness, maltFlavour) => {
  const data = { name, description, volume, colour, hoppiness, maltFlavour };
  return asyncAction("/api/customizer/update",
    { method: "PUT", body: JSON.stringify(data), credentials: "same-origin" },
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

const editCustomizationDetailsRequest = _ => {
  return { type: actionTypes.EDIT_CUSTOMIZATION_DETAILS_REQUEST };
};

const editCustomizationDetailsSuccess = customizations => {
  return { type: actionTypes.EDIT_CUSTOMIZATION_DETAILS_SUCCESS, customizations };
};

const editCustomizationDetailsFailure = error => {
  return { type: actionTypes.EDIT_CUSTOMIZATION_DETAILS_FAILURE, error };
};

export const editCustomizationDetails = (name, description, id) => {
  const data = { name, description, id };
  return asyncAction("/api/customizer/edit-details",
    { method: "PUT", body: JSON.stringify(data), credentials: "same-origin" },
    editCustomizationDetailsRequest, editCustomizationDetailsSuccess, editCustomizationDetailsFailure);
};

const editCustomizationImageRequest = _ => {
  return { type: actionTypes.EDIT_CUSTOMIZATION_IMAGE_REQUEST };
};

const editCustomizationImageSuccess = customizations => {
  return { type: actionTypes.EDIT_CUSTOMIZATION_IMAGE_SUCCESS, customizations };
};

const editCustomizationImageFailure = error => {
  return { type: actionTypes.EDIT_CUSTOMIZATION_IMAGE_FAILURE, error };
};

export const editCustomizationImage = (imageType, customImage, id) => {
  const data = { imageType, customImage, id };
  return asyncAction("/api/customizer/edit-image",
    { method: "PUT", body: JSON.stringify(data), credentials: "same-origin" },
    editCustomizationImageRequest, editCustomizationImageSuccess, editCustomizationImageFailure);
};

export const resetBeerErrors = _ => {
  return { type: actionTypes.RESET_BEER_ERRORS };
};
