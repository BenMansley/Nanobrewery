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
      case actionTypes.SEND_NEW_CUSTOMIZATION_REQUEST:
      case actionTypes.GET_CUSTOMIZATIONS_REQUEST:
        return Object.assign({}, state, {
          isLoading: true
        });
      case actionTypes.NEW_CUSTOMIZATION_SUCCESS:
        return Object.assign({}, state, {
          newCustomizationId: action.customizationId,
          error: "",
          isLoading: false
        });
      case actionTypes.GET_CUSTOMIZATIONS_SUCCESS:
        return Object.assign({}, state, {
          isLoading: false,
          customizations: action.customizations
        });
      case actionTypes.NEW_CUSTOMIZATION_FAILURE:
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
