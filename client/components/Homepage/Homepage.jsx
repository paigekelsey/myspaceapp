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
                        src="https://static.boredpanda.com/blog/wp-content/uploads/2017/01/i-Tried-to-Make-Van-Gogh-Paintings-full-of-life-and-these-are-the-results-5875759f1a199__605.gif"
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
