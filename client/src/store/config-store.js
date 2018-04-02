import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { default as auth } from '../authentication/authentication.reducer';
import { default as customizer } from '../admin/customizer/customizer.reducer';
import { default as shop } from '../admin/shop/shop.reducer';
import { default as branding } from '../admin/branding/branding.reducer';

const reducer = combineReducers({auth, customizer, shop, branding});

const configStore = _ => { 
  const store = createStore(reducer, applyMiddleware(thunk));
  return store;
}

export default configStore();