import React, { Component } from "react";

// React-Redux
import { connect } from "react-redux";

// Redux Imports
import { getSingleProduct } from "../store/actionCreators/singleProduct";
import { getAllProducts } from "../store/actionCreators/allProducts";
import EditProduct from "./EditProduct.jsx";
import store from "../store/store";
import ReviewForm from "./Review/FormReview.jsx";
import ReviewsPerProduct from "./Review/ReviewsProduct.jsx";
import { Link } from "react-router-dom";

import {
    addItemToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
} from "../store/actionCreators/shoppingCart";

class SingleProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allProducts: [],
            loading: true,
            editToggle: false,
            cart: [],
            totalPrice: 0,
            productsInCart: [],
        };
        this.handleEditToggle = this.handleEditToggle.bind(this);
        this.addToCart = this.addToCart.bind(this);
        this.deleteFromCart = this.deleteFromCart.bind(this);
        this.incrementQuantity = this.incrementQuantity.bind(this);
        this.decrementQuantity = this.decrementQuantity.bind(this);
    }
    async componentDidMount() {
        const id = this.props.match.params.id * 1;
        await this.props.getSingleProduct(id);
        await this.props.getAllProducts();
        //await this.props.getReviewForProduct(id);
        await this.setState({ loading: false });
        //  await this.setState({reviews: store.getState().reviews})
        let userId;
        (await store.getState().signedIn.isSignedIn) === false
            ? (userId = 1)
            : (userId = await store.getState().signedIn.user.id);
        const cartOnMount = await this.props.addItemToCart(null, userId);
        await this.setState({
            ...this.state,
            allProducts: store.getState().allProducts,
            productsInCart: this.props.cart,
        });
    }

    async handleEditToggle() {
        if (this.state.editToggle === false) {
            this.setState({ editToggle: true });
        } else if (this.state.editToggle === true) {
            this.setState({ editToggle: false });
        }
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

    render() {
        const { loading, editToggle } = this.state;
        if (loading) return "loading";
        const { singleProduct } = this.props;
        const { isSignedIn } = this.props.signedIn;
        const { user } = this.props.signedIn;

        let displayCart = this.state.productsInCart[
            this.state.productsInCart.length - 1
        ];

        const formatter = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
        });

        return (
            <div>
                <div id="product-container">
                    {/* <button onClick={this.handleEditToggle}>Edit</button> */}
                    {/* {editToggle === false ? null : (
                        <EditProduct props={singleProduct} />
                    )} */}
                    <div id="single-product-img-container">
                        <img
                            className="single-product-image"
                            src={singleProduct.imgUrl}
                        />
                    </div>
                    <div id="single-product-info">
                        <div id="product-reviews">
                            {isSignedIn ? (
                                <ReviewForm
                                    singleProductId={singleProduct.id}
                                    userId={user.id}
                                />
                            ) : (
                                <h3>
                                    Wanna leave a{" "}
                                    <Link to="/sign-up">Review?</Link>
                                </h3>
                            )}
                            <div>
                                <h2 id="review-list-title">Reviews:</h2>
                                <ReviewsPerProduct
                                    singleProductId={singleProduct.id}
                                />
                            </div>
                        </div>
                        <div id="product-direct-information">
                            <div id="product-title-container">
                                <h2 id="single-product-title">
                                    {singleProduct.name}
                                </h2>
                            </div>
                            <div id="product-year">
                                <h3 id="single-product-year">
                                    {singleProduct.year.substring(0, 4)}
                                </h3>
                            </div>
                            <div id="artist-info">
                                <h3 id="artist-name">
                                    {singleProduct.artistName}
                                </h3>
                                <h3 id="artist-nationality">
                                    {singleProduct.nationality}
                                </h3>
                            </div>
                            <div id="item-description-container">
                                <p id="item-description">
                                    {singleProduct.description}
                                </p>
                            </div>
                            <div id="purchase-information">
                                <div id="item-price-quant">
                                    <h3 id="quantity-info">
                                        In stock: {singleProduct.stock}
                                    </h3>
                                    <h3 id="price-info">
                                        {formatter.format(singleProduct.price)}
                                    </h3>
                                </div>
                                <div id="add-to-cart-btn-container">
                                    <button
                                        className="button -dark button-size-md"
                                        onClick={() => {
                                            this.addToCart(singleProduct);
                                        }}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                            <div id="tag-container">
                                <h3 id="tag-info">Tags: </h3>
                                <div id="categorie-cont">
                                    {singleProduct.categories.map((currCat) => {
                                        return (
                                            <div
                                                className="category-single-product"
                                                key={currCat.id}
                                            >
                                                <p>{currCat.name}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

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

const mapStateToProps = (state) => {
    return {
        singleProduct: state.singleProduct,
        signedIn: state.signedIn,
        cart: state.cart.cart,
        total: state.cart.total,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getSingleProduct: (id) => dispatch(getSingleProduct(id)),
        getAllProducts: () => dispatch(getAllProducts()),
        addItemToCart: (currProduct, userId) =>
            dispatch(addItemToCart(currProduct, userId)),
        deleteFromCart: (currProduct, userId) =>
            dispatch(removeFromCart(currProduct, userId)),
        incrementQuantity: (currProduct, userId) =>
            dispatch(increaseQuantity(currProduct, userId)),
        decrementQuantity: (currProduct, userId) =>
            dispatch(decreaseQuantity(currProduct, userId)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleProduct);
