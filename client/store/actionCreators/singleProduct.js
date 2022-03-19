import axios from "axios";

export const SINGLE_PRODUCT = "SINGLE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const DELETE_PRODUCT = "DELETE_PRODUCT";

export const getProduct = (product) => ({
    type: SINGLE_PRODUCT,
    payload: product,
});

export const updateProduct = (product) => ({
    type: UPDATE_PRODUCT,
    payload: product,
});
export const createProduct = (product) => ({
    type: CREATE_PRODUCT,
    payload: product,
});
export const deleteProduct = (id) => ({
    type: DELETE_PRODUCT,
    id,
});

export const getSingleProduct = (id) => async (dispatch) => {
    const singleProduct = await axios.get(`/api/products/${id}`);
    dispatch(getProduct(singleProduct.data));
};

export const updateSingleProduct = (product) => async (dispatch) => {
    const token = window.localStorage.getItem("token");
    const singleProduct = await axios.put(
        `/api/products/${product.id}`,
        {
            ...product,
        },
        {
            headers: {
                authorization: token,
            },
        },
    );
    dispatch(updateProduct(singleProduct.data));
};

export const updateProduct_adminAccess = (product) => async (dispatch) => {
    const token = window.localStorage.getItem("token");
    const { data: singleProduct } = await axios.put(
        `/api/products/${product.id}`,
        { ...product },
        {
            headers: {
                authorization: token,
            },
        },
    );

    dispatch(updateProduct(singleProduct));
};

export const adminAddProduct = (product) => async (dispatch) => {
    const token = window.localStorage.getItem("token");
    const { data: singleProduct } = await axios.post(
        `/api/products`,
        { ...product },
        {
            headers: {
                authorization: token,
            },
        },
    );
    dispatch(createProduct(singleProduct));
};

export const deleteProduct_thunk = (id) => async (dispatch) => {
    const token = window.localStorage.getItem("token");
    await axios.delete(`/api/products/${id}`, {
        headers: {
            authorization: token,
        },
    });
    dispatch(deleteProduct(id));
};
