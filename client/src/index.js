import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './app.component';
import store from './store/config-store';
import registerServiceWorker from './registerServiceWorker';

import './index.css';

console.log(store);

const AppShell = (
  <Provider store={store}>
    <Router>
      <App/>
    </Router>
  </Provider>
);

ReactDOM.render(AppShell, document.getElementById('root'));
registerServiceWorker();

export default AppShell;