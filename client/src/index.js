import React from "react";
import ReactDOM from "react-dom";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./app.component";
import store from "./store/config-store";

import "./index.css";

const AppShell = (
  <CookiesProvider>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </CookiesProvider>
);

ReactDOM.render(AppShell, document.getElementById("root"));

export default AppShell;
