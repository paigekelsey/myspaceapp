import React, { Component } from "react";
import { connect } from "react-redux";
import ReviewsPerProduct from "./ReviewsProduct.jsx";
import { thunkAddReview } from "../../store/actionCreators/reviews";
import StarRatingComponent from "react-star-rating-component";

class ReviewForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detail: "",
            rating: 1,
            productId: this.props.singleProductId,
            userId: this.props.userId,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(evt) {
        const review = {};
        review[evt.target.name] = evt.target.value;
        this.setState(review);
    }
    handleSubmit(evt) {
        evt.preventDefault();
        this.props.addReview({ ...this.state });
        this.setState({
            detail: "",
            rating: 1,
        });
    }
    onStarClick(nextValue, prevValue, name) {
        this.setState({ rating: nextValue });
    }

    render() {
        const { detail, rating } = this.state;
        const { handleChange, handleSubmit } = this;

        return (
            <React.Fragment>
                <div id="review-form-title-container">
                    <h2 id="review-form-title">Review Form</h2>
                </div>
                <form id="review-form-actual" onSubmit={handleSubmit}>
                    <div id="review-input">
                        <label htmlFor="detail">Thoughts? &nbsp;</label>
                        <input
                            name="detail"
                            onChange={handleChange}
                            value={detail}
                            required
                        />
                    </div>
                    <div id="review-post">
                        <StarRatingComponent
                            name="rate1"
                            starCount={5}
                            value={rating}
                            onStarClick={this.onStarClick.bind(this)}
                        />
                        <button
                            className="button -regular button-size-sm"
                            id="submit-review"
                            type="submit"
                        >
                            Post Review
                        </button>
                    </div>
                </form>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state, otherProps) => {
    return {
        state,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        addReview: (review) => dispatch(thunkAddReview(review)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewForm);
