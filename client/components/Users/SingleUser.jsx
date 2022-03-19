import React, { Component } from "react";

// Redux Imports
import { connect } from "react-redux";

// React-Router Imports
import { Switch, Route } from "react-router";
import { NavLink } from "react-router-dom";

// Component Imports
import Account from "./Account.jsx";
import Orders from "./Orders.jsx";
import AdminScreen from "./AdminScreen.jsx";

// Style Import
import "../../../public/assets/user.css";

class SingleUser extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { user, isSignedIn } = this.props.signInInfo;

        // You can only see a profile if you are signed in
        if (!isSignedIn) {
            return (
                <div className="primary-screen">
                    Please login to view your profile
                </div>
            );
        }

        // If signed in, get user properties
        const { id, userType } = user;

        return (
            <div className="primary-screen">
                <header className="user-header">
                    <div className="user-header-container">
                        <NavLink
                            to={`/user/${id}/profile`}
                            className="header-link-user"
                            name="profile"
                        >
                            Account
                        </NavLink>
                    </div>
                    <div className="user-header-container">
                        <NavLink
                            to={`/user/${id}/orders`}
                            className="header-link-user"
                            name="orders"
                        >
                            Orders
                        </NavLink>
                    </div>
                    {userType === "ADMIN" ? (
                        // If admin, show admin page link!
                        <div className="user-header-container">
                            <NavLink
                                to={`/user/${id}/admin`}
                                className="header-link-user"
                                name="orders"
                            >
                                Admin
                            </NavLink>
                        </div>
                    ) : (
                        ""
                    )}
                </header>
                <div className="user-screen">
                    <Switch>
                        <Route
                            exact
                            path={`/user/${id}/profile`}
                            component={Account}
                        />
                    </Switch>
                    <Switch>
                        <Route
                            exact
                            path={`/user/${id}/orders`}
                            component={Orders}
                        />
                    </Switch>
                    <Switch>
                        <Route
                            exact
                            path={`/user/${id}/admin`}
                            component={AdminScreen}
                        />
                    </Switch>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        signInInfo: state.signedIn,
    };
}

export default connect(mapStateToProps)(SingleUser);
