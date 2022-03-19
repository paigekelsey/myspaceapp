import React, { Component } from "react";
import axios from "axios";

// Redux Imports
import { connect } from "react-redux";
import { attemptTokenLogin } from "../../../store/actionCreators/singleUser";

// React-Router Imports
import { NavLink } from "react-router-dom";

// Style Imports
import "../../../../public/assets/signin.css";

// Script Imports
import signInValidator, { showError, showSuccess } from "./signInValidator";
import authenticate from "../authenticate";

// Component Imports
import GoogleSignUp from "../SignUp/GoogleSignUp.jsx";

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = { username: "", password: "" };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  // Handles sign in submission/error checking
  async handleSubmit(ev) {
    ev.preventDefault();

    // Determines if our input is valid, modifies DOM
    const allValid = signInValidator();

    // This will send the data to a thunk to authorize the sign in
    if (allValid) {
      const { username, password } = this.state;

      // References to our inputs for DOM manipulation
      const usernameLabel = document.getElementById("username-input");
      const passwordLabel = document.getElementById("password-input");

      // Create a JWT token from username and password
      await authenticate({ username, password })
        .then(async () => this.props.attemptLogin())
        .then(() => {
          this.setState({
            username: "",
            password: "",
          });
        })
        .catch((err) => {
          // If bad login credentials, give user feedback and reset password
          showError(usernameLabel, "Incorrect email/password");
          showError(passwordLabel, "Incorrect email/password");
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
        const { username, password } = this.state;
        const { user, isSignedIn } = this.props.loginStatus;

        return (
            <div className="primary-screen">
                <div id="signIn" className="form-container">
                    <h2>Sign In</h2>
                    {isSignedIn ? (
                        <React.Fragment>
                            <p id="already-signed-in">You are signed in!</p>
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
                                <button type="submit" className="submit-btn">
                                    Submit
                                </button>
                            </form>
                            <GoogleSignUp />
                            <p id="sign-up-prompt">
                                New here?{" "}
                                <span>
                                    <NavLink to="/sign-up">Sign Up</NavLink>
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
    attemptLogin: () => dispatch(attemptTokenLogin()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
