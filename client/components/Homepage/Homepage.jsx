import React, { Component } from "react";

// React Router Imports
import { Link } from "react-router-dom";

// Redux Improts
import { connect } from "react-redux";

// Style Import
import "../../../public/assets/homepage.css";

// Data Imports
import CAROUSEL_DATA from "./carouselImageData";

class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { user, isSignedIn } = this.props.signedInUser;

        console.log(user);
        return (
            <div id="homepage-lander">
                <Link to="/store">
                    <img
                        id="homegif"
                        src="https://cdn.shopify.com/s/files/1/2145/7059/products/SafeSpace_sticker_1000x.gif?v=1604899004"
                        alt="art gif"
                        //   width="500"
                        //   height="600"
                    />
                </Link>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        signedInUser: state.signedIn,
    };
}

export default connect(mapStateToProps)(Homepage);
