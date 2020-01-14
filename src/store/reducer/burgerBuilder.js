import * as actionTypes from "../actions/actionTypes";
import updateObject from "../utility";

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
};

const initialState = {
  ingredients: null,
  totalPrice: 4,
  error: false
};

const addIngredient = (state, action) => {
  let updatedIngredient = {
    [action.igType]: state.ingredients[action.igType] + 1
  };
  let updatedIngredients = updateObject(state.ingredients, updatedIngredient);
  let updatedState = {
    ingredients: updatedIngredients,
    totalPrice: state.totalPrice + INGREDIENT_PRICES[action.igType]
  };
  return updateObject(state, updatedState);
};

const removeIngredient = (state, action) => {
  let updatedIngredient = {
    [action.igType]: state.ingredients[action.igType] - 1
  };
  let updatedIngredients = updateObject(state.ingredients, updatedIngredient);
  let updatedState = {
    ingredients: updatedIngredients,
    totalPrice: state.totalPrice - INGREDIENT_PRICES[action.igType]
  };
  return updateObject(state, updatedState);
};

const setIngredients = (state, action) => {
  return updateObject(state, {
    ingredients: action.ingredients,
    totalPrice: 4,
    error: false
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_INGREDIENT:
      return addIngredient(state, action);
    case actionTypes.REMOVE_INGREDIENT:
      return removeIngredient(state, action);
    case actionTypes.SET_INGREDIENTS:
      return setIngredients(state, action);
    case actionTypes.FETCH_INGREDIENTS_FAILED:
      return updateObject(state, { error: true });
    default:
      return state;
  }
};

export default reducer;