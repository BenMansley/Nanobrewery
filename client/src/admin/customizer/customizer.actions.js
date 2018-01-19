import asyncAction from '../../utils/async-action'; 

export const actionTypes = {
  SEND_GET_VARIABLE_REQUEST: 'SEND_GET_VARIABLE_REQUEST',
  GET_VARIABLES_SUCCESS: 'GET_VARIABLES_SUCCESS',
  GET_VARIABLES_FAIL: 'GET_VARIABLES_FAIL',
  SEND_UPDATE_VARIABLE_REQUEST: 'SEND_UPDATE_VARIABLE_REQUEST',  
  UPDATE_VARIABLE_SUCCESS: 'UPDATE_VARIABLE_SUCCESS',
  UPDATE_VARIABLE_FAIL: 'UPDATE_VARIABLE_FAIL'
};

const getVariablesSuccess = (variables) => {
  return { type: actionTypes.GET_VARIABLES_SUCCESS, variables }
}

const getVariablesFail = (error) => {
  return { type: actionTypes.GET_VARIABLES_FAIL, error }
} 

const sendGetVariableRequest = () => {
  return { type: actionTypes.SEND_GET_VARIABLE_REQUEST }
}

export const getVariables = () => {
  return asyncAction('/api/customizer/variables', {}, sendGetVariableRequest, getVariablesSuccess, getVariablesFail, 500);
}

const updateVariableSuccess = (data) => {
  return { type: actionTypes.UPDATE_VARIABLE_SUCCESS }  
}

const updateVariableFail = (error) => {
  return { type: actionTypes.UPDATE_VARIABLE_FAIL, error }    
}

const sendUpdateVariableRequest = () => {
  return { type: actionTypes.SEND_UPDATE_VARIABLE_REQUEST }
}

export const updateVariable = (id, name, min, max, step, defaultVal, suffix) => {
  const data = { id, name, min, max, step, defaultVal, suffix };
  console.log(data);
  return asyncAction('/api/customizer/variables', { method: 'POST', body: JSON.stringify(data) }, 
    sendUpdateVariableRequest, updateVariableSuccess, updateVariableFail, 500);
}