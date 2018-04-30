import { actionTypes } from "./branding.actions";

const brandingReducer =
  (state = {
    customizations: [],
    newCustomizationId: undefined,
    error: "",
    isLoading: false,
    editError: "",
    isLoadingEdits: false
  },
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
      case actionTypes.EDIT_CUSTOMIZATION_DETAILS_REQUEST:
        return Object.assign({}, state, {
          isLoadingEdits: true,
          editError: ""
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
      case actionTypes.EDIT_CUSTOMIZATION_DETAILS_SUCCESS:
        return Object.assign({}, state, {
          customizations: action.customizations,
          isLoadingEdits: false,
          editError: ""
        });
      case actionTypes.NEW_CUSTOMIZATION_FAILURE:
      case actionTypes.UPDATE_CUSTOMIZATION_FAILURE:
      case actionTypes.DELETE_CUSTOMIZATION_FAILURE:
      case actionTypes.GET_CUSTOMIZATIONS_FAILURE:
        return Object.assign({}, state, {
          isLoading: false,
          error: action.error
        });
      case actionTypes.EDIT_CUSTOMIZATION_DETAILS_FAILURE:
        return Object.assign({}, state, {
          isLoadingEdits: false,
          editError: action.error
        });
      case actionTypes.RESET_BEER_ERRORS:
        return Object.assign({}, state, {
          error: "",
          newCustomizationId: undefined
        });
      default:
        return state;
    }
  };

export default brandingReducer;
