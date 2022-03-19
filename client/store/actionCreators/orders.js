import axios from "axios";

export const GET_ORDERS = "GET_ORDERS";
export const GET_ORDER = "GET_ORDER";
export const ADD_ORDER = "ADD_ORDER";
export const UPDATE_ORDER = "UPDATE_ORDER";
export const DELETE_ORDER = "DELETE_ORDER";

export const getOrders = (orders) => ({
    type: GET_ORDERS,
    categories,
});

export const getOrder = (order) => ({
    type: GET_ORDER,
    order,
});

export const addOrder = (order) => ({
    type: ADD_ORDER,
    order,
});

export const updateOrder = (order) => ({
    type: UPDATE_ORDER,
    order,
});

export const deleteOrder = (id) => ({
    type: DELETE_ORDER,
    id,
});

// GET request for all orders
export const getOrders_thunk = () => async (dispatch) => {
    try {
        const { data: allOrders } = await axios.get("/api/orders");
        dispatch(getOrders(allOrders));
    } catch (err) {
        console.error(err);
    }
};

export const getOrder_thunk = (id) => async (dispatch) => {
    try {
        const { data: order } = await axios.get(`/api/orders/${id}`);
        dispatch(getOrder(order));
    } catch (err) {
        console.error(err);
    }
};

// POST request to add order
export const addOrder_thunk = (order) => async (dispatch) => {
    try {
        const { data: newCategory } = await axios.post("/api/orders", {
            ...order,
        });
        dispatch(addOrder(newCategory));
    } catch (err) {
        console.error(err);
    }
};

// PUT request to update order
export const updateOrder_thunk = (order) => async (dispatch) => {
    try {
        const token = window.localStorage.getItem("token");
        const { data: updatedCategory } = await axios.put(
            `/api/orders/${order.id}`,
            { ...order },
            {
                headers: {
                    authorization: token,
                },
            },
        );

        dispatch(updateOrder(updatedCategory));
    } catch (err) {
        console.error(err);
    }
};

// DELETE request to update order
export const deleteOrder_thunk = (id) => async (dispatch) => {
    try {
        const token = window.localStorage.getItem("token");
        await axios.delete(`/api/orders/${id}`, {
            headers: {
                authorization: token,
            },
        });

        dispatch(deleteOrder(id));
    } catch (err) {
        console.error(err);
    }
};
