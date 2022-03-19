import axios from "axios";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import StarRatingComponent from "react-star-rating-component";

const SingleReview = ({ currReview }) => {
    const [user, setUsers] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            const { data: user } = await axios.get(
                `/api/users/${currReview.userId}`,
            );
            setUsers(user);
        };
        getUsers();
    }, []);

    return (
        <React.Fragment>
            <p className="review-detail">{currReview.detail}</p>
            <p className="review-author">Written By: {user.username}</p>
            <div>
                <StarRatingComponent
                    name="rating"
                    value={currReview.rating}
                    editing={false}
                />
            </div>
        </React.Fragment>
    );
};

const mapStateToProps = (state, otherProps) => {
    return {
        state,
        otherProps,
    };
};

export default connect(mapStateToProps)(SingleReview);
