import React, { Component, useState } from "react";
import axios from "axios";

// React-Redux Imports
import { connect } from "react-redux";
import StripeCheckout from "react-stripe-checkout";
import { toast } from "react-toastify";

// Redux Imports
import {
  addItemToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  emptyCart,
} from "../store/actionCreators/shoppingCart";
// import TakeMoney from "./CheckoutWithStripe.jsx";
import { getAllProducts } from "../store/actionCreators/allProducts";

import store from "../store/store";

// React-Router Imports
import { Link } from "react-router-dom";

// Style Imports
import "../../public/assets/style.css";

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: [],
      totalPrice: 0,
      productsInCart: [],
      loading: true,
      orders: [],
    };
    this.addToCart = this.addToCart.bind(this);
    this.deleteFromCart = this.deleteFromCart.bind(this);
    this.incrementQuantity = this.incrementQuantity.bind(this);
    this.decrementQuantity = this.decrementQuantity.bind(this);
    this.handleToken = this.handleToken.bind(this);
  }

  async componentDidMount() {
    console.log("CART ON MOUNT", this.props.cart);
    let userId;
    await this.props.getAllProducts();
    (await store.getState().signedIn.isSignedIn) === false
      ? (userId = 1)
      : (userId = await store.getState().signedIn.user.id);
    const cartOnMount = await this.props.addItemToCart(null, userId);
    await this.setState(
      {
        ...this.state,
        allProducts: store.getState().allProducts,
        productsInCart: this.props.cart,
        loading: false,
      },
      () => {
        console.log(
          "ProductsInCart",
          this.state.productsInCart[this.state.productsInCart.length - 1]
        );
      }
    );
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

  // API {
  //     products: [ { id: #, quantity: # }, { id: another #, quantity: # }, ...],
  //     userId: #,
  // }

  async handleToken(token, addresses) {
    let userId;
    (await store.getState().signedIn.isSignedIn) === false
      ? (userId = 1)
      : (userId = await store.getState().signedIn.user.id);
    const tokenToSend = {
      token,
      total: this.props.total,
      cart: this.props.cart[this.props.cart.length - 1],
    };
    let cart = await this.props.cart[this.props.cart.length - 1];
    const createOrder = {
      products: cart,
      userId: userId,
    };
    const response = await axios.post("/api/checkout", { tokenToSend });
    const { status } = response.data;
    console.log("STRIPE SUCCES??", status);
    if (status === "success") {
      await axios.post("/api/orders", createOrder);
      await this.props.emptyCart();
      await this.setState({ ...this.state, productsInCart: [] }, async () => {
        const orders = await (await axios.get("/api/orders")).data;
        console.log("orders", orders);
        await this.setState({
          ...this.state,
          orders: orders[orders.length - 1].products,
        });
      });
      toast("Success! Check email for details", { type: "success" });
    } else {
      toast("Something went wrong", { type: "error" });
    }
  }

  render() {
    console.log("CART CART", this.props.cart[this.props.cart.length - 1]);
    console.log(
      "PRODUCTS IN CART",
      this.state.productsInCart[this.state.productsInCart.length - 1]
    );
    const { loading, orders } = this.state;
    if (loading) {
      return "loading...";
    }

    const userStatus = store.getState().signedIn.isSignedIn;

    let displayCart = [];
    if (this.state.productsInCart.length) {
      if (
        this.state.productsInCart[this.state.productsInCart.length - 1].length
      ) {
        displayCart = this.state.productsInCart[
          this.state.productsInCart.length - 1
        ].sort((a, b) => a.id - b.id);
      }
    }

    const totalPrice = this.state.totalPrice;
    const { filterProducts } = this.props;
    const productsInCart = this.state.productsInCart;

    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });

    const { allProducts } = this.props;
    return (
      <div id="cart-container">
        {productsInCart.length >= 1 ? (
          <div id="card-container-layer">
            <h2 id="cart-title">Cart Summary</h2>
            <ul id="cart-item-container">
              {displayCart.length ? (
                displayCart.map((product, idx) => {
                  const { imgUrl, price, id, stock } = allProducts.filter(
                    (p) => p.name === product.name
                  )[0];
                  return (
                    <li key={idx} className="cart-item">
                      <a href={`/#/product/${id}`} className="cart-link">
                        <img className="cart-item-img" src={imgUrl} />
                      </a>
                      <div className="product-info-cart">
                        <Link
                          to={`/product/${id}`}
                          className="product-cart-title-link"
                        >
                          <p className="product-title-cart">{product.name}</p>
                        </Link>
                        <p className="product-quantity-cart">
                          <span className="bold">Quantity:</span>{" "}
                          {product.quantity}
                        </p>
                        <p className="product-price-cart">
                          <span className="bold">Price:</span>{" "}
                          {formatter.format(price)} each
                        </p>
                      </div>
                      <div className="product-btns">
                        <div className="product-edit-cart">
                          {product.quantity < stock ? (
                            <button
                              className="product-small-btn-cart"
                              onClick={() => {
                                this.incrementQuantity(product);
                              }}
                            >
                              ▲
                            </button>
                          ) : (
                            <button
                              disabled
                              className="product-small-btn-cart"
                              onClick={() => {
                                this.incrementQuantity(product);
                              }}
                            >
                              ▲
                            </button>
                          )}

                          {product.quantity > 0 ? (
                            <button
                              className="product-small-btn-cart"
                              onClick={() => {
                                this.decrementQuantity(product);
                              }}
                            >
                              ▼
                            </button>
                          ) : (
                            <button
                              disabled
                              className="product-small-btn-cart"
                              onClick={() => {
                                this.decrementQuantity(product);
                              }}
                            >
                              ▼
                            </button>
                          )}
                        </div>
                        <div className="product-delete-cart">
                          <p
                            className="product-small-cart"
                            onClick={() => {
                              this.deleteFromCart(product);
                            }}
                          >
                            Remove
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })
              ) : (
                <li className="cart-item no-items">No Products In Cart</li>
              )}
            </ul>
            <div id="checkout-container">
              <h3 id="total-cart">
                Total: {formatter.format(this.props.total)}
              </h3>
              <div id="stripe-container">
                <StripeCheckout
                  token={this.handleToken}
                  stripeKey="pk_test_51ImoMPDR0fOunmqd1floGlmv6CuKmfeOFFy9IXUUAijzk9ESftuvY0s0WPVH14WLmUoAFepbwOIHGf8P1GZhX7cg00E3K13wPG"
                  billingAddress
                  shippingAddress
                  amount={totalPrice * 100}
                />
              </div>
            </div>
          </div>
        ) : (
          <div id="card-container-layer">
            <div id="orderComplete">
              <h2 className="cartTitle">
                <strong>Order Complete</strong>
              </h2>
              <h3>Thank you for your puchase!</h3>
              <h4>You bought the below items: </h4>
              {/* <br /> */}
              <ul>
                {orders.length >= 1 ? (
                  orders.map((order, idx) => {
                    return (
                      <li key={idx} id="purchased">
                        <strong>Product Name: </strong>
                        {order.name}
                        <br />
                        <strong>Quantity: </strong>
                        {order.productsOrders.quantity}
                        <br />
                        <strong>Price: </strong>
                        {order.price}
                      </li>
                    );
                  })
                ) : (
                  <p>Order Failed</p>
                )}
              </ul>
            </div>
          </div>
        )}
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
    emptyCart: () => dispatch(emptyCart()),
  };
};

const mapStateToProps = (state) => {
  return {
    cart: state.cart.cart,
    total: state.cart.total,
    allProducts: state.allProducts,
    signedInUser: state.signedIn,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
