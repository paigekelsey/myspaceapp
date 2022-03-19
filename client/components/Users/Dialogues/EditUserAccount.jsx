import React, { Component } from "react";

// Material UI Imports
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

// Redux Imports
import { connect } from "react-redux";

class EditUserAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: props.firstName,
            lastName: props.lastName,
            pronouns: props.pronouns,
            username: props.username,
            email: props.email,
        };
        this.handleChange = this.handleChange.bind(this);
        this.reset = this.reset.bind(this);
    }

    handleChange(ev) {
        this.setState({
            ...this.state,
            [ev.target.name]: ev.target.value,
        });
    }

    // Resets our values when you close the form
    reset() {
        const { close, firstName, lastName, pronouns, username, email } = this.props;

        close();

        // Reset after the window closes
        setTimeout(() => {
            this.setState({
                firstName,
                lastName,
                pronouns,
                username,
                email,
            });
        }, 100);
    }

    render() {
        // Our function props
        const { submit, close, open } = this.props;
        const { firstName, lastName, pronouns, email, username } = this.state;

        return (
            <div>
                <Dialog
                    open={open}
                    onClose={close}
                    aria-labelledby="form-dialog-title"
                    fullWidth
                    maxWidth="xs"
                >
                    <DialogTitle id="form-dialog-title">
                        Edit User Profile
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="First Name"
                            type="name"
                            name="firstName"
                            value={firstName}
                            fullWidth
                            onChange={this.handleChange}
                        />
                    </DialogContent>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Last Name"
                            type="name"
                            name="lastName"
                            value={lastName}
                            fullWidth
                            onChange={this.handleChange}
                        />
                    </DialogContent>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="pronouns"
                            label="Pronouns"
                            type="text"
                            name="pronouns"
                            value={pronouns}
                            fullWidth
                            onChange={this.handleChange}
                        />
                    </DialogContent>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="username"
                            label="Username"
                            type="username"
                            name="username"
                            value={username}
                            fullWidth
                            onChange={this.handleChange}
                        />
                    </DialogContent>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="email"
                            label="Email Address"
                            type="email"
                            name="email"
                            value={email}
                            fullWidth
                            onChange={this.handleChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.reset} color="primary">
                            Cancel
                        </Button>
                        <Button
                            onClick={() =>
                                submit(firstName, lastName, pronouns, email, username)
                            }
                            color="primary"
                        >
                            Save Changes
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default connect()(EditUserAccount);
