import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "./store/actions";
import Layout from "./hoc/Layout/Layout";
import BurgerBuilder from "./containers/BurgerBuilder/BurgerBuilder";

import asyncComponent from "./hoc/asyncComponent/asyncComponent";

const asyncCheckout = asyncComponent(() => {
  return import("./containers/Checkout/Checkout");
});
const asyncOrder = asyncComponent(() => {
  return import("./containers/Orders/Orders");
});
const asyncAuth = asyncComponent(() => {
  return import("./containers/Auth/Auth");
});
const asyncLogout = asyncComponent(() => {
  return import("./containers/Auth/Logout/Logout");
});

class App extends Component {
  componentDidMount() {
    this.props.onTryAuthenticate();
  }

  render() {
    let routes = (
      <Switch>
        <Route exact path="/" component={BurgerBuilder} />
        <Route path="/auth" component={asyncAuth} />
        <Redirect to="/" />
      </Switch>
    );
    if (this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route exact path="/" component={BurgerBuilder} />
          <Route path="/checkout" component={asyncCheckout} />
          <Route path="/orders" component={asyncOrder} />
          <Route path="/logout" component={asyncLogout} />
          <Route path="/auth" component={asyncAuth} />
          <Redirect to="/" />
        </Switch>
      );
    }

    return <Layout>{routes}</Layout>;
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.authReducer.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAuthenticate: () => dispatch(actions.authCheckState())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
