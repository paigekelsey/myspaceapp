import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";

import { allProductsReducer } from "./reducers/allProductsReducer";

import { singleProductReducer } from "./reducers/singleProductReducer";
import { allUsersReducer } from "./reducers/allUsersReducer";
import { singleUserReducer } from "./reducers/singleUserReducer";
import { cartReducer } from "./reducers/cartReducer";
import { signInReducer } from "./reducers/signInReducer";
import { reviewReducer } from "./reducers/reviewReducer";
import { artistsReducer } from "./reducers/artistsReducer";
import { categoriesReducer } from "./reducers/categoriesReducer";

// Combiend Reducer
const primaryReducer = combineReducers({
    allProducts: allProductsReducer,
    singleProduct: singleProductReducer,
    allUsers: allUsersReducer,
    singleUser: singleUserReducer,
    cart: cartReducer,
    signedIn: signInReducer,
    reviews: reviewReducer,
    allArtists: artistsReducer,
    allCategories: categoriesReducer,
});

// Redux Middleware
const middleware = applyMiddleware(thunk, createLogger({ collapsed: true }));

// Redux Store
const store = createStore(primaryReducer, middleware);
export default store;
