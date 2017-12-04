import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './app.component';
import configureStore from './store/config-store';
import { PersistGate } from 'redux-persist/es/integration/react'; 
import registerServiceWorker from './registerServiceWorker';

import './index.css';

const { persistor, store } = configureStore();

const appShell = (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <Router>
        <App/>
      </Router>
    </PersistGate>
  </Provider>
);

ReactDOM.render(appShell, document.getElementById('root'));
registerServiceWorker();

export default appShell;