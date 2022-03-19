import axios from "axios";

export const ALL_PRODUCTS = "ALL_PRODUCTS";

export const getProducts = (products) => ({
    type: ALL_PRODUCTS,
    payload: products,
});

export const getAllProducts = () => async (dispatch) => {
    const allProducts = await axios.get("/api/products");
    dispatch(getProducts(allProducts.data));
};
