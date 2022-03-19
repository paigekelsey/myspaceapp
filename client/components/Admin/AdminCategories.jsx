import React, { Component } from "react";

// Material UI Imports
import Button from "@material-ui/core/Button";

// React Router Imports
import { NavLink } from "react-router-dom";

// Redux Imports
import { connect } from "react-redux";
import {
    getCategories_thunk,
    addCategory_thunk,
    updateCategory_thunk,
    deleteCategory_thunk,
} from "../../store/actionCreators/categories";

// Style Imports
import "../../../public/assets/admin.css";

// Component Imports
import CategoryDialog from "./dialogs/CategoryDialog.jsx";
import AreYouSure from "../AreYouSure.jsx";

class AdminCategories extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            categories: [],
            dialogueOpen: [],
            newCategoryDialog: false,
            deleteDialog: false,
            categoryDeleteStaged: NaN,
        };

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleOpenPost = this.handleOpenPost.bind(this);
        this.handleClosePost = this.handleClosePost.bind(this);
        this.handleSubmitPost = this.handleSubmitPost.bind(this);
        this.openDelete = this.openDelete.bind(this);
        this.closeDelete = this.closeDelete.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    async componentDidMount() {
        await this.props.loadAllCategories();

        const { allCategories } = this.props;

        let dialogueOpen = [];
        for (let i = 0; i < allCategories.length; i++) {
            dialogueOpen.push({
                active: false,
                categoryId: allCategories[i].id,
            });
        }

        this.setState({
            ...this.state,
            loading: false,
            categories: allCategories.sort((a, b) => a.id - b.id),
            dialogueOpen,
        });
    }

    handleOpenPost() {
        this.setState({
            ...this.state,
            newCategoryDialog: true,
        });
    }

    handleClosePost() {
        this.setState({
            ...this.state,
            newCategoryDialog: false,
        });
    }

    async handleSubmitPost(id, name) {
        const { addCategory } = this.props;

        await addCategory({ name });

        const { allCategories } = this.props;

        const dialogueOpen = [];
        for (let i = 0; i < allCategories.length; i++) {
            dialogueOpen.push({
                active: false,
                categoryId: allCategories[i].id,
            });
        }

        this.setState(
            {
                ...this.state,
                categories: allCategories.sort((a, b) => a.id - b.id),
                dialogueOpen,
            },
            () => {
                this.handleClosePost();
            },
        );
    }

    handleOpen(id) {
        const { dialogueOpen } = this.state;
        const newDialogueOpen = dialogueOpen.map((obj) => {
            if (obj.categoryId === id) {
                return { active: true, categoryId: obj.categoryId };
            } else {
                return { active: false, categoryId: obj.categoryId };
            }
        });

        this.setState({
            ...this.state,
            dialogueOpen: newDialogueOpen,
        });
    }

    handleClose() {
        const { categories } = this.state;
        let dialogueOpen = [];
        for (let i = 0; i < categories.length; i++) {
            dialogueOpen.push({
                active: false,
                categoryId: categories[i].id,
            });
        }

        this.setState({
            ...this.state,
            dialogueOpen,
        });
    }

    async handleSubmit(id, name) {
        const { updateCategory } = this.props;
        await updateCategory({ id, name });

        const { allCategories } = this.props;

        this.setState({
            ...this.state,
            categories: allCategories.sort((a, b) => a.id - b.id),
        });

        this.handleClose();
    }

    openDelete(id) {
        this.setState({
            ...this.state,
            deleteDialog: true,
            categoryDeleteStaged: id,
        });
    }
    closeDelete() {
        this.setState({
            ...this.state,
            deleteDialog: false,
            categoryDeleteStaged: NaN,
        });
    }

    async handleDelete() {
        const { categoryDeleteStaged } = this.state;
        await this.props.deleteCategory(categoryDeleteStaged);

        const { allCategories } = this.props;
        this.setState(
            {
                ...this.state,
                categories: allCategories.sort((a, b) => a.id - b.id),
            },
            () => {
                this.closeDelete();
            },
        );
    }

    render() {
        const {
            loading,
            categories,
            dialogueOpen,
            newCategoryDialog,
            deleteDialog,
        } = this.state;

        if (loading) {
            return <React.Fragment>Loading...</React.Fragment>;
        }

        return (
            <div id="admin-view">
                <div id="order-title-container" className="order-item">
                    <h3 id="order-title">Category List</h3>
                </div>
                <CategoryDialog
                    open={newCategoryDialog}
                    close={this.handleClosePost}
                    submit={this.handleSubmitPost}
                    {...{
                        name: "",
                    }}
                />
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={this.handleOpenPost}
                >
                    Create New Category
                </Button>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    {categories.map((category) => {
                        const dialog = dialogueOpen.filter(
                            (obj) => obj.categoryId === category.id,
                        )[0].active;
                        return (
                            <tbody key={category.id}>
                                <tr>
                                    <td>{category.id}</td>
                                    <td>{category.name}</td>
                                    <td className="img-container">
                                        <img
                                            className="edit-img"
                                            src="/images/utils/editUser.png"
                                            alt=""
                                            onClick={() =>
                                                this.handleOpen(category.id)
                                            }
                                        />
                                        <CategoryDialog
                                            open={dialog}
                                            close={this.handleClose}
                                            submit={this.handleSubmit}
                                            {...category}
                                        />
                                    </td>
                                    <td className="img-container">
                                        <img
                                            className="delete-img"
                                            src="/images/utils/delete.png"
                                            alt=""
                                            onClick={() =>
                                                this.openDelete(category.id)
                                            }
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        );
                    })}
                    <AreYouSure
                        message="Are you sure you want to delete this category?"
                        open={deleteDialog}
                        close={this.closeDelete}
                        userFn={this.handleDelete}
                    />
                </table>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        allCategories: state.allCategories,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadAllCategories: () => dispatch(getCategories_thunk()),
        addCategory: (category) => dispatch(addCategory_thunk(category)),
        updateCategory: (category) => dispatch(updateCategory_thunk(category)),
        deleteCategory: (id) => dispatch(deleteCategory_thunk(id)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminCategories);
