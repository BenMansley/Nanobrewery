import { actionTypes } from './shop.actions';

const shopReducer = 
  (state = {
    basket: [{
      name: 'Beer',
      quantity: 1,
      price: 29.99
    }],
    productsVisible: [],
    error: null,
    isLoading: false,
  },
  action
) => {
  switch (action.type) {
    case actionTypes.ADDED_TO_BASKET:
      return Object.assign({}, state, {
        basket: state.basket.push(action.items)
      });
    case actionTypes.SEND_GET_PRODUCTS_REQUEST:
      return Object.assign({}, state, {
        isLoading: true
      });
    case actionTypes.GET_PRODUCTS_SUCCESS:
      return Object.assign({}, state, {
        isLoading: false,
        productsVisible: action.products
      });
    case actionTypes.GET_PRODUCTS_FAILURE:
      return Object.assign({}, state, {
        isLoading: false,
        error: action.error
      });
    default:
     return state;
  }
}

export default shopReducer;