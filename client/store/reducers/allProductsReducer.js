import { ALL_PRODUCTS } from "../actionCreators/allProducts";
import {
    UPDATE_PRODUCT,
    CREATE_PRODUCT,
    DELETE_PRODUCT,
} from "../actionCreators/singleProduct";

export const allProductsReducer = (state = [], action) => {
    if (action.type === ALL_PRODUCTS) {
        return action.payload;
    }
    if (action.type === UPDATE_PRODUCT) {
        return state.map((product) =>
            product.id !== action.payload.id ? product : action.payload,
        );
    } else if (action.type === CREATE_PRODUCT) {
        return (state = [...state, action.payload]);
    } else if (action.type === DELETE_PRODUCT) {
        return state.filter((product) => product.id !== action.id);
    } else {
        return state;
    }
};
