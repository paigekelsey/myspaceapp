import axios from "axios";

export const ADD_TO_CART = "ADD_TO_CART";
export const REMOVE_FROM_CART = "REMOVE_FROM_CART";
export const INCREASE_QUANTITY = "INCREASE_QUANTITY";
export const DECREASE_QUANTITY = "DECREASE_QUANTITY";
export const EMPTY_CART = "EMPTY_CART";

// API {
//     products: [ { id: #, quantity: # }, { id: another #, quantity: # }, ...],
//     userId: #,
// }

export const addItemToCart = (product, userId) => {
  return async (dispatch) => {
    if (product === null) {
      const response = (await axios.get(`/api/cart/productsInCart/${userId}`))
        .data;
      dispatch({ type: ADD_TO_CART, payload: response });
    } else {
      await axios.post(`/api/cart`, { product, userId });
      const response = (await axios.get(`/api/cart/productsInCart/${userId}`))
        .data;
      dispatch({ type: ADD_TO_CART, payload: response });
    }
  };
};

export const removeFromCart = (product, userId) => {
  return async (dispatch) => {
    const response = (
      await axios.delete(`/api/cart/productsInCart/${product.productId}`, {
        data: { userId },
      })
    ).data;
    dispatch({ type: REMOVE_FROM_CART, payload: response });
  };
};

export const increaseQuantity = (product, userId) => {
  return async (dispatch) => {
    const response = (
      await axios.put(
        `/api/cart/productsInCart/increase/${product.productId}`,
        {
          data: { userId },
        }
      )
    ).data;
    console.log("response in reducer", response);
    dispatch({ type: INCREASE_QUANTITY, payload: response });
  };
};

export const decreaseQuantity = (product, userId) => {
  return async (dispatch) => {
    const response = (
      await axios.put(
        `/api/cart/productsInCart/decrease/${product.productId}`,
        {
          data: { userId },
        }
      )
    ).data;

    dispatch({ type: DECREASE_QUANTITY, payload: response });
  };
};

export const emptyCart = () => {
  return async (dispatch) => {
    await axios.delete("/api/cart/emptyCart");
    dispatch({ type: EMPTY_CART, payload: [] });
  };
};
