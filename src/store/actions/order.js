import * as actionTypes from "./actionTypes";
import axios from "../../axios-order";

const purchaseBurgerSuccess = (id, order) => {
  return {
    type: actionTypes.PURCHASE_BURGER_SUCCESS,
    id,
    order
  };
};

const purchaseBurgerFail = error => {
  return {
    type: actionTypes.PURCHASE_BURGER_FAIL,
    error
  };
};

const purchaseBurgerStart = () => {
  return {
    type: actionTypes.PURCHASE_BURGER_START
  };
};

export const purchaseBurger = (order, token) => {
  return dispatch => {
    dispatch(purchaseBurgerStart());
    axios
      .post(`/orders.json?auth=${token}`, order)
      .then(({ data }) => {
        dispatch(purchaseBurgerSuccess(data.name, order)); //data.name holds the id of the order
      })
      .catch(error => {
        dispatch(purchaseBurgerFail(error));
      });
  };
};

export const purchaseInit = () => {
  return {
    type: actionTypes.PURCHASE_INIT
  };
};

const fetchOrdersSuccess = orders => {
  return {
    type: actionTypes.FETCH_ORDERS_SUCCESS,
    orders
  };
};

const fetchOrdersFail = error => {
  return {
    type: actionTypes.FETCH_ORDERS_FAIL,
    error
  };
};

const fetchOrdersStart = () => {
  return {
    type: actionTypes.FETCH_ORDERS_START
  };
};

export const fetchOrders = (token, userId) => {
  return dispatch => {
    dispatch(fetchOrdersStart());
    const queryParams = `auth=${token}&orderBy="userId"&equalTo="${userId}"`;
    axios
      .get(`/orders.json?${queryParams}`)
      .then(({ data }) => {
        const fetchedOrders = [];
        for (let key in data) {
          fetchedOrders.push({ ...data[key], id: key });
        }
        dispatch(fetchOrdersSuccess(fetchedOrders));
      })
      .catch(error => {
        dispatch(fetchOrdersFail(error));
      });
  };
};
