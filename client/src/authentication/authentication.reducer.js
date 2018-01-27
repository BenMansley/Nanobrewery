import { actionTypes } from './authentication.actions';

const authenticationReducer = 
  (state = { 
    isLoading: false, 
    user: {},
    error: '',
    redirect: false },
  action
) => {
  switch (action.type) {
    case actionTypes.SEND_AUTH_REQUEST:
      return Object.assign({}, state, {
        isLoading: true,
      });
    case actionTypes.AUTH_RESPONSE_SUCCESS:
      return Object.assign({}, state, {
        isLoading: false,
        user: action.user,
        redirect: true,
        error: ''
      });
    case actionTypes.AUTH_RESPONSE_FAIL:
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
        user: {},
        redirect: false,
      });
    case actionTypes.ROUTE_CHANGE:
      return Object.assign({}, state, {
        error: ''
      });
    default:
      return state;
  }
}

export default authenticationReducer

