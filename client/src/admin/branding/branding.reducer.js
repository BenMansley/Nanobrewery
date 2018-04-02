import { actionTypes } from "./branding.actions";

const brandingReducer =
  (state = {
    customizations: [],
    error: "",
    isLoading: false },
  action
  ) => {
    switch (action.type) {
      case actionTypes.GET_CUSTOMIZATIONS_REQUEST:
        return Object.assign({}, state, {
          isLoading: true
        });
      case actionTypes.GET_CUSTOMIZATIONS_SUCCESS:
        return Object.assign({}, state, {
          isLoading: false,
          customizations: action.customizations
        });
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
