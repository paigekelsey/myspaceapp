import { ADD_TO_CART } from "../actionCreators/shoppingCart";
import { REMOVE_FROM_CART } from "../actionCreators/shoppingCart";
import { INCREASE_QUANTITY } from "../actionCreators/shoppingCart";
import { DECREASE_QUANTITY } from "../actionCreators/shoppingCart";
import { EMPTY_CART } from "../actionCreators/shoppingCart";

// const initialCart = {
//     item: null,
//     quantity: 0,
// };

const initialCart = {
  cart: [],
  total: 0,
};

export const cartReducer = (state = initialCart, action) => {
  if (action.type === ADD_TO_CART) {
    let tempTotal = 0;
    action.payload.forEach((product) => {
      tempTotal += product.price * product.quantity;
    });

    return {
      ...state,
      cart: [...state.cart, action.payload],
      total: tempTotal,
    };
  } else if (action.type === REMOVE_FROM_CART) {
    let tempTotal = 0;
    action.payload.forEach((product) => {
      tempTotal += product.price * product.quantity;
    });
    return {
      ...state,
      cart: [...state.cart, action.payload],
      total: tempTotal,
    };
  } else if (action.type === INCREASE_QUANTITY) {
    let tempTotal = 0;
    action.payload.forEach((product) => {
      tempTotal += product.price * product.quantity;
    });
    return {
      ...state,
      cart: [...state.cart, action.payload],
      total: tempTotal,
    };
  } else if (action.type === DECREASE_QUANTITY) {
    let tempTotal = 0;
    action.payload.forEach((product) => {
      tempTotal += product.price * product.quantity;
    });
    return {
      ...state,
      cart: [...state.cart, action.payload],
      total: tempTotal,
    };
  } else if (action.type === EMPTY_CART) {
    return {
      ...state,
      cart: action.payload,
      total: 0,
    };
  }
  return state;
};
