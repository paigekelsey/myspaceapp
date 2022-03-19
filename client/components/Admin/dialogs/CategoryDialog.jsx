import React, { Component } from "react";

// Material UI Imports
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import RadioGroup from "@material-ui/core/RadioGroup";

// Redux Imports
import { connect } from "react-redux";

class CategoryDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            name: props.name,
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
        const { close, name } = this.props;

        close();

        // Reset after the window closes
        setTimeout(() => {
            this.setState({
                name,
            });
        }, 100);
    }

    render() {
        // Our function props
        const { submit, close, open } = this.props;
        const { id, name } = this.state;
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
                        Edit Category
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Name"
                            type="name"
                            name="name"
                            value={name}
                            fullWidth
                            onChange={this.handleChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.reset} color="primary">
                            Cancel
                        </Button>
                        <Button
                            onClick={() => submit(id, name)}
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

export default connect()(CategoryDialog);
