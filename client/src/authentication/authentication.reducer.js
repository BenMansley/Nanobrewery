import { actionTypes } from "./authentication.actions";

const authenticationReducer =
  (state = {
    isLoading: false,
    error: "",
    redirect: false,
    signUpSuccess: true,
    isLoggedIn: false,
    userDetails: {
      email: "",
      name: "",
      companyName: ""
    }
  },
  action
  ) => {
    switch (action.type) {
      case actionTypes.SEND_AUTH_REQUEST:
        return Object.assign({}, state, {
          isLoading: true,
        });
      case actionTypes.SIGN_UP_SUCCESS:
        return Object.assign({}, state, {
          isLoading: false,
          signUpSuccess: true,
          error: ""
        });
      case actionTypes.COOKIE_SIGN_IN_SUCCESS:
      case actionTypes.SIGN_IN_SUCCESS:
        return Object.assign({}, state, {
          isLoggedIn: true,
          error: "",
          redirect: true
        });
      case actionTypes.EDIT_USER_SUCCESS:
      case actionTypes.GET_USER_DETAILS_SUCCESS:
        return Object.assign({}, state, {
          isLoading: false,
          error: "",
          userDetails: action.user
        });
      case actionTypes.AUTH_RESPONSE_FAILURE:
        return Object.assign({}, state, {
          isLoading: false,
          error: action.error,
          redirect: false
        });
      case actionTypes.AUTH_FORM_ERROR:
        return Object.assign({}, state, {
          error: action.error
        });
      case actionTypes.AUTH_SIGNOUT:
        return Object.assign({}, state, {
          userDetails: {},
          isLoggedIn: false,
          redirect: false,
        });
      case actionTypes.ROUTE_CHANGE:
        return Object.assign({}, state, {
          error: ""
        });
      default:
        return state;
    }
  };

export default authenticationReducer;
