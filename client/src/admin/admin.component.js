import React from "react";
import { Route, Switch } from "react-router-dom";
import Account from "./user/account.component";
import Welcome from "./user/welcome.component";
import Customizer from "./customizer/customizer.component";
import Dashboard from "./customizer/dashboard.component";
import Branding from "./branding/branding.component";
import Basket from "./shop/basket/basket.component";
import Hardware from "./shop/hardware.component";

const Admin = () => {
  return (
    <Switch>
      <Route exact path="/admin/user/account" component={Account} />
      <Route exact path="/admin/user/welcome" component={Welcome} />
      <Route exact path="/admin/customizer" component={Customizer} />
      <Route exact path="/admin/dashboard" component={Dashboard} />
      <Route exact path="/admin/branding" component={Branding} />
      <Route exact path="/admin/basket" component={Basket} />
      <Route exact path="/admin/shop/hardware" component={Hardware} />
    </Switch>
  );
};

export default Admin;
