import asyncAction from "../../utils/async-action";

export const actionTypes = {
  GET_CUSTOMIZATION_REQUEST: 'GET_CUSTOMIZATION_REQUEST',
  GET_CUSTOMIZATION_SUCCESS: 'GET_CUSTOMIZATION_SUCCESS',
  GET_CUSTOMIZATION_FAILURE: 'GET_CUSTOMIZATION_FAILURE'
}

const getCustomizationRequest = _ => {
  return { type: actionTypes.GET_CUSTOMIZATION_REQUEST }
}

const getCustomizationSuccess = beer => {
  return { type: actionTypes.GET_CUSTOMIZATION_SUCCESS, beer }
}

const getCustomizationFailure = error => {
  return { type: actionTypes.GET_CUSTOMIZATION_FAILURE, error }
}

export const getCustomization = id => {
  return asyncAction('/api/customizer/id/324', {}, getCustomizationRequest, getCustomizationSuccess, getCustomizationFailure);
}