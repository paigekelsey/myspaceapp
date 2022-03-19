import React, { Component, useState } from "react";
import Select from "react-select";

// React-Redux Imports
import { connect } from "react-redux";

// Redux Imports
import { getAllProducts } from "../store/actionCreators/allProducts";
import { getCategories_thunk } from "../store/actionCreators/categories";
import {
    addItemToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
} from "../store/actionCreators/shoppingCart";

import store from "../store/store";

// React-Router Imports
import { Link } from "react-router-dom";

// Style Imports
import "../../public/assets/style.css";

class AllProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allProducts: [],
            cart: [],
            totalPrice: 0,
            productsInCart: [],
            categories: [],
            category: "",
        };
        this.addToCart = this.addToCart.bind(this);
        this.deleteFromCart = this.deleteFromCart.bind(this);
        this.incrementQuantity = this.incrementQuantity.bind(this);
        this.decrementQuantity = this.decrementQuantity.bind(this);
        this.setCategory = this.setCategory.bind(this);
    }

    async componentDidMount() {
        let userId;
        await this.props.loadCategories();
        const cats = this.props.categories.map((cat) => {
            return {
                label: cat.name,
                value: cat.name,
            };
        });

        (await store.getState().signedIn.isSignedIn) === false
            ? (userId = 1)
            : (userId = await store.getState().signedIn.user.id);
        await this.props.getAllProducts();
        const cartOnMount = await this.props.addItemToCart(null, userId);
        await this.setState({
            ...this.state,
            allProducts: store.getState().allProducts,
            productsInCart: this.props.cart,
            categories: [{ label: "All", value: "" }, ...cats],
        });
    }

    async addToCart(event) {
        let userId;
        (await store.getState().signedIn.isSignedIn) === false
            ? (userId = 1)
            : (userId = await store.getState().signedIn.user.id);
        await this.props.addItemToCart(event, userId);
        await this.setState({ ...this.state, productsInCart: this.props.cart });
    }

    async deleteFromCart(event) {
        let userId;
        (await store.getState().signedIn.isSignedIn) === false
            ? (userId = 1)
            : (userId = await store.getState().signedIn.user.id);
        await this.props.deleteFromCart(event, userId);
        await this.setState({ ...this.state, productsInCart: this.props.cart });
    }

    async incrementQuantity(event) {
        let currStock = 0;
        this.state.allProducts.map((product) => {
            if (product.name === event.name) {
                currStock = product.stock;
            }
        });
        let userId;
        (await store.getState().signedIn.isSignedIn) === false
            ? (userId = 1)
            : (userId = await store.getState().signedIn.user.id);
        if (event.quantity < currStock) {
            await this.props.incrementQuantity(event, userId);
            await this.setState({
                ...this.state,
                productsInCart: this.props.cart,
            });
        }
    }

    async decrementQuantity(event) {
        let userId;
        (await store.getState().signedIn.isSignedIn) === false
            ? (userId = 1)
            : (userId = await store.getState().signedIn.user.id);
        await this.props.decrementQuantity(event, userId);
        await this.setState({
            ...this.state,
            productsInCart: this.props.cart,
        });
    }

    async setCategory(category) {
        this.setState({ category: category });
    }

    render() {
        const userStatus = store.getState().signedIn.isSignedIn;
        const allProducts = this.state.allProducts;
        const categories = this.state.category;
        let displayCart = this.state.productsInCart[
            this.state.productsInCart.length - 1
        ];
        const totalPrice = this.state.totalPrice;
        const { filterProducts } = this.props;

        return (
            <div id="store-main-page">
                <div id="categories">
                    <Select
                        options={this.state.categories}
                        onChange={(options) => {
                            this.setCategory(options.value);
                        }}
                    />
                </div>
                {categories === "" ? (
                    <div id="all-products-container">
                        {filterProducts.map((product) => {
                            return (
                                <div key={product.id} className="product-item">
                                    <Link to={`/product/${product.id}`}>
                                        <img
                                            src={product.imgUrl}
                                            className="product-image"
                                        />
                                    </Link>
                                    <Link
                                        to={`/product/${product.id}`}
                                        className="product-link"
                                    ></Link>
                                    <p className="product-text product-title">
                                        {product.name}
                                    </p>
                                    <p className="product-text product-artist">
                                        {product.artistName} |{" "}
                                        {product.nationality}
                                    </p>
                                    <button
                                        className="nudge button -mid elastic-fix"
                                        onClick={() => {
                                            this.addToCart(product);
                                        }}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div id="all-products-container">
                        {filterProducts.map((product) => {
                            return product.categories.map((category) => {
                                if (category.name === categories) {
                                    return (
                                        <div
                                            key={product.id}
                                            className="product-item"
                                        >
                                            <Link to={`/product/${product.id}`}>
                                                <img
                                                    src={product.imgUrl}
                                                    className="product-image"
                                                />
                                            </Link>
                                            <Link
                                                to={`/product/${product.id}`}
                                                className="product-link"
                                            ></Link>
                                            <p className="product-text product-title">
                                                {product.name}
                                            </p>
                                            <p className="product-text product-artist">
                                                {product.artistName} |{" "}
                                                {product.nationality}
                                            </p>
                                            <button
                                                className="nudge button -mid elastic-fix"
                                                onClick={() => {
                                                    this.addToCart(product);
                                                }}
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    );
                                }
                            });
                        })}
                    </div>
                )}
                {/* <div id="cart-summary">
          <h2 className="cartTitle">
            <strong>Cart Summary</strong>
          </h2>
          <ul>
            {displayCart ? (
              displayCart.map((product, idx) => (
                <li key={idx} className="cartList">
                  <strong>Name:</strong> {product.name}{" "}
                  <strong>Quantity:</strong> {product.quantity}{" "}
                  <button
                    onClick={() => {
                      this.incrementQuantity(product);
                    }}
                  >
                    +
                  </button>
                  {product.quantity > 0 ? (
                    <button
                      onClick={() => {
                        this.decrementQuantity(product);
                      }}
                    >
                      -
                    </button>
                  ) : (
                    <button>-</button>
                  )}
                  <button
                    onClick={() => {
                      this.deleteFromCart(product);
                    }}
                  >
                    Delete
                  </button>
                </li>
              ))
            ) : (
              <p>No Products In Cart</p>
            )}
          </ul>
          <h3>Total ${this.props.total}</h3>
          <a href="#/cart">
            <button>Proceed To Checkout</button>
          </a>
        </div> */}
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getAllProducts: () => dispatch(getAllProducts()),
        addItemToCart: (currProduct, userId) =>
            dispatch(addItemToCart(currProduct, userId)),
        deleteFromCart: (currProduct, userId) =>
            dispatch(removeFromCart(currProduct, userId)),
        incrementQuantity: (currProduct, userId) =>
            dispatch(increaseQuantity(currProduct, userId)),
        decrementQuantity: (currProduct, userId) =>
            dispatch(decreaseQuantity(currProduct, userId)),
        loadCategories: () => dispatch(getCategories_thunk()),
    };
};

const mapStateToProps = (state) => {
    return {
        cart: state.cart.cart,
        total: state.cart.total,
        categories: state.allCategories,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AllProducts);
