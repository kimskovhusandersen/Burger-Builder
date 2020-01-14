import React, { Component } from "react";
import axios from "../../axios-order.js";
import withErrorHandler from "../../hoc/Layout/withErrorHandler/withErrorHandler.js";
import Order from "./../../components/Order/Order";
import Spinner from "../../components/UI/Spinner/Spinner";
import * as actionCreators from "../../store/actions/index";
import classes from "./Orders.module.css";
import { connect } from "react-redux";

class Orders extends Component {
  componentDidMount() {
    this.props.onFetchOrders();
  }

  render() {
    let orders = <Spinner />;
    if (!this.props.loading) {
      orders = this.props.orders.map(order => (
        <Order
          key={order.id}
          ingredients={order.ingredients}
          price={order.price}
        />
      ));
    }

    return (
      <div className={classes.Orders}>
        <h4>Your Orders</h4>
        {orders}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    orders: state.orderReducer.orders
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchOrders: () => dispatch(actionCreators.fetchOrders())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(Orders, axios));
