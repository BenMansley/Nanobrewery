import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import { default as auth } from '../authentication/authentication.reducer';

const config = {
  key: 'root',
  storage
};

const reducer = persistCombineReducers(config, {auth});

const configureStore = preloadedState => {
  let store = createStore(reducer, preloadedState, applyMiddleware(thunk));
  let persistor = persistStore(store);
  return {persistor, store}
}

export default configureStore;