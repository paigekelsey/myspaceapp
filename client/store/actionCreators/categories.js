import axios from "axios";

export const GET_CATEGORIES = "GET_CATEGORIES";
export const GET_CATEGORY = "GET_CATEGORY";
export const ADD_CATEGORY = "ADD_CATEGORY";
export const UPDATE_CATEGORY = "UPDATE_CATEGORY";
export const DELETE_CATEGORY = "DELETE_CATEGORY";

export const getCategories = (categories) => ({
    type: GET_CATEGORIES,
    categories,
});

export const getCategory = (category) => ({
    type: GET_CATEGORY,
    category,
});

export const addCategory = (category) => ({
    type: ADD_CATEGORY,
    category,
});

export const updateCategory = (category) => ({
    type: UPDATE_CATEGORY,
    category,
});

export const deleteCategory = (id) => ({
    type: DELETE_CATEGORY,
    id,
});

// GET request for all users
export const getCategories_thunk = () => async (dispatch) => {
    try {
        const { data: allCategories } = await axios.get("/api/categories");
        dispatch(getCategories(allCategories));
    } catch (err) {
        console.error(err);
    }
};

export const getCategory_thunk = (id) => async (dispatch) => {
    try {
        const { data: category } = await axios.get(`/api/categories/${id}`);
        dispatch(getCategory(category));
    } catch (err) {
        console.error(err);
    }
};

// POST request to add artist
export const addCategory_thunk = (category) => async (dispatch) => {
    try {
        const token = window.localStorage.getItem("token");
        const { data: newCategory } = await axios.post(
            "/api/categories",
            {
                ...category,
            },
            {
                headers: {
                    authorization: token,
                },
            },
        );
        dispatch(addCategory(newCategory));
    } catch (err) {
        console.error(err);
    }
};

// PUT request to update artist
export const updateCategory_thunk = (category) => async (dispatch) => {
    try {
        const token = window.localStorage.getItem("token");
        const { data: updatedCategory } = await axios.put(
            `/api/categories/${category.id}`,
            { ...category },
            {
                headers: {
                    authorization: token,
                },
            },
        );

        dispatch(updateCategory(updatedCategory));
    } catch (err) {
        console.error(err);
    }
};

// DELETE request to update artist
export const deleteCategory_thunk = (id) => async (dispatch) => {
    try {
        const token = window.localStorage.getItem("token");
        await axios.delete(`/api/categories/${id}`, {
            headers: {
                authorization: token,
            },
        });

        dispatch(deleteCategory(id));
    } catch (err) {
        console.error(err);
    }
};
