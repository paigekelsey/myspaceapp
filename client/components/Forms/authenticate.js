import axios from "axios";

// Creates a JWT token to attempt to log in
const authenticate = async ({ username, password }) => {
    await axios
        // Create a token with the username and password
        .post("/api/auth", {
            username,
            password,
        })
        // Store token in the user's local storage
        .then(({ data: { token } }) => {
            // Set new token
            if (token) {
                window.localStorage.setItem("token", token);
            }
        })
        // If bad credentials, throw
        .catch((err) => {
            throw err;
        });
};

export default authenticate;
