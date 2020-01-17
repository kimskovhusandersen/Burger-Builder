import * as actionTypes from "./actionTypes";
import axios from "axios";
console.log(process.env);

const { FIREBASE_API_KEY } =
  process.env.NODE_ENV == "production"
    ? process.env
    : require("../../secrets.json");

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

export const authSuccess = (token, userId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token,
    userId
  };
};

export const authFail = error => {
  return {
    type: actionTypes.AUTH_FAIL,
    error
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expirationTime");
  localStorage.removeItem("userId");
  return {
    type: actionTypes.AUTH_LOGOUT
  };
};

export const checkAuthTimeout = expirationTime => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const auth = (email, password, isSignUp) => {
  return dispatch => {
    dispatch(authStart());
    const authData = {
      email,
      password,
      returnSecureToken: true
    };
    let url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`;
    if (!isSignUp) {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;
    }
    axios
      .post(url, authData)
      .then(({ data }) => {
        localStorage.setItem("token", data.idToken);
        const expirationTime = new Date(
          new Date().getTime() + data.expiresIn * 1000
        );
        localStorage.setItem("expirationTime", expirationTime);
        localStorage.setItem("userId", data.localId);
        dispatch(authSuccess(data.idToken, data.localId));
        dispatch(checkAuthTimeout(data.expiresIn));
      })
      .catch(error => {
        console.log(error.response.data);
        dispatch(authFail(error.response.data.error));
      });
  };
};

export const setAuthRedirectPath = path => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path
  };
};

export const authCheckState = () => {
  return dispatch => {
    try {
      const token = localStorage.getItem("token");
      const expirationTime = new Date(localStorage.getItem("expirationTime"));
      const userId = localStorage.getItem("userId");
      if (expirationTime > new Date()) {
        dispatch(authSuccess(token, userId));
        dispatch(
          checkAuthTimeout(
            (expirationTime.getTime() - new Date().getTime()) / 1000
          )
        );
      } else {
        dispatch(logout());
      }
    } catch (err) {
      dispatch(logout());
    }
  };
};
