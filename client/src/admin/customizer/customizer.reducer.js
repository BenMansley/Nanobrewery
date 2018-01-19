import { actionTypes } from './customizer.actions';

const customizerReducer = 
  (state = {
    variables: [],
    updateVariableResponse: '',
    error: '',
    isLoading: false },
  action
) => {
  switch(action.type) {
    case actionTypes.SEND_GET_VARIABLE_REQUEST:
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
    case actionTypes.SEND_UPDATE_VARIABLE_REQUEST:
      return Object.assign({}, state, {
        updateVariableResponse: ''
      });
    case actionTypes.UPDATE_VARIABLE_SUCCESS:
      return Object.assign({}, state, {
        updateVariableResponse: 'Update Successful',
        isLoading: false,
      });
    case actionTypes.UPDATE_VARIABLE_FAIL:
      return Object.assign({}, state, {
        updateVariableResponse: action.error,
        isLoading: false
      })
    default:
      return state;
  }
}

export default customizerReducer;