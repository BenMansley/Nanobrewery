import { actionTypes } from "./branding.actions";

const brandingReducer =
  (state = {
    beer: {},
    error: '',
    isLoading: false },
  action
) => {
  switch (action.type) {
    case actionTypes.GET_CUSTOMIZATION_REQUEST:
      return Object.assign({}, state, {
        isLoading: true
      });
    case actionTypes.GET_CUSTOMIZATION_SUCCESS:
      console.log(action.beer);
      return Object.assign({}, state, {
        isLoading: false,
        beer: action.beer
      });
    case actionTypes.GET_CUSTOMIZATION_FAILURE:
      return Object.assign({}, state, {
        isLoading: false,
        error: action.error
      });
    default:
      return state;
  }
}

export default brandingReducer