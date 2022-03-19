import React, { Component } from "react";

// React Router Imports
import { NavLink } from "react-router-dom";

// Material UI Imports
import Button from "@material-ui/core/Button";

// Redux Imports
import { connect } from "react-redux";
import { getAllProducts } from "../../store/actionCreators/allProducts";
import { getCategories_thunk } from "../../store/actionCreators/categories";
import { updateProduct_adminAccess } from "../../store/actionCreators/singleProduct";
import { adminAddProduct } from "../../store/actionCreators/singleProduct";
import { deleteProduct_thunk } from "../../store/actionCreators/singleProduct";

// Component Imports
import ProductDialogue from "./dialogs/ProductDialogue.jsx";
import AreYouSure from "../AreYouSure.jsx";

class AdminInventory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            products: [],
            allCategories: [],
            dialogueOpen: [],
            newProductDialog: false,
            deleteDialog: false,
            productDeleteStaged: NaN,
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
        await this.props.loadAllProducts();
        await this.props.loadAllCategories();
        const { allProducts, allCategories } = this.props;

        let dialogueOpen = [];
        for (let i = 0; i < allProducts.length; i++) {
            dialogueOpen.push({ active: false, productId: allProducts[i].id });
        }

        this.setState({
            ...this.state,
            loading: false,
            products: allProducts.sort((a, b) => a.id - b.id),
            allCategories,
            dialogueOpen,
        });
    }

    handleOpenPost() {
        this.setState({
            ...this.state,
            newProductDialog: true,
        });
    }

    handleClosePost() {
        this.setState({
            ...this.state,
            newProductDialog: false,
        });
    }

    async handleSubmitPost(
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
    ) {
        const { addProduct, allCategories } = this.props;

        const validCats = allCategories.filter((cat) => {
            for (const [name, val] of Object.entries(categories)) {
                if (name === cat.name && val) {
                    return cat;
                }
            }
        });

        await addProduct({
            name,
            description,
            price,
            year,
            stock,
            imgUrl,
            categories: validCats,
            artistName,
            nationality,
        });

        const { allProducts } = this.props;

        const dialogueOpen = [];
        for (let i = 0; i < allProducts.length; i++) {
            dialogueOpen.push({ active: false, productId: allProducts[i].id });
        }

        this.setState(
            {
                ...this.state,
                products: allProducts.sort((a, b) => a.id - b.id),
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
            if (obj.productId === id) {
                return { active: true, productId: obj.productId };
            } else {
                return { active: false, productId: obj.productId };
            }
        });

        this.setState({
            ...this.state,
            dialogueOpen: newDialogueOpen,
        });
    }

    handleClose() {
        const { products } = this.state;
        let dialogueOpen = [];
        for (let i = 0; i < products.length; i++) {
            dialogueOpen.push({ active: false, productId: products[i].id });
        }

        this.setState({
            ...this.state,
            dialogueOpen,
        });
    }

    async handleSubmit(
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
    ) {
        const { updateProduct, allCategories } = this.props;

        const validCats = allCategories.filter((cat) => {
            for (const [name, val] of Object.entries(categories)) {
                if (name === cat.name && val) {
                    return cat;
                }
            }
        });

        await updateProduct({
            id,
            name,
            description,
            price,
            year,
            stock,
            imgUrl,
            categories: validCats,
            artistName,
            nationality,
        });

        const { allProducts } = this.props;

        this.setState({
            ...this.state,
            products: allProducts.sort((a, b) => a.id - b.id),
        });

        this.handleClose();
    }

    openDelete(id) {
        this.setState({
            ...this.state,
            deleteDialog: true,
            productDeleteStaged: id,
        });
    }
    closeDelete() {
        this.setState({
            ...this.state,
            deleteDialog: false,
            productDeleteStaged: NaN,
        });
    }

    async handleDelete() {
        const { productDeleteStaged } = this.state;
        await this.props.deleteProduct(productDeleteStaged);

        const { allProducts } = this.props;
        this.setState({
            ...this.state,
            products: allProducts.sort((a, b) => a.id - b.id),
        });

        this.closeDelete();
    }

    render() {
        const {
            loading,
            products,
            dialogueOpen,
            newProductDialog,
            deleteDialog,
        } = this.state;

        if (loading) {
            return <React.Fragment>Loading...</React.Fragment>;
        }

        return (
            <div id="admin-view">
                <div id="order-title-container" className="order-item">
                    <h3 id="order-title">Inventory</h3>
                </div>
                <ProductDialogue
                    open={newProductDialog}
                    close={this.handleClosePost}
                    submit={this.handleSubmitPost}
                    {...{
                        name: "",
                        description: "",
                        price: "",
                        year: "",
                        stock: "",
                        imgUrl: "",
                        categories: [],
                        nationality: "",
                        artistName: "",
                    }}
                    title="Create New Product"
                />
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={this.handleOpenPost}
                >
                    Create New Product
                </Button>
                <table id="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Image Preview</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Year</th>
                            <th>Stock</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    {products.map((product) => {
                        const dialog = dialogueOpen.filter(
                            (obj) => obj.productId === product.id,
                        )[0].active;
                        return (
                            <tbody key={product.id}>
                                <tr>
                                    <td>{product.id}</td>
                                    <td>
                                        <NavLink to={`/product/${product.id}`}>
                                            <img
                                                className="product-img"
                                                src={`${product.imgUrl}`}
                                            ></img>
                                        </NavLink>
                                    </td>
                                    <td>
                                        <NavLink
                                            className="product-link-admin"
                                            to={`/product/${product.id}`}
                                        >
                                            {product.name}
                                        </NavLink>
                                    </td>
                                    <td>{product.price}</td>
                                    <td>{product.year.substring(0, 4)}</td>
                                    <td>{product.stock}</td>
                                    <td className="img-container">
                                        <img
                                            className="edit-img"
                                            src="/images/utils/editUser.png"
                                            alt=""
                                            onClick={() =>
                                                this.handleOpen(product.id)
                                            }
                                        />
                                        <ProductDialogue
                                            open={dialog}
                                            close={this.handleClose}
                                            submit={this.handleSubmit}
                                            {...product}
                                            title="Edit Product Details"
                                        />
                                    </td>
                                    <td className="img-container">
                                        <img
                                            className="delete-img"
                                            src="/images/utils/delete.png"
                                            alt=""
                                            onClick={() =>
                                                this.openDelete(product.id)
                                            }
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        );
                    })}
                    <AreYouSure
                        message="Are you sure you want to delete this product?"
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
        allProducts: state.allProducts,
        allCategories: state.allCategories,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadAllProducts: () => dispatch(getAllProducts()),
        loadAllCategories: () => dispatch(getCategories_thunk()),
        updateProduct: (product) =>
            dispatch(updateProduct_adminAccess(product)),
        addProduct: (product) => dispatch(adminAddProduct(product)),
        deleteProduct: (id) => dispatch(deleteProduct_thunk(id)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminInventory);
