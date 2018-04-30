import { actionTypes } from "./reset.actions";

const resetReducer =
  (state = {
    isLoading: false,
    requestError: "",
    requestSuccess: false,
    resetError: "",
    resetSuccess: false
  },
  action
  ) => {
    switch (action.type) {
      case actionTypes.REQUEST_REQUEST:
        return Object.assign({}, state, {
          isLoading: true,
          requestError: "",
          requestSuccess: false
        });
      case actionTypes.REQUEST_SUCCESS:
        return Object.assign({}, state, {
          isLoading: false,
          requestError: "",
          requestSuccess: true
        });
      case actionTypes.REQUEST_FAILURE:
        return Object.assign({}, state, {
          isLoading: false,
          requestError: action.error,
          requestSuccess: false
        });
      case actionTypes.RESET_REQUEST:
        return Object.assign({}, state, {
          isLoading: true,
          resetError: "",
          resetSuccess: false
        });
      case actionTypes.RESET_SUCCESS:
        return Object.assign({}, state, {
          isLoading: false,
          resetError: "",
          resetSuccess: true
        });
      case actionTypes.RESET_FAILURE:
        return Object.assign({}, state, {
          isLoading: false,
          resetError: action.error,
          resetSuccess: false
        });
      default:
        return state;
    }
  };

export default resetReducer;
