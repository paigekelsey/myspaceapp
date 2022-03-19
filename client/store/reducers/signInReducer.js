import {
    SIGN_IN,
    LOG_OUT,
    UPDATE_USER,
    UPDATE_PROFILE,
} from "../actionCreators/singleUser";
import { UPDATE_ORDER, DELETE_ORDER } from "../actionCreators/orders";

const initialState = { user: null, isSignedIn: false };

export const signInReducer = (state = initialState, action) => {
    if (action.type === SIGN_IN) {
        return (state = { user: action.user, isSignedIn: true });
    } else if (action.type === LOG_OUT) {
        return (state = initialState);
    } else if (action.type === UPDATE_PROFILE) {
        return (state = { ...state, user: action.user });
    } else if (action.type === DELETE_ORDER) {
        if (state.isSignedIn) {
            const userOrders = state.user.orders.filter(
                (order) => order.id !== action.id,
            );

            return { ...state, user: { ...state.user, orders: userOrders } };
        } else {
            return state;
        }
    } else {
        return state;
    }
};
