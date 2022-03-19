import React, { Component } from "react";
import { connect } from "react-redux";

class GoogleSignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgLink: "/images/utils/google-normal.png",
        };
        this.toDark = this.toDark.bind(this);
        this.toLight = this.toLight.bind(this);
    }

    componentDidMount() {
        window.addEventListener("mouseup", this.toLight);
    }

    componentWillUnmount() {
        window.removeEventListener("mouseup", this.toLight);
    }

    toDark() {
        this.setState({
            imgLink: "/images/utils/google-pressed.png",
        });
    }

    toLight() {
        this.setState({
            imgLink: "/images/utils/google-normal.png",
        });
    }

    render() {
        const { imgLink } = this.state;
        return (
            <div className="oauth-container">
                <a
                    href="/api/auth/google"
                    onMouseDown={this.toDark}
                    className="google-oauth-link"
                >
                    <img className="oauth-img" src={imgLink} alt="" />
                </a>
            </div>
        );
    }
}

export default connect()(GoogleSignUp);
