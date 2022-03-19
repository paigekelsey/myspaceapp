import React, { Component } from "react";

// Redux Imports
import { connect } from "react-redux";

// Material UI Imports
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Checkbox from "@material-ui/core/Checkbox";

// Component Improts
import ProductCheckbox from "./ProductCheckbox.jsx";

class ProductDialogue extends Component {
    constructor(props) {
        super(props);

        const allCategories = this.props.allCategories;
        const allCatNames = allCategories.map((cat) => cat.name);
        const productCatNames = props.categories.length
            ? props.categories.map((cat) => cat.name)
            : [];

        const newCatFormat = allCatNames.reduce((acc, cur) => {
            if (productCatNames.includes(cur)) {
                acc[cur] = true;
            } else {
                acc[cur] = false;
            }
            return acc;
        }, {});

        this.state = {
            id: props.id,
            name: props.name,
            description: props.description,
            price: props.price,
            year: props.year,
            stock: props.stock,
            imgUrl: props.imgUrl,
            categories: newCatFormat,
            nationality: props.nationality,
            artistName: props.artistName,
        };
        this.handleChange = this.handleChange.bind(this);
        this.reset = this.reset.bind(this);
        this.categoryChange = this.categoryChange.bind(this);
    }

    handleChange(ev) {
        this.setState({
            ...this.state,
            [ev.target.name]: ev.target.value,
        });
    }

    categoryChange(ev) {
        this.setState({
            ...this.state,
            categories: {
                ...this.state.categories,
                [ev.target.name]: ev.target.checked,
            },
        });
    }

    // Resets our values when you close the form
    reset() {
        const {
            close,
            name,
            description,
            price,
            year,
            stock,
            imgUrl,
            categories,
        } = this.props;

        close();

        // Reset after the window closes
        setTimeout(() => {
            this.setState({
                name,
                description,
                price,
                year,
                stock,
                imgUrl,
                categories,
            });
        }, 100);
    }

    render() {
        const { submit, close, open } = this.props;
        const {
            id,
            name,
            description,
            price,
            year,
            stock,
            imgUrl,
            categories,
            artistName,
            nationality,
        } = this.state;

        return (
            <div>
                <Dialog
                    open={open}
                    onClose={close}
                    aria-labelledby="form-dialog-title"
                    fullWidth
                    maxWidth="sm"
                    style={{ padding: "5px" }}
                >
                    <DialogTitle id="form-dialog-title">
                        Edit Product Details
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            required
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
                    <DialogContent>
                        <TextField
                            required
                            margin="dense"
                            id="artistName"
                            label="Artist Name"
                            type="name"
                            name="artistName"
                            value={artistName}
                            fullWidth
                            onChange={this.handleChange}
                        />
                    </DialogContent>
                    <DialogContent>
                        <TextField
                            required
                            margin="dense"
                            id="nationality"
                            label="Nationality of Artist"
                            type="name"
                            name="nationality"
                            value={nationality}
                            fullWidth
                            onChange={this.handleChange}
                        />
                    </DialogContent>
                    <DialogContent>
                        <TextField
                            required
                            margin="dense"
                            id="description"
                            label="Description"
                            type="description"
                            name="description"
                            multiline
                            value={description}
                            fullWidth
                            onChange={this.handleChange}
                        />
                    </DialogContent>
                    <DialogContent>
                        <TextField
                            required
                            margin="dense"
                            id="price"
                            label="Price"
                            type="price"
                            name="price"
                            value={price}
                            fullWidth
                            onChange={this.handleChange}
                        />
                    </DialogContent>
                    <DialogContent>
                        <TextField
                            required
                            margin="dense"
                            id="year"
                            type="date"
                            name="year"
                            value={year}
                            fullWidth
                            onChange={this.handleChange}
                        />
                    </DialogContent>
                    <DialogContent>
                        <TextField
                            required
                            margin="dense"
                            id="stock"
                            label="Stock"
                            type="stock"
                            name="stock"
                            value={stock}
                            fullWidth
                            onChange={this.handleChange}
                        />
                    </DialogContent>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            id="imgUrl"
                            label="Image URL"
                            type="imgUrl"
                            name="imgUrl"
                            value={imgUrl}
                            fullWidth
                            onChange={this.handleChange}
                        />
                    </DialogContent>
                    <DialogContent>
                        <ProductCheckbox
                            categories={categories}
                            checkAction={this.categoryChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.reset} color="primary">
                            Cancel
                        </Button>
                        <Button
                            onClick={() =>
                                submit(
                                    id,
                                    name,
                                    description,
                                    price,
                                    year,
                                    stock,
                                    imgUrl,
                                    categories,
                                    nationality,
                                    artistName,
                                )
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
function mapStateToProps(state) {
    return {
        allCategories: state.allCategories,
    };
}
export default connect(mapStateToProps)(ProductDialogue);
