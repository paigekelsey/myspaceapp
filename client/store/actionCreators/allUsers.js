import axios from "axios";

export const GET_ALL_USERS = "GET_ALL_USERS";
export const ADD_USER = "ADD_USER";

export const getUsers = (users) => ({
    type: GET_ALL_USERS,
    payload: users,
});

export const addUser = (user) => ({
    type: ADD_USER,
    payload: user,
});

// GET request for all users
export const getAllUsers = () => async (dispatch) => {
    try {
        const { data: allUsers } = await axios.get("/api/users");
        dispatch(getUsers(allUsers));
    } catch (err) {
        console.error(err);
    }
};

// POST request to add user
export const addSingleUser = (user) => async (dispatch) => {
    await axios
        .post("/api/users", user)
        .then(({ data: newUser }) => dispatch(addUser(newUser)))
        .catch((err) => {
            throw err;
        });
};

export const adminAddUser = (user) => async (dispatch) => {
    const token = window.localStorage.getItem("token");
    const { data: newUser } = await axios.post(
        "/api/admins/users",
        {
            ...user,
        },
        {
            headers: {
                authorization: token,
            },
        },
    );
    dispatch(addUser(newUser));
};
