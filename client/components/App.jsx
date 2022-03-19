import React, { Component } from "react";

// Redux Imports
import { connect } from "react-redux";
import { attemptTokenLogin } from "../store/actionCreators/singleUser";
import { getAllProducts } from "../store/actionCreators/allProducts";
import { addItemToCart } from "../store/actionCreators/shoppingCart";

// React Router Imports
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom";

// Component Imports
import Header from "./Header.jsx";
import Homepage from "./Homepage/Homepage.jsx";
import AllProducts from "./AllProducts.jsx";
import { SignUp, SignIn } from "./Forms";
import SingleProduct from "./SingleProduct.jsx";
import { thunkLoadReviews } from "../store/actionCreators/reviews";
import SingleUser from "./Users/SingleUser.jsx";
import Cart from "./Cart.jsx";
import SearchBar from "./SearchBar.jsx";
import AdminPortal from "./Admin/AdminPortal.jsx";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        // Search for a token in localStorage so users will stay signed in on refresh
        await this.props.attemptLogin();
        await this.props.allProducts();
        await this.props.loadReviews();

        const { signedInUser } = this.props;

        // Populates the cart if you had one mid-session last time
        if (signedInUser.isSignedIn) {
            await this.props.addItemToCart(null, signedInUser.user.id);
        }
    }

    render() {
        return (
            <Router>
                <React.Fragment>
                    <Header />
                    <main className="main-view">
                        <Switch>
                            <Route exact path="/" component={Homepage} />
                            <Route exact path="/cart" component={Cart} />
                            <Route exact path="/store" component={SearchBar} />
                            <Route
                                exact
                                path="/product/:id"
                                component={SingleProduct}
                            />
                            <Route exact path="/sign-up" component={SignUp} />
                            <Route exact path="/sign-in" component={SignIn} />
                            <Route path="/user/:id" component={SingleUser} />
                            <Route path="/admin" component={AdminPortal} />
                        </Switch>
                    </main>
                </React.Fragment>
            </Router>
        );
    }
}

function mapStateToProps(state) {
    return {
        signedInUser: state.signedIn,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        attemptLogin: () => dispatch(attemptTokenLogin()),
        allProducts: () => dispatch(getAllProducts()),
        loadReviews: () => dispatch(thunkLoadReviews()),
        addItemToCart: (currProduct, userId) =>
            dispatch(addItemToCart(currProduct, userId)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
