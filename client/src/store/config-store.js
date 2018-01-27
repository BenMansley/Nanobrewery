import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import { default as auth } from '../authentication/authentication.reducer';
import { default as customizer } from '../admin/customizer/customizer.reducer';
import { default as shop } from '../admin/shop/shop.reducer';

const config = {
  key: 'root',
  storage
};

const reducer = persistCombineReducers(config, {auth, customizer, shop});

const rootReducer = (state, action) => {
  if (action.type === 'CLEAR') {
    state = undefined;
  }

  return reducer(state, action);
}

const configureStore = preloadedState => {
  let store = createStore(rootReducer, preloadedState, applyMiddleware(thunk));
  let persistor = persistStore(store);
  return {persistor, store}
}

export default configureStore;