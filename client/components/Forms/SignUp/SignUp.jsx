import React, { Component } from "react";
import axios from "axios";

// Redux imports
import { connect } from "react-redux";
import { addSingleUser } from "../../../store/actionCreators/allUsers";
import { attemptTokenLogin } from "../../../store/actionCreators/singleUser";

// React-Router
import { NavLink } from "react-router-dom";

// Styles Import
import "../../../../public/assets/signup.css";

// Script Imports
import resetSignUpFormStyles from "./resetSignUpFormStyles";
import signUpValidator, { showError } from "./signUpValidator";
import GoogleSignUp from "./GoogleSignUp.jsx";

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            username: "",
            pronouns: "",
            password: "",
            confirmPassword: "",
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.authenticate = this.authenticate.bind(this);
    }

    // Authenticates the user right after they sign up
    async authenticate({ username, password }) {
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
                    this.props.attemptLogin();
                }
            })
            // If bad credentials, throw
            .catch((err) => {
                throw err;
            });
    }

    // Handles sign up submission/error checking
    async handleSubmit(ev) {
        ev.preventDefault();

        // Determines if our input is valid, modifies DOM
        const allValid = signUpValidator();

        // This will send the data to a thunk to create the user in a POST route
        if (allValid) {
            const { email, username, pronouns, password } = this.state;

            // References to our inputs for DOM manipulation
            const emailLabel = document.getElementById("email-input");
            const usernameLabel = document.getElementById("username-input");
            const pronounsLabel = document.getElementById("pronouns-input");

            // Creates the user in the database
            await this.props
                .createUser({ email, username, pronouns, password })
                .then(async () => {
                    // Authenticates user
                    this.authenticate({ username, password });
                })
                .then(() => {
                    // Resets our state to blank
                    this.setState({
                        email: "",
                        username: "",
                        pronouns: "",
                        password: "",
                        confirmPassword: "",
                    });
                })
                // Error handling
                .catch((err) => {
                    switch (err.message) {
                        case "Request failed with status code 409":
                            showError(
                                emailLabel,
                                "Email or Username already exists",
                            );
                            showError(
                                usernameLabel,
                                "Email or Username already exists",
                            );
                    }
                });
        }
    }

    // Modifies the state to reflect current text in input fields
    handleChange(ev) {
        this.setState({
            [ev.target.name]: ev.target.value,
        });
    }

    render() {
        const { email, username, pronouns, password, confirmPassword } = this.state;
        const { user, isSignedIn } = this.props.loginStatus;

        return (
            <div className="primary-screen">
                <div className="form-container">
                    <h2>Sign Up</h2>
                    {isSignedIn ? (
                        <React.Fragment>
                            <p id="already-signed-in">Success!</p>
                            <NavLink to={`/user/${user.id}/profile`}>
                                Go to Profile
                            </NavLink>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <form
                                id="sign-up-form"
                                onSubmit={this.handleSubmit}
                            >
                                <div className="form-control">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        value={email}
                                        onChange={this.handleChange}
                                        id="email-input"
                                        name="email"
                                        type="text"
                                        placeholder="Enter email"
                                    />
                                    <small>Error message</small>
                                </div>
                                <div className="form-control">
                                    <label htmlFor="username">Username</label>
                                    <input
                                        value={username}
                                        onChange={this.handleChange}
                                        id="username-input"
                                        name="username"
                                        type="text"
                                        placeholder="Enter username"
                                    />
                                    <small>Error message</small>
                                </div>
                                <div className="form-control">
                                    <label htmlFor="pronouns">Pronouns</label>
                                    <input
                                        value={pronouns}
                                        onChange={this.handleChange}
                                        id="pronouns-input"
                                        name="pronouns"
                                        type="text"
                                        placeholder="Enter pronouns"
                                    />
                                </div>
                                <div className="form-control">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        value={password}
                                        onChange={this.handleChange}
                                        id="password-input"
                                        name="password"
                                        type="password"
                                        placeholder="Enter password"
                                    />
                                    <small>Error message</small>
                                </div>
                                <div className="form-control">
                                    <label htmlFor="confirmPassword">
                                        Confirm Password
                                    </label>
                                    <input
                                        value={confirmPassword}
                                        onChange={this.handleChange}
                                        id="confirmPassword-input"
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Enter password"
                                    />
                                    <small>Error message</small>
                                </div>
                                <button type="submit" className="submit-btn">
                                    Submit
                                </button>
                            </form>
                            <GoogleSignUp />
                            <p id="sign-up-prompt">
                                Already have an account?{" "}
                                <span>
                                    <NavLink to="/sign-in">Sign In</NavLink>
                                </span>
                            </p>
                        </React.Fragment>
                    )}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        loginStatus: state.signedIn,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        createUser: (user) => dispatch(addSingleUser(user)),
        attemptLogin: () => dispatch(attemptTokenLogin()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
