import { GET_USER } from "../actionCreators/singleUser";
import { ADD_USER } from "../actionCreators/allUsers";
import { DELETE_ORDER } from "../actionCreators/orders";

export const singleUserReducer = (state = {}, action) => {
    if (action.type === GET_USER) {
        return (state = action.payload);
    } else if (action.type === ADD_USER) {
        return (state = action.payload);
    } else if (action.type === DELETE_ORDER) {
        return {
            ...state,
            orders: state.orders.filter((order) => order.id !== action.id),
        };
    } else {
        return state;
    }
};
