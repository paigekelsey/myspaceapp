import React, { Component } from "react";

// Redux Imports
import { connect } from "react-redux";

// React-Router Imports
import { Switch, Route } from "react-router";
import { NavLink } from "react-router-dom";

// Component Imports
import AdminUsers from "./AdminUsers.jsx";
import AdminInventory from "./AdminInventory.jsx";
import AdminCategories from "./AdminCategories.jsx";
import AdminOrders from "./AdminOrders.jsx";

// Style Imports
import "../../../public/assets/admin.css";

class AdminPortal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        //
        const { user, isSignedIn } = this.props.signInInfo;

        // You can only see a profile if you are signed in
        if (!isSignedIn) {
            return (
                <div className="primary-screen">
                    Please login to view your profile
                </div>
            );
        }

        // COMMENTED FOR TESTING
        if (user.userType !== "ADMIN") {
            return (
                <div className="primary-screen">
                    You do not have permission to view this screen
                </div>
            );
        }

        return (
            <div className="primary-screen">
                <header className="user-header">
                    <div className="user-header-container">
                        <NavLink
                            to={`/admin/users`}
                            className="header-link-user"
                            name="users"
                        >
                            Users
                        </NavLink>
                    </div>
                    <div className="user-header-container">
                        <NavLink
                            to={`/admin/inventory`}
                            className="header-link-user"
                            name="inventory"
                        >
                            Inventory
                        </NavLink>
                    </div>
                    <div className="user-header-container">
                        <NavLink
                            to={`/admin/categories`}
                            className="header-link-user"
                            name="categories"
                        >
                            Categories
                        </NavLink>
                    </div>
                </header>
                <div className="user-screen">
                    <Switch>
                        <Route
                            exact
                            path={`/admin/users`}
                            component={AdminUsers}
                        />
                    </Switch>
                    <Switch>
                        <Route
                            exact
                            path={`/admin/users/:id/orders`}
                            component={AdminOrders}
                        />
                    </Switch>
                    <Switch>
                        <Route
                            exact
                            path={`/admin/inventory`}
                            component={AdminInventory}
                        />
                    </Switch>
                    <Switch>
                        <Route
                            exact
                            path={`/admin/categories`}
                            component={AdminCategories}
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

export default connect(mapStateToProps)(AdminPortal);
