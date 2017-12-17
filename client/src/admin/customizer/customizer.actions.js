export const actionTypes = {
  SEND_VARIABLES_REQUEST: 'SEND_VARIABLES_REQUEST',
  GET_VARIABLES_SUCCESS: 'GET_VARIABLES_SUCCESS',
  GET_VARIABLES_FAIL: 'GET_VARIABLES_FAIL'
};

const getVariablesSuccess = (variables) => {
  return { type: actionTypes.GET_VARIABLES_SUCCESS, variables }
}

const getVariablesFail = (error) => {
  return { type: actionTypes.GET_VARIABLES_FAIL, error }
} 

const sendVariablesRequest = () => {
  return { type: actionTypes.SEND_VARIABLES_REQUEST }
}

export const getVariables = () => {
  return dispatch => {
    dispatch(sendVariablesRequest());

    const headers = new Headers({'Content-Type': 'application/json'});    
    fetch('/api/customizer/variables', { headers })
      .then(res => {
        res.json().then(data => {
          if (res.status === 500) {
            dispatch(getVariablesFail(data));
          } else if (res.status === 200) {
            dispatch(getVariablesSuccess(data));
          }
        })
        .catch(error => {
          dispatch(getVariablesFail("Error parsing data from server"))
        });
      });
  }
}