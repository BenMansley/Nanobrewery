import { actionTypes } from './shop.actions';

const shopReducer = 
  (state = {
    basket: [{
      name: 'Beer',
      quantity: 1,
      price: 29.99
    }]
  },
  action
) => {
  switch (action.type) {
    case actionTypes.ADDED_TO_BASKET:
      return Object.assign({}, state, {
        basket: state.basket.push(action.items)
      });
    default:
     return state;
  }
}

export default shopReducer;