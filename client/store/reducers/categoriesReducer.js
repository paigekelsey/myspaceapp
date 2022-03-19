import {
    GET_CATEGORIES,
    GET_CATEGORY,
    ADD_CATEGORY,
    UPDATE_CATEGORY,
    DELETE_CATEGORY,
} from "../actionCreators/categories";

export const categoriesReducer = (state = [], action) => {
    if (action.type === GET_CATEGORIES) {
        return action.categories;
    } else if (action.type === UPDATE_CATEGORY) {
        return state.map((category) =>
            category.id !== action.category.id ? category : action.category,
        );
    } else if (action.type === ADD_CATEGORY) {
        return (state = [...state, action.category]);
    } else if (action.type === DELETE_CATEGORY) {
        return state.filter((category) => category.id !== action.id);
    } else {
        return state;
    }
};
