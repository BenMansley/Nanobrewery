import { actionTypes } from "./customizer.actions";

const customizerReducer =
  (state = {
    variables: [],
    templates: [],
    updateVariableResponse: "",
    newCustomizationId: 0,
    error: "",
    isLoading: false },
  action
  ) => {
    switch (action.type) {
      case actionTypes.SEND_NEW_CUSTOMIZATION_REQUEST:
      case actionTypes.SEND_GET_DATA_REQUEST:
      case actionTypes.SEND_GET_VARIABLES_REQUEST:
        return Object.assign({}, state, {
          isLoading: true
        });
      case actionTypes.NEW_CUSTOMIZATION_SUCCESS:
        return Object.assign({}, state, {
          newCustomizationId: action.customizationId,
          error: "",
          isLoading: false
        });
      case actionTypes.GET_DATA_SUCCESS:
        return Object.assign({}, state, {
          variables: action.data.variables,
          templates: action.data.templates,
          error: "",
          isLoading: false
        });
      case actionTypes.GET_VARIABLES_SUCCESS:
        return Object.assign({}, state, {
          variables: action.variables,
          error: "",
          isLoading: false,
          updateVariableResponse: ""
        });
      case actionTypes.NEW_CUSTOMIZATION_FAILURE:
      case actionTypes.GET_DATA_FAILURE:
      case actionTypes.GET_VARIABLES_FAILURE:
        return Object.assign({}, state, {
          error: action.error,
          isLoading: false
        });
      case actionTypes.SEND_UPDATE_VARIABLE_REQUEST:
        return Object.assign({}, state, {
          updateVariableResponse: ""
        });
      case actionTypes.UPDATE_VARIABLE_SUCCESS:
        return Object.assign({}, state, {
          updateVariableResponse: "Update Successful",
          isLoading: false,
        });
      case actionTypes.UPDATE_VARIABLE_FAILURE:
        return Object.assign({}, state, {
          updateVariableResponse: action.error,
          isLoading: false
        });
      default:
        return state;
    }
  };

export default customizerReducer;
