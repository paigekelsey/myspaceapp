import React, { Component } from "react";

// React Router Imports
import { Link } from "react-router-dom";

// Redux Imports
import { connect } from "react-redux";

class AdminScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <React.Fragment>
                <div id="order-title-container" className="order-item">
                    <h3 id="order-title">Admin Portal</h3>
                </div>
                <div className="admin-selection-container">
                    <Link className="admin-portal-link" to="/admin/users">
                        <div id="admin-users-portal" className="admin-portal">
                            <img
                                src="/images/utils/admin-users-portal.png"
                                alt=""
                            />
                            <h4 className="admin-portal-title">Users</h4>
                        </div>
                    </Link>
                    <Link className="admin-portal-link" to="/admin/inventory">
                        <div
                            id="admin-products-portal"
                            className="admin-portal"
                        >
                            <img
                                src="/images/utils/admin-inventory-portal.png"
                                alt=""
                            />
                            <h4 className="admin-portal-title">Inventory</h4>
                        </div>
                    </Link>
                </div>
            </React.Fragment>
        );
    }
}

export default AdminScreen;
