import React, { Component } from "react";

// Redux Imports
import { connect } from "react-redux";
import { updateProfileThunk } from "../../store/actionCreators/singleUser";
import { logOutUser } from "../../store/actionCreators/singleUser";

// Material UI Imports
import Button from "@material-ui/core/Button";

// Component Imports
import EditUserAccount from "./Dialogues/EditUserAccount.jsx";
import AreYouSure from "../AreYouSure.jsx";

// Style Import
import "../../../public/assets/user.css";

class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogueOpen: false,
            logoutScreen: false,
        };

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.openLogout = this.openLogout.bind(this);
        this.closeLogout = this.closeLogout.bind(this);
    }

    handleOpen() {
        this.setState({
            ...this.state,
            dialogueOpen: true,
        });
    }

    handleClose() {
        this.setState({
            ...this.state,
            dialogueOpen: false,
        });
    }

    openLogout() {
        this.setState({
            ...this.state,
            logoutScreen: true,
        });
    }

    closeLogout() {
        this.setState({
            ...this.state,
            logoutScreen: false,
        });
    }

    handleLogout() {
        // Redirect to clicked page
        this.props.history.push(`/sign-in`);
        this.props.logout();
    }

    handleSubmit(firstName, lastName, pronouns,email, username) {
        const { updateUser } = this.props;
        const { id } = this.props.user;

        updateUser({ id, firstName, lastName, pronouns, username, email });
        this.handleClose();
    }

    render() {
        const { user } = this.props;
        const { dialogueOpen, logoutScreen } = this.state;
        const { id, firstName, lastName, pronouns, email, username, userType } = user;

        return (
            <React.Fragment>
                <div id="account-title-container" className="account-item">
                    <h3 id="account-title">Account Information</h3>
                </div>
                <div id="name-controller" className="account-item">
                    <form onSubmit={this.handleSubmit} className="detail-form">
                        <div className="user-item-container">
                            <h4>Name</h4>
                            <div
                                className="user-subtext"
                                id="user-name-container"
                            >
                                <p>
                                    {firstName} {lastName}
                                </p>
                            </div>
                        </div>
                        <div className="user-item-container">
                            <h4>Pronouns</h4>
                            <div
                                className="user-subtext"
                                id="user-pronouns-container"
                            >
                                <p>
                                    {pronouns}
                                </p>
                            </div>
                        </div>
                        <div className="user-item-container">
                            <h4>Username</h4>
                            <div
                                className="user-subtext"
                                id="user-username-container"
                            >
                                <p>{username}</p>
                            </div>
                        </div>
                        <div className="user-item-container">
                            <h4>Personal Information</h4>
                            <div
                                className="user-subtext"
                                id="user-information-container"
                            >
                                <p className="pre-text">Email: </p>
                                <p>{email}</p>
                            </div>
                        </div>
                    </form>
                </div>
                <div>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={this.handleOpen}
                    >
                        Edit Information
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={this.openLogout}
                    >
                        Logout
                    </Button>
                    <AreYouSure
                        message="Are you sure you want to logout?"
                        open={logoutScreen}
                        close={this.closeLogout}
                        userFn={this.handleLogout}
                    />
                    <EditUserAccount
                        open={dialogueOpen}
                        close={this.handleClose}
                        submit={this.handleSubmit}
                        {...user}
                    />
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.signedIn.user,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        updateUser: (user) => dispatch(updateProfileThunk(user)),
        logout: () => dispatch(logOutUser()),
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Account);
