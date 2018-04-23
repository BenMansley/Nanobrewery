import { actionTypes } from "./branding.actions";

const brandingReducer =
  (state = {
    customizations: [],
    newCustomizationId: undefined,
    error: "",
    isLoading: false },
  action
  ) => {
    switch (action.type) {
      case actionTypes.NEW_CUSTOMIZATION_REQUEST:
      case actionTypes.UPDATE_CUSTOMIZATION_REQUEST:
      case actionTypes.DELETE_CUSTOMIZATION_REQUEST:
      case actionTypes.GET_CUSTOMIZATIONS_REQUEST:
        return Object.assign({}, state, {
          isLoading: true,
          error: ""
        });
      case actionTypes.UPDATE_CUSTOMIZATION_SUCCESS:
      case actionTypes.NEW_CUSTOMIZATION_SUCCESS:
        return Object.assign({}, state, {
          customizations: action.customizations,
          newCustomizationId: action.id,
          error: "",
          isLoading: false
        });
      case actionTypes.DELETE_CUSTOMIZATION_SUCCESS:
      case actionTypes.GET_CUSTOMIZATIONS_SUCCESS:
        return Object.assign({}, state, {
          customizations: action.customizations,
          isLoading: false,
          error: ""
        });
      case actionTypes.NEW_CUSTOMIZATION_FAILURE:
      case actionTypes.UPDATE_CUSTOMIZATION_FAILURE:
      case actionTypes.DELETE_CUSTOMIZATION_FAILURE:
      case actionTypes.GET_CUSTOMIZATIONS_FAILURE:
        return Object.assign({}, state, {
          isLoading: false,
          error: action.error
        });
      default:
        return state;
    }
  };

export default brandingReducer;
