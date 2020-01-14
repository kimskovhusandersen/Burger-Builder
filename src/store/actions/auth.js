import * as actions from "./actionTypes";
import axios from "axios";
import secrets from "../../../secrets.json";

export const authStart = () => {
  return {
    type: actions.AUTH_START
  };
};

export const authSuccess = authData => {
  return {
    type: actions.AUTH_SUCCESS,
    authData
  };
};

export const authFail = error => {
  return {
    type: actions.AUTH_FAIL,
    error
  };
};

export const auth = (email, password) => {
  return dispatch => {
    dispatch(authStart());
    axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${secrets.FIREBASE_API_KEY}`
    );
  };
};
