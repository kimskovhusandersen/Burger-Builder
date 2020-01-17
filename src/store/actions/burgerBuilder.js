import * as actionTypes from "./actionTypes";
import axios from "../../axios-order";

export const addIngredient = igType => {
  return {
    type: actionTypes.ADD_INGREDIENT,
    igType
  };
};

export const removeIngredient = igType => {
  return {
    type: actionTypes.REMOVE_INGREDIENT,
    igType
  };
};

const setIngredients = ingredients => {
  return {
    type: actionTypes.SET_INGREDIENTS,
    ingredients
  };
};

const fetchIngredientsFailed = () => {
  return {
    type: actionTypes.FETCH_INGREDIENTS_FAILED
  };
};

export const initIngredients = () => {
  return dispatch => {
    axios
      .get("/ingredients.json")
      .then(data => {
        dispatch(setIngredients(data.data));
      })
      .catch(error => {
        dispatch(fetchIngredientsFailed());
      });
  };
};
