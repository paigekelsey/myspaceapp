import {
    DELETE_PRODUCT,
    SINGLE_PRODUCT,
    UPDATE_PRODUCT,
} from "../actionCreators/singleProduct";

export const singleProductReducer = (state = [], action) => {
    if (action.type === SINGLE_PRODUCT) {
        return action.payload;
    }
    if (action.type === UPDATE_PRODUCT) {
        return action.payload;
    } else if (action.type === DELETE_PRODUCT) {
        return [];
    } else {
        return state;
    }
};
