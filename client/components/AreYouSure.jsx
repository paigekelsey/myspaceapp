import React, { Component } from "react";

// Material UI Imports
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

class AreYouSure extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { message, userFn, close, open } = this.props;

        return (
            <Dialog
                open={open}
                onClose={close}
                aria-labelledby="form-dialog-title"
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle id="form-dialog-title">
                    Action Confirmation
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={close} color="secondary">
                        No
                    </Button>
                    <Button onClick={userFn} color="primary">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default AreYouSure;
