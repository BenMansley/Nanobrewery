import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { default as auth } from '../authentication/authentication.reducer';
import { default as customizer } from '../admin/customizer/customizer.reducer';
import { default as shop } from '../admin/shop/shop.reducer';

const reducer = combineReducers({auth, customizer, shop});

const configStore = _ => { 
  let store = createStore(reducer, applyMiddleware(thunk));
  console.log(store.getState());
  return store;
}

const store = configStore();

export default store;