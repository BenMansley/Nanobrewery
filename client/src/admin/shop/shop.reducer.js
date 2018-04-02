import { actionTypes } from "./shop.actions";

const shopReducer =
  (state = {
    basketSize: 0,
    basketError: false,
    productsVisible: [],
    productError: null,
    isLoading: false,
    basketItems: []
  },
  action
  ) => {
    switch (action.type) {
      case actionTypes.SEND_GET_BASKET_SIZE_REQUEST:
      case actionTypes.SEND_GET_BASKET_ITEMS_REQUEST:
      case actionTypes.SEND_ADD_TO_BASKET_REQUEST:
      case actionTypes.SEND_UPDATE_QUANTITY_REQUEST:
        return Object.assign({}, state, {
          isLoading: true,
          basketError: ""
        });
      case actionTypes.GET_BASKET_SIZE_SUCCESS:
      case actionTypes.ADD_TO_BASKET_SUCCESS:
        return Object.assign({}, state, {
          isLoading: false,
          basketSize: action.basketSize
        });
      case actionTypes.GET_BASKET_ITEMS_SUCCESS:
      case actionTypes.UPDATE_QUANTITY_SUCCESS:
        return Object.assign({}, state, {
          isLoading: false,
          basketItems: action.items
        });
      case actionTypes.GET_BASKET_SIZE_FAILURE:
      case actionTypes.GET_BASKET_ITEMS_FAILURE:
      case actionTypes.ADD_TO_BASKET_FAILURE:
      case actionTypes.UPDATE_QUANTITY_FAILURE:
        return Object.assign({}, state, {
          isLoading: false,
          basketError: action.error
        });
      case actionTypes.SEND_GET_PRODUCTS_REQUEST:
        return Object.assign({}, state, {
          isLoading: true,
          productError: ""
        });
      case actionTypes.GET_PRODUCTS_SUCCESS:
        return Object.assign({}, state, {
          isLoading: false,
          productsVisible: action.products
        });
      case actionTypes.GET_PRODUCTS_FAILURE:
        return Object.assign({}, state, {
          isLoading: false,
          productError: action.error
        });
      default:
        return state;
    }
  };

export default shopReducer;
