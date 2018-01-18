import { actionTypes } from './customizer.actions';

const customizerReducer = 
  (state = {
    variables: [],
    error: '',
    isLoading: false },
  action
) => {
  switch(action.type) {
    case actionTypes.SEND_VARIABLE_REQUEST:
      return Object.assign({}, state, {
        isLoading: true
      });
    case actionTypes.GET_VARIABLES_SUCCESS:
      return Object.assign({}, state, {
        variables: action.variables,
        error: '',
        isLoading: false
      });
    case actionTypes.GET_VARIABLES_FAIL:
      return Object.assign({}, state, {
        error: action.error,
        isLoading: false
      });
    default:
      return state;
  }
}

export default customizerReducer;